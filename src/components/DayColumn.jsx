import s from '../App.module.css';
import { getElementRect, yPosToTime } from '../lib/helpers';

function DayColumn({ day }) {
	let columnRef;

	function handleClick(e) {
		const { top, height } = getElementRect(columnRef);

		const clickTime = yPosToTime(e.clientY, height, top);

		console.log(e.clientY, day, top, height, clickTime);
	}

	return (
		<div ref={columnRef} id={day} class={s.DayColumn} onclick={handleClick}>
			{day}
		</div>
	);
}
export default DayColumn;
