import { createEffect, createSignal, For } from 'solid-js';
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
	const [slotId, setSlotId] = createSignal('');

	const columnAttr = attr => getElementRect(columnRef)[attr];

	function handleClick(e) {
		const { top, height } = getElementRect(columnRef);

		const clickTime = yPosToTime(e.clientY, height, top);
		// console.log(e.clientY, day, top, height, clickTime);
		let [slotStart, slotEnd] = [clickTime - 30, clickTime + 30];

		if (slotStart < 30) [slotStart, slotEnd] = [0, 60];
		if (slotEnd > 1440) [slotStart, slotEnd] = [1380, 1440];

		// snap them to 15min ?
		// [slotStart, slotEnd] =

		const slot = {
			id: idMaker(),
			start: slotStart,
			end: slotEnd,
		};

		props.onColumnClick(slot, props.day);
	}

	function handleDrag(e) {
		if (e.buttons === 1) {
			console.log('isDragging');

			const slot = props.timeslots.find(s => s.id === slotId());
			const { height } = document
				.querySelector(`#${slot.id}`)
				.getBoundingClientRect();

			let [newStart, newEnd] = [
				slot.start + e.movementY * 1.5,
				slot.end + e.movementY * 1.5,
			];

			if (newStart <= 0) newStart = 0;
			if (newStart >= 1440 - height) newStart = 1440 - height;
			if (newEnd <= height) newEnd = height;
			if (newEnd >= 1440) newEnd = 1440;

			const updatedSlot = {
				id: slot.id,
				start: newStart,
				end: newEnd,
			};

			props.isDragging(e, updatedSlot, props.day);
		}
	}
	createEffect(() => console.log(slotId()));

	return (
		<div
			ref={columnRef}
			id={props.day}
			class={s.DayColumn}
			onpointerdown={handleClick}
			onpointermove={handleDrag}
		>
			<For each={props.timeslots}>
				{slot => (
					<div
						id={slot.id}
						class={s.Timeslot}
						onpointerenter={e => setSlotId(slot.id)}
						// onpointerleave={e => setSlotId(null)}
						style={{
							width: columnAttr('width') + 'px',
							top:
								timeToYPos(slot.start, columnAttr('height')) +
								'px',
							height:
								timeToYPos(slot.end, columnAttr('height')) -
								timeToYPos(slot.start, columnAttr('height')) +
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
