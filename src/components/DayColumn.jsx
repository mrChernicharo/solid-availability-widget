import { createEffect, For } from 'solid-js';
import s from '../App.module.css';
import {
	dayToLeftPos,
	getElementRect,
	getFormatedTimeFromSlot,
	idMaker,
	timeToYPos,
	yPosToTime,
} from '../lib/helpers';

function DayColumn(props) {
	let columnRef;

	const columnRect = () => getElementRect(columnRef);
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

	createEffect(() => console.log(columnRef));

	return (
		<div
			ref={columnRef}
			id={props.day}
			class={s.DayColumn}
			onclick={handleClick}
		>
			<For each={props.timeslots}>
				{slot => (
					<div
						class={s.Timeslot}
						style={{
							width: getElementRect(columnRef).width + 'px',
							// left:
							// 	dayToLeftPos(
							// 		props.day,
							// 		getElementRect(columnRef).width
							// 	) + 'px',
							top:
								timeToYPos(
									slot.start,
									getElementRect(columnRef).height
								) + 'px',
							height:
								timeToYPos(
									slot.end,
									getElementRect(columnRef).height
								) -
								timeToYPos(
									slot.start,
									getElementRect(columnRef).height
								) +
								'px',
						}}
					>
						{getFormatedTimeFromSlot(slot)}
					</div>
				)}
			</For>
		</div>
	);
}
export default DayColumn;
