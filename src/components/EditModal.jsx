import { unwrap } from "solid-js/store";
import { Portal } from "solid-js/web";
import { FaSolidTrash } from "solid-icons/fa";
import s from "../styles/App.module.css";
import { appStore } from "../lib/constants";
import {
	getFormattedTime,
	getHoursFromTime,
	getMergedTimeslots,
	getMinutesFromTime,
} from "../lib/helpers";

function EditModal(props) {
	let timeOpened = Date.now();
	const [store, setStore] = appStore;

	function handleChange(value, type) {
		let newStart = props.slot.start,
			newEnd = props.slot.end;

		const [h, m] = value.split(":").map(Number);

		const actions = {
			start() {
				newStart = h * 60 + m;
			},
			end() {
				newEnd = h * 60 + m;
			},
		};

		actions[type]();

		const newSlot = {
			id: props.slot.id,
			start: newStart,
			end: newEnd,
		};
		const idx = store.availability[props.day].findIndex(s => s.id === props.slot.id);

		setStore("availability", props.day, idx, newSlot);
	}

	function handleDelete(e) {
		props.onModalClose(e);
		setStore("availability", props.day, prev => [
			...prev.filter(s => s.id !== props.slot.id),
		]);
	}

	return (
		<>
			<div class={s.EditModal}>
				<button onclick={props.onModalClose}>X</button>

				<div>
					<p>id: {props.slot.id}</p>
					<p>day: {props.day}</p>
				</div>

				<button onClick={handleDelete}>
					<FaSolidTrash />
				</button>

				<div class={`${s.formControl}`}>
					<h3>Start</h3>
					<input
						type="time"
						onInput={e => {
							console.log(e.target.value);
							handleChange(e.target.value, "start");
						}}
						value={getFormattedTime(props.slot.start)}
					/>
				</div>
				<br />
				<div class={`${s.formControl}`}>
					<h3>End</h3>
					<input
						type="time"
						onInput={e => {
							console.log(e.target.value);
							handleChange(e.target.value, "end");
						}}
						value={getFormattedTime(props.slot.end)}
					/>
				</div>
			</div>
			<div
				className={s.Overlay}
				onpointerdown={e => {
					// prevent immediate closing bug
					if (Date.now() - timeOpened > 200) {
						props.onModalClose(e);
					}
				}}></div>
		</>
	);
}
export default EditModal;
