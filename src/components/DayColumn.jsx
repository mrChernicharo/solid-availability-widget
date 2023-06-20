import { createEffect, createSignal, onMount, For, onCleanup } from 'solid-js';
import s from '../styles/App.module.css';
import { appStore, GRID_CHUNKS } from '../lib/constants';
import {
	getElementRect,
	getFormattedTimeFromSlot,
	timeToYPos,
	yPosToTime,
} from '../lib/helpers';
import idMaker from '@melodev/id-maker';

function DayColumn(props) {
	let columnRef;
	const [store, setStore] = appStore;

	const rect = () => getElementRect(columnRef);
	const top = slot => timeToYPos(slot.start, rect().height) + 'px';
	const height = slot =>
		timeToYPos(slot.end, rect().height) -
		timeToYPos(slot.start, rect().height) +
		'px';

	createEffect(() => console.log(props.width));

	const activeStates = [
		'drag:active',
		'resize:top:active',
		'resize:bottom:active',
	];

	return (
		<div
			id={props.day}
			ref={columnRef}
			class={s.DayColumn}
			onpointerdown={props.onpointerdown}
		>
			<For each={props.timeslots}>
				{slot => {
					return (
						<div
							id={slot.id}
							// class={s.Timeslot}
							class={`${s.Timeslot} ${
								activeStates.includes(store.gesture) &&
								slot.id === store.selectedItem?.id &&
								'dragging'
							}`}
							style={{
								width: props.width * 0.8 + 'px',
								left: props.width * 0.1 + 'px',
								top: top(slot),
								height: height(slot),
							}}
						>
							<div class={`${s.Thumb} ${s.TopThumb}`}></div>
							{getFormattedTimeFromSlot(slot)}
							<div class={`${s.Thumb} ${s.BottomThumb}`}></div>
						</div>
					);
				}}
			</For>

			<For each={GRID_CHUNKS}>
				{(line, i) => {
					return (
						<div
							class={s.GridLine}
							style={{
								top: (816 / 24) * i() + 'px',
							}}
						></div>
					);
				}}
			</For>
		</div>
	);
}
export default DayColumn;
