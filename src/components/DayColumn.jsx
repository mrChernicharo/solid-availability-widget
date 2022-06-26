import { For } from 'solid-js';
import s from '../App.module.css';
import {
	getElementRect,
	getFormatedTimeFromSlot,
	idMaker,
	yPosToTime,
} from '../lib/helpers';

function DayColumn(props) {
	let columnRef;
	// console.log({ timeslots, day });

	function handleClick(e) {
		const { top, height } = getElementRect(columnRef);

		const clickTime = yPosToTime(e.clientY, height, top);
		// console.log(e.clientY, day, top, height, clickTime);
		let [slotStart, slotEnd] = [clickTime - 15, clickTime + 15];

		if (slotStart < 15) [slotStart, slotEnd] = [0, 30];
		if (slotEnd > 1440) [slotStart, slotEnd] = [1410, 1440];

		const slot = {
			id: idMaker(),
			start: slotStart,
			end: slotEnd,
		};

		props.onColumnClick(slot, props.day);
	}

	return (
		<div
			ref={columnRef}
			id={props.day}
			class={s.DayColumn}
			onclick={handleClick}
		>
			sd
			<For each={props.timeslots}>
				{slot => <div>{getFormatedTimeFromSlot(slot)}</div>}
			</For>
		</div>
	);
}
export default DayColumn;
