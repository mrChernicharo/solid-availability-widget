import { createEffect, createSignal } from 'solid-js';
import s from './App.module.css';
import AppHeader from './components/AppHeader';
import DayColumn from './components/DayColumn';
import OuterGrid from './components/OuterGrid';
import SideBar from './components/SideBar';
import TopBar from './components/TopBar';
import { initialAvailability, WEEKDAYS } from './lib/constants';
import { findOverlappingSlots, getMergedTimeslots } from './lib/helpers';

function App() {
	const [availability, setAvailability] = createSignal(initialAvailability, {
		equals: false,
	});

	function handleColumnClick(slot, day) {
		// console.log(slot, day, availability()[day]);

		const merged = getMergedTimeslots(slot, availability()[day]);

		setAvailability({
			...availability(),
			[day]: [...merged],
		});
	}

	createEffect(() => console.log(availability()));

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
							/>
						)}
					</For>
				</div>
			</OuterGrid>
		</div>
	);
}

export default App;
