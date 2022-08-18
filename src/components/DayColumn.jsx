import {
	createEffect,
	createRenderEffect,
	createSignal,
	onMount,
	For,
	onCleanup,
} from "solid-js";
import s from "../styles/App.module.css";
import { appStore, GRID_CHUNKS } from "../lib/constants";
import {
	getElementRect,
	getFormattedTimeFromSlot,
	timeToYPos,
	yPosToTime,
} from "../lib/helpers";

function DayColumn(props) {
	let columnRef;
	const [store, setStore] = appStore;

	const rect = () => getElementRect(columnRef);

	const top = slot => timeToYPos(slot.start, 800) + "px";

	const height = slot => timeToYPos(slot.end, 800) - timeToYPos(slot.start, 800) + "px";

	// createRenderEffect(() => console.log(columnRef));

	const activeStates = ["drag:active", "resize:top:active", "resize:bottom:active"];

	return (
		<div
			id={props.day}
			ref={columnRef}
			class={s.DayColumn}
			onpointerdown={props.onpointerdown}
			style={{
				"border-right": `1px solid ${props.theme === "light" ? "#ddd" : "#444"}`,
			}}>
			<For each={props.timeslots}>
				{slot => {
					return (
						<div
							id={slot.id}
							class={`${s.Timeslot} ${
								activeStates.includes(store.gesture) &&
								slot.id === store.selectedItem?.id &&
								"dragging"
							}`}
							style={{
								top: top(slot),
								height: height(slot),
								"border-left": `1px solid ${
									props.theme === "light" ? "#ddd" : "#444"
								}`,
							}}>
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
								top: (800 / 24) * i() + "px",
								"border-bottom": `1px solid ${
									props.theme === "light" ? "#ddd" : "#444"
								}`,
							}}></div>
					);
				}}
			</For>
		</div>
	);
}
export default DayColumn;
