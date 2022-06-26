import { For } from 'solid-js';
import s from '../App.module.css';
import { WEEKDAYS } from '../lib/constants';

function TopBar() {
	return (
		<div class={s.TopBar}>
			<div></div>

			<For each={WEEKDAYS}>{day => <div>{day}</div>}</For>
		</div>
	);
}
export default TopBar;
