import { createEffect, createSignal, onMount, For, onCleanup } from 'solid-js';
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
								width: width() * 0.8 + 'px',
								left: width() * 0.09 + 'px',
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
		</div>
	);
}
export default DayColumn;
