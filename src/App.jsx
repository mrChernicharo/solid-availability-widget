import { createEffect, createSignal, onCleanup, onMount } from 'solid-js';
import s from './App.module.css';
import AppHeader from './components/AppHeader';
import DayColumn from './components/DayColumn';
import EditModal from './components/EditModal';
import OuterGrid from './components/OuterGrid';
import SideBar from './components/SideBar';
import TopBar from './components/TopBar';
import { initialAvailability, WEEKDAYS } from './lib/constants';
import {
	getElementRect,
	getFormatedTimeFromSlot,
	getMergedTimeslots,
	idMaker,
	snap,
	timeToYPos,
	yPosToTime,
} from './lib/helpers';

function App() {
	let gridRef;
	let lastSelectedItem;
	const [availability, setAvailability] = createSignal(initialAvailability);
	const [gesture, setGesture] = createSignal('idle');
	const [selectedItem, setSelectedItem] = createSignal(null); // {slotId, day}
	const [cursor, setCursor] = createSignal('default');
	const [isEditMode, setIsEditMode] = createSignal(false);

	const timeslots = day => availability()[day];
	const getSlot = (day, id) => availability()[day].find(s => s.id === id);

	function handleClick(e, day) {
		// leftclick only
		if (e.buttons !== 1) return;

		const { top, height } = getElementRect(gridRef);

		const clickTime = yPosToTime(e.clientY, height, top);

		let [slotStart, slotEnd] = [clickTime - 30, clickTime + 30];
		if (slotStart < 30) [slotStart, slotEnd] = [0, 60];
		if (slotEnd > 1440) [slotStart, slotEnd] = [1380, 1440];

		// snap them to 15min ?
		// [slotStart, slotEnd] =

		const slot = {
			id: idMaker(),
			start: snap(slotStart),
			end: snap(slotEnd),
		};

		const slotClicked = timeslots(day).find(
			slot => clickTime >= slot.start && clickTime <= slot.end
		);

		if (slotClicked) {
			console.log({ slotClicked });
			setGesture('drag:ready');
			setSelectedItem({ id: slotClicked.id, day });
			lastSelectedItem = selectedItem();
			return;
		}

		const merged = getMergedTimeslots(slot, timeslots(day));

		setAvailability({
			...availability(),
			[day]: [...merged],
		});
	}

	function handlePointerMove(e) {
		if (gesture() === 'idle') {
			setCursor('default');
			return;
		}

		// WHAT AREA ARE WE DRAGGING?
		if (gesture() === 'drag:ready') {
			const topThumbRegex = /_TopThumb_/g;
			const bottomThumbRegex = /_BottomThumb_/g;

			const isTopHandle = !!Array.from(e.srcElement.classList).find(c =>
				c.match(topThumbRegex)
			);
			const iSBottomHandle = !!Array.from(e.srcElement.classList).find(
				c => c.match(bottomThumbRegex)
			);

			if (isTopHandle) {
				return setGesture('resize:top:active');
			}
			if (iSBottomHandle) {
				return setGesture('resize:bottom:active');
			}
			return setGesture('drag:active');
		}

		const { id, day } = selectedItem();
		const oldSlot = getSlot(day, id);

		if (gesture() === 'drag:active') {
			console.log('DRAG');
			setCursor('move');

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
				start: slotStart,
				end: slotEnd,
			};

			setAvailability({
				...availability(),
				[day]: [...timeslots(day).filter(s => s.id !== id), newSlot],
			});
		}
		if (gesture() === 'resize:top:active') {
			console.log('TOP RESIZE');
			setCursor('row-resize');

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
				start: slotStart,
				end: slotEnd,
			};

			setAvailability({
				...availability(),
				[day]: [...timeslots(day).filter(s => s.id !== id), newSlot],
			});
		}
		if (gesture() === 'resize:bottom:active') {
			console.log('BOTTOM RESIZE');
			setCursor('row-resize');

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
				start: slotStart,
				end: slotEnd,
			};

			setAvailability({
				...availability(),
				[day]: [...timeslots(day).filter(s => s.id !== id), newSlot],
			});
		}
	}

	function handlePointerUp(e) {
		console.log('handlePointerUp', selectedItem(), gesture());
		if (selectedItem()) {
			// clicked simply (no drag)
			if (gesture() === 'drag:ready') {
				setIsEditMode(true);
			}

			const { id, day } = selectedItem();
			const slot = getSlot(day, id);

			const merged = getMergedTimeslots(slot, timeslots(day));

			const el = document.querySelector(`#${selectedItem().id}`);

			el.classList.remove('dragging');
			setSelectedItem(null);

			setAvailability({
				...availability(),
				[day]: [...merged],
			});
		}

		setGesture('idle');
	}

	createEffect(() => {
		document.body.style.cursor = cursor();
	});
	createEffect(() => {
		if (selectedItem()?.id) {
			timeslots(selectedItem().day);
			const el = document.querySelector(`#${selectedItem().id}`);

			if (el) {
				el.classList.add('dragging');
			}
		}
	});

	onMount(() => {
		document.addEventListener('pointerup', handlePointerUp);
		document.addEventListener('pointermove', handlePointerMove);
	});
	onCleanup(() => {
		document.removeEventListener('pointerup', handlePointerUp);
		document.removeEventListener('pointermove', handlePointerMove);
	});

	// createEffect(() => console.log(availability()));

	return (
		<div class={s.App}>
			<AppHeader></AppHeader>

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
								timeslots={timeslots(day)}
								onpointerdown={e => handleClick(e, day)}
							/>
						)}
					</For>
				</div>
			</OuterGrid>

			<pre class={s.DataPeek}>
				{JSON.stringify(availability(), null, 2)}
			</pre>

			<Show when={isEditMode()}>
				<EditModal
					slot={getSlot(lastSelectedItem.day, lastSelectedItem.id)}
					day={lastSelectedItem.day}
					onModalClose={e => setIsEditMode(false)}
				/>
			</Show>
		</div>
	);
}

export default App;
