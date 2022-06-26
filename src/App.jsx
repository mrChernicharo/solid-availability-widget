import { createEffect, createSignal, onCleanup, onMount } from 'solid-js';
import s from './App.module.css';
import AppHeader from './components/AppHeader';
import DayColumn from './components/DayColumn';
import OuterGrid from './components/OuterGrid';
import SideBar from './components/SideBar';
import TopBar from './components/TopBar';
import { initialAvailability, WEEKDAYS } from './lib/constants';
import { getMergedTimeslots } from './lib/helpers';

function App() {
	const [availability, setAvailability] = createSignal(initialAvailability);
	const [currDragId, setCurrDragId] = createSignal(null);
	const [currDragDay, setCurrDragDay] = createSignal(null);

	function handleColumnClick(slot, day) {
		const merged = getMergedTimeslots(slot, availability()[day]);

		setAvailability({
			...availability(),
			[day]: [...merged],
		});
	}

	function handlePointerUp(e) {
		const day = currDragDay();

		if (availability()[day]?.length > 0) {
			const currSlot = availability()[day].find(
				item => item.id === currDragId()
			);

			const merged = getMergedTimeslots(currSlot, availability()[day]);

			setAvailability({ ...availability(), [day]: merged });
		}

		setCurrDragId(null);
		setCurrDragDay(null);
	}

	function handleSlotDrag(e, slot, day) {
		if (currDragId() === null) {
			setCurrDragId(slot.id);
			setCurrDragDay(day);
		}

		setAvailability(columns => ({
			...columns,
			[day]: [...columns[day].filter(s => s.id !== slot.id), slot],
		}));
	}

	onMount(() => {
		document.addEventListener('pointerup', handlePointerUp);
	});
	onCleanup(() => {
		document.removeEventListener('pointerup', handlePointerUp);
	});

	createEffect(() => console.log({ currDragId: currDragId() }));

	return (
		<div class={s.App}>
			<AppHeader></AppHeader>

			<OuterGrid>
				<TopBar />

				<SideBar />

				<div class={s.InnerGrid}>
					<For each={WEEKDAYS}>
						{day => (
							<DayColumn
								day={day}
								onColumnClick={handleColumnClick}
								timeslots={availability()[day]}
								isDragging={handleSlotDrag}
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
