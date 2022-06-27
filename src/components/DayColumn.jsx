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

	// const rect = () => getElementRect(document.querySelector(`#${props.day}`));
	const rect = () => getElementRect(columnRef);
	const top = slot => timeToYPos(slot.start, rect().height) + 'px';
	const height = slot =>
		timeToYPos(slot.end, rect().height) -
		timeToYPos(slot.start, rect().height) +
		'px';

	return (
		<div
			class={s.DayColumn}
			id={props.day}
			onpointerdown={props.onpointerdown}
			ref={columnRef}
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
