import { createEffect, createSignal, onCleanup, onMount } from 'solid-js';
import s from '../styles/App.module.css';
import AppHeader from './AppHeader';
import DayColumn from './DayColumn';
import EditModal from './EditModal';
import OuterGrid from './OuterGrid';
import SideBar from './SideBar';
import TopBar from './TopBar';
import { appStore, WEEKDAYS } from '../lib/constants';
import {
	getElementRect,
	getMergedTimeslots,
	idMaker,
	snap,
	yPosToTime,
} from '../lib/helpers';
import { unwrap } from 'solid-js/store';

export default function WeeklyAvailability(props) {
	let gridRef;
	let lastSelectedItem;
	const [store, setStore] = appStore;

	const getSlot = (day, id) => store.availability[day].find(s => s.id === id);

	function handleClick(e, day) {
		// LEFT CLICK ONLY!
		if (e.buttons !== 1) return;

		const { top, height } = getElementRect(gridRef);

		const clickTime = yPosToTime(e.clientY, height, top);

		let [slotStart, slotEnd] = [clickTime - 30, clickTime + 30];
		if (slotStart < 30) [slotStart, slotEnd] = [0, 60];
		if (slotEnd > 1440) [slotStart, slotEnd] = [1380, 1440];

		const slot = {
			id: idMaker(),
			start: snap(slotStart),
			end: snap(slotEnd),
		};

		const slotClicked = store.availability[day].find(
			slot => clickTime >= slot.start && clickTime <= slot.end
		);

		if (slotClicked) {
			console.log({ slotClicked });
			setStore('gesture', 'drag:ready');
			setStore('selectedItem', { id: slotClicked.id, day });
			lastSelectedItem = store.selectedItem;
			return;
		}

		const merged = getMergedTimeslots(slot, store.availability[day]);

		setStore('availability', day, prev => [...merged]);
	}

	function handlePointerMove(e) {
		if (store.gesture === 'idle') {
			setStore('cursor', 'default');
			return;
		}

		if (store.gesture === 'drag:ready') {
			// WHAT AREA ARE WE DRAGGING?
			const topThumbRegex = /_TopThumb_/g;
			const bottomThumbRegex = /_BottomThumb_/g;

			const isTopHandle = !!Array.from(e.srcElement.classList).find(c =>
				c.match(topThumbRegex)
			);
			const iSBottomHandle = !!Array.from(e.srcElement.classList).find(
				c => c.match(bottomThumbRegex)
			);

			if (isTopHandle) {
				return setStore('gesture', 'resize:top:active');
			}
			if (iSBottomHandle) {
				return setStore('gesture', 'resize:bottom:active');
			}
			return setStore('gesture', 'drag:active');
		}

		const { id, day } = store.selectedItem;
		const oldSlot = getSlot(day, id);

		if (store.gesture === 'drag:active') {
			console.log('DRAG');
			setStore('cursor', 'move');

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

			setStore('availability', day, prev => [
				...prev.filter(s => s.id !== id),
				newSlot,
			]);
		}
		if (store.gesture === 'resize:top:active') {
			console.log('TOP RESIZE');
			setStore('cursor', 'row-resize');

			let [slotStart, slotEnd] = [
				oldSlot.start + e.movementY * 1.95,
				oldSlot.end,
			];

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

			setStore('availability', day, prev => [
				...prev.filter(s => s.id !== id),
				newSlot,
			]);
		}
		if (store.gesture === 'resize:bottom:active') {
			console.log('BOTTOM RESIZE');
			setStore('cursor', 'row-resize');

			let [slotStart, slotEnd] = [
				oldSlot.start,
				oldSlot.end + e.movementY * 1.95,
			];

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

			setStore('availability', day, prev => [
				...prev.filter(s => s.id !== id),
				newSlot,
			]);
		}
	}

	function handlePointerUp(e) {
		console.log('handlePointerUp', store.selectedItem, store.gesture);
		if (store.selectedItem) {
			// clicked simply (no drag)
			if (store.gesture === 'drag:ready') {
				setStore('isEditMode', true);
				setStore('gesture', 'idle');
				return;
			}

			const { id, day } = store.selectedItem;
			const slot = getSlot(day, id);

			const merged = getMergedTimeslots(slot, store.availability[day]);

			const el = document.querySelector(`#${store.selectedItem.id}`);

			setStore('selectedItem', null);
			setStore('availability', day, prev => [...merged]);
		}

		setStore('gesture', 'idle');
		// props.onChange(unwrap(store));
	}

	createEffect(() => {
		document.body.style.cursor = store.cursor;
	});

	onMount(() => {
		document.addEventListener('pointerup', handlePointerUp);
		document.addEventListener('pointermove', handlePointerMove);
	});
	onCleanup(() => {
		document.removeEventListener('pointerup', handlePointerUp);
		document.removeEventListener('pointermove', handlePointerMove);
	});

	return (
		<>
			<OuterGrid>
				<TopBar />

				<SideBar />

				<div
					id="outer-grid-987asd123qwe"
					ref={gridRef}
					class={s.InnerGrid}
				>
					<For each={WEEKDAYS}>
						{day => (
							<DayColumn
								day={day}
								timeslots={store.availability[day]}
								onpointerdown={e => handleClick(e, day)}
							/>
						)}
					</For>
				</div>
			</OuterGrid>

			<Show when={store.isEditMode}>
				<EditModal
					slot={getSlot(lastSelectedItem.day, lastSelectedItem.id)}
					day={lastSelectedItem.day}
					onModalClose={e => setStore('isEditMode', false)}
				/>
			</Show>
		</>
	);
}
