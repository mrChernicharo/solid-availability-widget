import { unwrap } from "solid-js/store";
import { Portal } from "solid-js/web";
import { FaSolidTrash } from "solid-icons/fa";
import s from "../styles/App.module.css";
import { appStore } from "../lib/constants";
import { getHoursFromTime, getMergedTimeslots, getMinutesFromTime } from "../lib/helpers";

function EditModal(props) {
	let startHourRef;
	let startMinuteRef;
	let endHourRef;
	let endMinuteRef;
	let timeOpened = Date.now();
	const [store, setStore] = appStore;

	function handleChange(value, type) {
		let val = Number(value);

		// prevent wonky values
		let newStart = props.slot.start,
			newEnd = props.slot.end;

		const actions = {
			"start:hour"() {
				if (val <= 0) {
					startHourRef.target.value = 0;
					val = 0;
				}
				if (val > 23) {
					startHourRef.target.value = 23;
					val = 23;
				}

				let sMinutes = newStart % 60;
				let sHours = parseInt(newStart / 60);
				let diff = (val - sHours) * 60;
				newStart = newStart + diff - sMinutes;
			},
			"start:min"() {
				if (val <= 0) {
					startMinuteRef.target.value = 0;
					val = 0;
				}
				if (val > 59) {
					startMinuteRef.target.value = 59;
					val = 59;
				}

				let sMinutes = newStart % 60;
				let diff = val - sMinutes;
				newStart = newStart + diff;
			},
			"end:hour"() {
				if (val <= 0) {
					endHourRef.target.value = 0;
					val = 0;
				}
				if (val > 23) {
					endHourRef.target.value = 23;
					val = 23;
				}

				let eMinutes = newEnd % 60;
				let eHours = parseInt(newEnd / 60);
				let diff = (val - eHours) * 60;
				newEnd = newEnd + diff - eMinutes;
			},
			"end:min"() {
				if (val <= 0) {
					endMinuteRef.target.value = 0;
					val = 0;
				}
				if (val > 59) {
					endMinuteRef.target.value = 59;
					val = 59;
				}

				let sMinutes = newEnd % 60;
				let diff = val - sMinutes;
				newEnd = newEnd + diff;
			},
		};

		actions[type]();

		const newSlot = {
			id: props.slot.id,
			start: newStart,
			end: newEnd,
		};

		setStore(
			"availability",
			props.day,
			store.availability[props.day].findIndex(s => s.id === props.slot.id),
			prev => newSlot
		);
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

				<div class={`${s.formControl} ${s.Start}`}>
					<span>start</span>
					<input
						// on:input
						ref={startHourRef}
						type="number"
						min={0}
						max={23}
						name="start-hour"
						id="start-hour"
						onKeyPress="if(this.value.length==4) return false;"
						value={getHoursFromTime(props.slot.start)}
						onInput={e => handleChange(e.target.value, "start:hour")}
					/>
					:
					<input
						ref={startMinuteRef}
						type="number"
						min={0}
						max={59}
						maxLength={2}
						maxlength={2}
						name="start-min"
						id="start-min"
						value={getMinutesFromTime(props.slot.start)}
						onInput={e => handleChange(e.target.value, "start:min")}
					/>
				</div>

				<div class={`${s.formControl} ${s.End}`}>
					<span>end</span>
					<input
						ref={endHourRef}
						type="number"
						min={0}
						max={23}
						maxLength={2}
						maxlength={2}
						name="end-hour"
						id="end-hour"
						value={getHoursFromTime(props.slot.end)}
						onInput={e => handleChange(e.target.value, "end:hour")}
					/>
					:
					<input
						ref={endMinuteRef}
						type="number"
						min={0}
						max={59}
						maxLength={2}
						maxlength={2}
						name="end-min"
						id="end-min"
						value={getMinutesFromTime(props.slot.end)}
						onInput={e => handleChange(e.target.value, "end:min")}
					/>
				</div>

				<button onClick={handleDelete}>
					<FaSolidTrash />
				</button>
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
