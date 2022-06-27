import { createEffect, createSignal, onMount, For } from 'solid-js';
import s from '../App.module.css';
import {
	getElementRect,
	getFormatedTimeFromSlot,
	idMaker,
	timeToYPos,
	yPosToTime,
} from '../lib/helpers';

function DayColumn(props) {
	let columnRef;

	const rect = () => getElementRect(columnRef);
	const top = slot => timeToYPos(slot.start, rect().height) + 'px';
	const height = slot =>
		timeToYPos(slot.end, rect().height) -
		timeToYPos(slot.start, rect().height) +
		'px';

	createEffect(() => {
		console.log(columnRef);
	});
	return (
		<div
			id={props.day}
			ref={columnRef}
			class={s.DayColumn}
			onpointerdown={props.onpointerdown}
		>
			<For each={props.timeslots}>
				{slot => {
					// console.log({ slot, top: top(slot), height: height(slot) });
					return (
						<div
							id={slot.id}
							class={s.Timeslot}
							style={{
								width: rect().width + 'px',
								top: top(slot),
								height: height(slot),
							}}
						>
							<div class={`${s.Thumb} ${s.TopThumb}`}></div>
							{/* {getFormatedTimeFromSlot(slot)} */}
							<div class={`${s.Thumb} ${s.BottomThumb}`}></div>
						</div>
					);
				}}
			</For>
		</div>
	);
}
export default DayColumn;
