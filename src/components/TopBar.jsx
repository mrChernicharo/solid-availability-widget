import { For } from 'solid-js';
import s from '../styles/App.module.css';
import { WEEKDAYS } from '../lib/constants';

function TopBar() {
	return (
		<div class={s.TopBar}>
			<div></div>

			<For each={WEEKDAYS}>{day => <div>{day.toUpperCase()}</div>}</For>
		</div>
	);
}
export default TopBar;
