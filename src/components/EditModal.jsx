import s from '../App.module.css';
import { getFormatedTimeFromSlot } from '../lib/helpers';

function EditModal(props) {
	return (
		<>
			<div class={s.EditModal}>
				<button onclick={props.onModalClose}>X</button>

				<div>
					{JSON.stringify(
						{
							id: props.slot.id,
							day: props.day,
							time: getFormatedTimeFromSlot(
								// getSlot(props.item.day, props.item.id)
								props.slot
							),
						},
						null,
						2
					)}
				</div>
			</div>
			<div className={s.Overlay} onclick={props.onModalClose}></div>
		</>
	);
}
export default EditModal;
