import { For } from 'solid-js';
import s from '../App.module.css';
import { WEEKDAYS } from '../lib/constants';
import DayColumn from './DayColumn';

function InnerGrid() {
	return (
		<div class={s.InnerGrid}>
			<For each={WEEKDAYS}>{day => <DayColumn day={day} />}</For>
		</div>
	);
}
export default InnerGrid;
