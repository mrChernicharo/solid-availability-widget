import { unwrap } from 'solid-js/store';
import s from '../App.module.css';
import { appStore } from '../lib/constants';
import {
	getHoursFromTime,
	getMergedTimeslots,
	getMinutesFromTime,
} from '../lib/helpers';

function EditModal(props) {
	const [store, setStore] = appStore;

	function handleChange(val, type) {
		let newStart = props.slot.start,
			newEnd = props.slot.end;
		let diff;

		const actions = {
			// 'start:hour'() {
			// 	diff = newStart - Number(val) * 60;
			// 	newStart = diff;
			// },
			// 'start:min'() {
			// 	diff = newStart - Number(val);
			// 	console.log(diff);
			// 	newStart = diff;
			// },
			// 'end:hour'() {
			// 	diff = newEnd - Number(val) * 60;
			// 	newEnd += diff;
			// },
			// 'end:min'() {
			// 	diff = newEnd - Number(val);
			// 	newEnd += diff;
			// },
		};
		actions[type]();

		const newSlot = {
			id: props.slot.id,
			start: newStart,
			end: newEnd,
		};

		console.log({
			start: props.slot.start,
			val: Number(val),
			slot: unwrap(props.slot),
			newSlot,
		});
		// setStore(
		// 	'availability',
		// 	props.day,
		// 	store.availability[props.day].findIndex(
		// 		s => s.id === props.slot.id
		// 	),
		// 	prev => prev + diff
		// );
		const merged = getMergedTimeslots(
			newSlot,
			store.availability[props.day]
		);

		setStore('availability', props.day, prev => [...merged]);
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
						type="number"
						min={0}
						max={23}
						name="start-hour"
						id="start-hour"
						value={getHoursFromTime(props.slot.start)}
						onInput={e =>
							handleChange(e.target.value, 'start:hour')
						}
					/>
					:
					<input
						type="number"
						min={0}
						max={59}
						name="start-min"
						id="start-min"
						value={getMinutesFromTime(props.slot.start)}
						onInput={e => handleChange(e.target.value, 'start:min')}
					/>
				</div>

				<div class={`${s.formControl} ${s.End}`}>
					<span>end</span>
					<input
						type="number"
						min={0}
						max={23}
						name="start-hour"
						id="start-hour"
						value={getHoursFromTime(props.slot.end)}
						onInput={e => handleChange(e.target.value, 'end:hour')}
					/>
					:
					<input
						type="number"
						min={0}
						max={59}
						name="start-min"
						id="start-min"
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
