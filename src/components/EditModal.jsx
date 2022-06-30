import { unwrap } from 'solid-js/store';
import s from '../App.module.css';
import { appStore } from '../lib/constants';
import {
	getHoursFromTime,
	getMergedTimeslots,
	getMinutesFromTime,
} from '../lib/helpers';

function EditModal(props) {
	let startHourRef;
	let startMinuteRef;
	let endHourRef;
	let endMinuteRef;
	const [store, setStore] = appStore;

	function handleChange(value, type) {
		let val = Number(value);

		// prevent wonky values

		let newStart = props.slot.start,
			newEnd = props.slot.end;

		const actions = {
			'start:hour'() {
				if (val <= 0) { startHourRef.target.value = 0; val = 0 }
				if (val > 23) { startHourRef.target.value = 23; val = 23 }

				let sMinutes = newStart % 60;
				let sHours = parseInt(newStart / 60)
				let diff = (val - sHours) * 60
				newStart = newStart + diff - sMinutes

			},
			'start:min'() {
				if (val <= 0) { startMinuteRef.target.value = 0; val = 0 }
				if (val > 59) { startMinuteRef.target.value = 59; val = 59 }

				let sMinutes = newStart % 60;
				let diff = val - sMinutes;
				newStart = newStart + diff;
			},
			'end:hour'() {
				if (val <= 0) { endHourRef.target.value = 0; val = 0 }
				if (val > 23) { endHourRef.target.value = 23; val = 23 }

				let eMinutes = newEnd % 60;
				let eHours = parseInt(newEnd / 60)
				let diff = (val - eHours) * 60
				newEnd = newEnd + diff - eMinutes
			},
			'end:min'() {
				if (val <= 0) { endMinuteRef.target.value = 0; val = 0 }
				if (val > 59) { endMinuteRef.target.value = 59; val = 59 }

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

		console.log({
			start: props.slot.start,
			val: val,
			slot: unwrap(props.slot),
			newSlot,
		});

		setStore(
			'availability',
			props.day,
			store.availability[props.day].findIndex(
				s => s.id === props.slot.id
			),
			prev => newSlot
		);
		// const merged = getMergedTimeslots(
		// 	newSlot,
		// 	store.availability[props.day]
		// );

		// setStore('availability', props.day, prev => [...merged]);
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
						onInput={e =>
							handleChange(e.target.value, 'start:hour')
						}
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
						onInput={e => handleChange(e.target.value, 'start:min')}
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
						onInput={e => handleChange(e.target.value, 'end:hour')}
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
						onInput={e => handleChange(e.target.value, 'end:min')}
					/>
				</div>
			</div>
			<div className={s.Overlay} onclick={props.onModalClose}></div>
		</>
	);
}
export default EditModal;
