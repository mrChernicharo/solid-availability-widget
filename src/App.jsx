import { createEffect, createSignal, onCleanup, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
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
	getMergedTimeslots,
	idMaker,
	snap,
	yPosToTime,
} from './lib/helpers';

const [store, setStore] = createStore({
	availability: initialAvailability,
	gesture: 'idle',
	selectedItem: null,
	cursor: 'default',
	isEditMode: false,
});

function App() {
	let gridRef;
	let lastSelectedItem;

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

		// WHAT AREA ARE WE DRAGGING?
		if (store.gesture === 'drag:ready') {
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
				start: slotStart,
				end: slotEnd,
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
				start: slotStart,
				end: slotEnd,
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
				start: slotStart,
				end: slotEnd,
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
			}

			const { id, day } = store.selectedItem;
			const slot = getSlot(day, id);

			const merged = getMergedTimeslots(slot, store.availability[day]);

			const el = document.querySelector(`#${store.selectedItem.id}`);

			el.classList.remove('dragging');
			setStore('selectedItem', null);

			setStore('availability', day, prev => [...merged]);
		}

		setStore('gesture', 'idle');
	}

	createEffect(() => {
		document.body.style.cursor = store.cursor;
	});
	createEffect(() => {
		if (store.selectedItem?.id) {
			const el = document.querySelector(`#${store.selectedItem.id}`);

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
								timeslots={store.availability[day]}
								onpointerdown={e => handleClick(e, day)}
							/>
						)}
					</For>
				</div>
			</OuterGrid>

			<pre class={s.DataPeek}>
				{JSON.stringify(store.availability, null, 2)}
			</pre>

			<Show when={store.isEditMode}>
				<EditModal
					slot={getSlot(lastSelectedItem.day, lastSelectedItem.id)}
					day={lastSelectedItem.day}
					onModalClose={e => setStore('isEditMode', false)}
				/>
			</Show>
		</div>
	);
}

export default App;
