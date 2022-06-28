import s from '../App.module.css';
import { getHoursFromTime, getMinutesFromTime } from '../lib/helpers';

function EditModal(props) {
	function handleChange(e, type) {
		console.log(e, type);
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
						onInput={e => handleChange(e, 'start:hour')}
					/>
					:
					<input
						type="number"
						min={0}
						max={59}
						name="start-min"
						id="start-min"
						value={getMinutesFromTime(props.slot.start)}
						onInput={e => handleChange(e, 'start:min')}
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
						onInput={e => handleChange(e, 'end:hour')}
					/>
					:
					<input
						type="number"
						min={0}
						max={59}
						name="start-min"
						id="start-min"
						value={getMinutesFromTime(props.slot.end)}
						onInput={e => handleChange(e, 'end:min')}
					/>
				</div>
			</div>
			<div className={s.Overlay} onclick={props.onModalClose}></div>
		</>
	);
}
export default EditModal;
