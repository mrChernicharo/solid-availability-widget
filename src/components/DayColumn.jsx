import { createEffect, createSignal, onMount, For, onCleanup } from 'solid-js';
import s from '../App.module.css';
import { appStore, GRID_CHUNKS } from '../lib/constants';
import {
	getElementRect,
	getFormatedTimeFromSlot,
	idMaker,
	timeToYPos,
	yPosToTime,
} from '../lib/helpers';

function DayColumn(props) {
	let columnRef;
	const [store, setStore] = appStore;
	const [screenWidth, setScreenWidth] = createSignal(0);
	const [width, setWidth] = createSignal(0);

	const rect = () => getElementRect(columnRef);
	const top = slot => timeToYPos(slot.start, rect().height) + 'px';
	const height = slot =>
		timeToYPos(slot.end, rect().height) -
		timeToYPos(slot.start, rect().height) +
		'px';

	function handleScreenResize(e) {
		setScreenWidth(window.innerWidth);

		setWidth(
			getElementRect(document.querySelector('#outer-grid-987asd123qwe'))
				.width / 7
		);
	}

	onMount(() => {
		window.addEventListener('resize', handleScreenResize);
	});

	onCleanup(() => {
		window.removeEventListener('resize', handleScreenResize);
	});

	createEffect(() => handleScreenResize());

	const activeStates = ['drag:active', 'resize:top:active', 'resize:bottom:active']

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
							// class={s.Timeslot}
							class={`${s.Timeslot} ${activeStates.includes(store.gesture) && slot.id === store.selectedItem?.id && 'dragging'}`}
							style={{
								width: width() * 0.8 + 'px',
								left: width() * 0.1 + 'px',
								top: top(slot),
								height: height(slot),
							}}
						>
							<div class={`${s.Thumb} ${s.TopThumb}`}></div>
							{getFormatedTimeFromSlot(slot)}
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
								top: (768 / 24) * i() + 'px',
							}}
						></div>
					);
				}}
			</For>
		</div>
	);
}
export default DayColumn;
