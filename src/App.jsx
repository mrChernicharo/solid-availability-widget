import { createEffect, createSignal, onCleanup, onMount } from 'solid-js';
import s from './App.module.css';
import AppHeader from './components/AppHeader';
import DayColumn from './components/DayColumn';
import OuterGrid from './components/OuterGrid';
import SideBar from './components/SideBar';
import TopBar from './components/TopBar';
import { initialAvailability, WEEKDAYS } from './lib/constants';
import {
	getElementRect,
	getFormatedTimeFromSlot,
	getMergedTimeslots,
	idMaker,
	timeToYPos,
	yPosToTime,
} from './lib/helpers';

function App() {
	let gridRef;
	const [availability, setAvailability] = createSignal(initialAvailability);
	const [gesture, setGesture] = createSignal('idle');
	const [selectedItem, setSelectedItem] = createSignal(null); // {slot, day}

	const timeslots = day => availability()[day];
	const getSlot = (day, id) => availability()[day].find(s => s.id === id);
	// const columnAttr = attr => getElementRect(gridRef)[attr];

	function handleClick(e, day) {
		const { top, height } = getElementRect(gridRef);

		const clickTime = yPosToTime(e.clientY, height, top);

		let [slotStart, slotEnd] = [clickTime - 30, clickTime + 30];
		if (slotStart < 30) [slotStart, slotEnd] = [0, 60];
		if (slotEnd > 1440) [slotStart, slotEnd] = [1380, 1440];

		// snap them to 15min ?
		// [slotStart, slotEnd] =

		const slot = {
			id: idMaker(),
			start: slotStart,
			end: slotEnd,
		};

		const slotClicked = timeslots(day).find(
			slot => clickTime >= slot.start && clickTime <= slot.end
		);

		if (slotClicked) {
			console.log({ slotClicked });
			setGesture('drag:ready');
			setSelectedItem({ id: slotClicked.id, day });
			return;
		}

		const merged = getMergedTimeslots(slot, timeslots(day));

		setAvailability({
			...availability(),
			[day]: [...merged],
		});
	}

	function handlePointerMove(e) {
		if (gesture() === 'idle') return;

		if (gesture() === 'drag:ready') {
			setGesture('drag:active');
		}

		if (gesture() === 'drag:active') {
			const { id, day } = selectedItem();
			const oldSlot = getSlot(day, id);

			let [slotStart, slotEnd] = [
				oldSlot.start + e.movementY * 1.5,
				oldSlot.end + e.movementY * 1.5,
			];

			if (slotStart < 0) {
				return;
				// slotStart = 0;
				// slotEnd = oldSlot.end;
			}
			if (slotEnd > 1440) {
				return;
				// slotEnd = 1440;
				// slotStart = oldSlot.start;
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
		if (selectedItem()) {
			const { id, day } = selectedItem();
			const slot = getSlot(day, id);
			const merged = getMergedTimeslots(slot, timeslots(day));

			setAvailability({
				...availability(),
				[day]: [...merged],
			});
		}

		setGesture('idle');
		setSelectedItem(null);
	}

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

				<div ref={gridRef} class={s.InnerGrid}>
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
		</div>
	);
}

export default App;
