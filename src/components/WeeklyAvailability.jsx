import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import s from "../styles/App.module.css";
import AppHeader from "./AppHeader";
import DayColumn from "./DayColumn";
import EditModal from "./EditModal";
import OuterGrid from "./OuterGrid";
import SideBar from "./SideBar";
import TopBar from "./TopBar";
import { appStore, WEEKDAYS } from "../lib/constants";
import {
	getElementRect,
	getMergedTimeslots,
	snap,
	throttle,
	yPosToTime,
} from "../lib/helpers";
import { unwrap } from "solid-js/store";
import idMaker from "@melodev/id-maker";

export default function WeeklyAvailability(props) {
	let gridRef;
	let lastSelectedItem;
	const [store, setStore] = appStore;
	const [screenWidth, setScreenWidth] = createSignal(0);
	const [width, setWidth] = createSignal(0);

	const getSlot = (day, id) => store.availability[day].find(s => s.id === id);
	const columnWidth = () => width() / 7;

	function handleScreenResize(e) {
		setScreenWidth(window.innerWidth);

		setWidth(getElementRect(gridRef).width);
	}

	function handleClick(e, day) {
		// LEFT CLICK ONLY!
		// console.log(e, day, store.gesture);
		if (e.buttons !== 1) return;

		const { top, height } = getElementRect(gridRef);

		const clickTime = yPosToTime(e.clientY, height, top);

		const MIN_SNAP_FACTOR = Math.max(props.minuteSnap, 30);

		console.log("CREATE NEW TIMESLOT", clickTime, day, store.gesture);

		// CREATE NEW TIMESLOT
		let [slotStart, slotEnd] = [
			clickTime - MIN_SNAP_FACTOR * 0.5,
			clickTime + MIN_SNAP_FACTOR * 0.5,
		];

		if (slotStart < props.minuteSnap) {
			[slotStart, slotEnd] = [0, MIN_SNAP_FACTOR];
		}
		if (slotEnd > 1440) {
			[slotStart, slotEnd] = [1440 - MIN_SNAP_FACTOR, 1440];
		}

		const slot = {
			id: idMaker(),
			start: snap(slotStart, MIN_SNAP_FACTOR),
			end: snap(slotEnd, MIN_SNAP_FACTOR),
		};

		const slotClicked = store.availability[day].find(
			slot => clickTime >= slot.start && clickTime <= slot.end
		);

		if (slotClicked) {
			// console.log({ slotClicked });
			setStore("gesture", "drag:ready");
			setStore("selectedItem", { id: slotClicked.id, day });
			lastSelectedItem = store.selectedItem;
			return;
		}

		const merged = getMergedTimeslots(
			slot,
			store.availability[day],
			props.minuteSnap
		);

		setStore("availability", day, prev => [...merged]);
	}

	function handlePointerMove(e) {
		if (store.gesture === "idle") {
			setStore("cursor", "default");
			return;
		}

		// console.log("handlePointerMove");

		if (store.gesture === "drag:ready") {
			// WHAT AREA ARE WE DRAGGING?
			const topThumbRegex = /_TopThumb_/g;
			const bottomThumbRegex = /_BottomThumb_/g;

			const isTopHandle = !!Array.from(e.srcElement.classList).find(c =>
				c.match(topThumbRegex)
			);
			const iSBottomHandle = !!Array.from(e.srcElement.classList).find(c =>
				c.match(bottomThumbRegex)
			);

			if (isTopHandle && store.gesture !== "resize:top:active") {
				return setStore("gesture", "resize:top:active");
			}
			if (iSBottomHandle && store.gesture !== "resize:bottom:active") {
				return setStore("gesture", "resize:bottom:active");
			}
			return setStore("gesture", "drag:active");
		}

		const { id, day } = store.selectedItem;
		const oldSlot = getSlot(day, id);

		if (store.gesture === "drag:active") {
			// console.log("DRAG");
			setStore("cursor", "move");

			let [slotStart, slotEnd] = [
				oldSlot.start + e.movementY * 1.95,
				oldSlot.end + e.movementY * 1.95,
			];

			if (slotStart < 0) {
				return;
			}
			if (slotEnd > 1440) {
				return;
			}

			const newSlot = {
				id,
				start: parseInt(slotStart),
				end: parseInt(slotEnd),
			};

			setStore("availability", day, prev => [
				...prev.filter(s => s.id !== id),
				newSlot,
			]);
		}
		if (store.gesture === "resize:top:active") {
			// console.log("TOP RESIZE");
			setStore("cursor", "row-resize");

			let [slotStart, slotEnd] = [oldSlot.start + e.movementY * 1.95, oldSlot.end];

			// REACHED TOP!!!
			if (slotStart < 0) {
				slotStart = 0;
			}

			// TOO SMALL!!!
			if (slotEnd - slotStart < 30) {
				return;
			}

			const newSlot = {
				id,
				start: parseInt(slotStart),
				end: parseInt(slotEnd),
			};

			setStore("availability", day, prev => [
				...prev.filter(s => s.id !== id),
				newSlot,
			]);
		}
		if (store.gesture === "resize:bottom:active") {
			// console.log("BOTTOM RESIZE");
			setStore("cursor", "row-resize");

			let [slotStart, slotEnd] = [oldSlot.start, oldSlot.end + e.movementY * 1.95];

			// REACHED BOTTOM!!!
			if (slotEnd > 1440) {
				slotEnd = 1440;
			}

			// TOO SMALL!!!
			if (slotEnd - slotStart < 30) {
				return;
			}

			const newSlot = {
				id,
				start: parseInt(slotStart),
				end: parseInt(slotEnd),
			};

			setStore("availability", day, prev => [
				...prev.filter(s => s.id !== id),
				newSlot,
			]);
		}
	}

	function handlePointerUp(e) {
		console.log("handlePointerUp", store.selectedItem, store.gesture);
		if (store.selectedItem) {
			// clicked simply (no drag)
			if (store.gesture === "drag:ready") {
				setStore("isEditMode", true);
				setStore("gesture", "idle");
				// return; // prevent snapping
			}

			const { id, day } = store.selectedItem;
			const slot = getSlot(day, id);

			const merged = getMergedTimeslots(
				slot,
				store.availability[day],
				props.minuteSnap
			);

			setStore("availability", day, prev => [...merged]);
			setStore("selectedItem", null);
		}

		setStore("gesture", "idle");
		// props.onChange(unwrap(store));
	}

	// document.body.style.cursor = store.cursor;
	// console.log(unwrap({ ...store.availability }));
	// WEEKDAYS.forEach(day => {
	createEffect(() => {
		props.onChange(
			structuredClone(unwrap({ ...store.availability }))
			// unwrap([...store.availability[day]]).map(item => ({ day, ...item }))
		);
		// throttle(props.onChange(unwrap({ ...store.availability[day] })), 200);
		// });
	});
	// console.log({ isEditMode: store.isEditMode, lastSelectedItem });

	createEffect(() => handleScreenResize());

	onMount(() => {
		document.addEventListener("pointerup", handlePointerUp);
		document.addEventListener("pointermove", handlePointerMove);
		window.addEventListener("resize", handleScreenResize);
	});
	onCleanup(() => {
		document.removeEventListener("pointerup", handlePointerUp);
		document.removeEventListener("pointermove", handlePointerMove);
		window.removeEventListener("resize", handleScreenResize);
	});

	return (
		<>
			<OuterGrid theme={props.theme}>
				<TopBar theme={props.theme} />

				<SideBar theme={props.theme} />

				<div ref={gridRef} class={s.InnerGrid}>
					<For each={WEEKDAYS}>
						{day => (
							<DayColumn
								day={day}
								timeslots={store.availability[day]}
								onpointerdown={e => handleClick(e, day)}
								width={columnWidth()}
								theme={props.theme}
							/>
						)}
					</For>
				</div>
			</OuterGrid>
			<Show when={store.isEditMode}>
				<EditModal
					theme={props.theme}
					slot={getSlot(lastSelectedItem.day, lastSelectedItem.id)}
					day={lastSelectedItem.day}
					onModalClose={e => {
						console.log("onModalClose");
						setStore("isEditMode", false);
					}}
				/>
			</Show>
		</>
	);
}
