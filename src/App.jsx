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

	const timeslots = day => availability()[day];
	const getTimeslot = (day, id) => availability()[day].find(s => s.id === id);
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

		const hitSomething = timeslots(day).find(
			slot => clickTime >= slot.start && clickTime <= slot.end
		);

		if (hitSomething) {
			console.log({ hitSomething });
			return;
		}

		const merged = getMergedTimeslots(slot, timeslots(day));

		setAvailability({
			...availability(),
			[day]: [...merged],
		});
	}

	function handlePointerUp(e) {}

	function handlePointerMove(e) {}

	onMount(() => {
		document.addEventListener('pointerup', handlePointerUp);
		document.addEventListener('pointermove', handlePointerMove);
	});
	onCleanup(() => {
		document.removeEventListener('pointerup', handlePointerUp);
		document.removeEventListener('pointermove', handlePointerMove);
	});

	createEffect(() => console.log(availability()));

	return (
		<div class={s.App}>
			<AppHeader></AppHeader>

			<OuterGrid>
				<TopBar />

				<SideBar />

				<div ref={gridRef} class={s.InnerGrid}>
					<For each={WEEKDAYS}>
						{day => (
							<div class={s.DayColumn}>
								<DayColumn
									day={day}
									timeslots={timeslots(day)}
									onpointerdown={e => handleClick(e, day)}
								/>
							</div>
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
