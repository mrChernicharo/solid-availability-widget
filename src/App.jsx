import { createEffect, createSignal, onMount } from 'solid-js';
import s from './App.module.css';
import AppHeader from './components/AppHeader';
import DayColumn from './components/DayColumn';
import OuterGrid from './components/OuterGrid';
import SideBar from './components/SideBar';
import TopBar from './components/TopBar';
import { initialAvailability, WEEKDAYS } from './lib/constants';
import { findOverlappingSlots, getMergedTimeslots } from './lib/helpers';

function App() {
	const [availability, setAvailability] = createSignal(initialAvailability);

	function handleColumnClick(slot, day) {
		const merged = getMergedTimeslots(slot, availability()[day]);

		setAvailability({
			...availability(),
			[day]: [...merged],
		});
	}

	function handlePointerUp(e) {
		console.log('handlePointerUP', e);
	}
	function handleSlotDrag(e, slot, day) {
		console.log(e);
		setAvailability(columns => ({
			...columns,
			[day]: [...columns[day].filter(s => s.id !== slot.id), slot],
		}));
	}

	createEffect(() => console.log(availability()));

	onMount(() => {
		document.addEventListener('pointerup', handlePointerUp);
	});

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

			<pre>{JSON.stringify(availability(), null, 2)}</pre>
		</div>
	);
}

export default App;
