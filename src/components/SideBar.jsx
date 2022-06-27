import { For } from 'solid-js';
import s from '../App.module.css';
import { GRID_CHUNKS } from '../lib/constants';
import { getFormatedTime } from '../lib/helpers';

function SideBar() {
	console.log(GRID_CHUNKS, 'hee hee hee ah ah ah');
	return (
		<div class={s.SideBar}>
			<For each={GRID_CHUNKS}>
				{chunk => (
					<div
						class={s.GridHour}
						style={{
							height: `calc(100% / ${GRID_CHUNKS.length})`,
						}}
					>
						<div>{getFormatedTime(chunk)}</div>
					</div>
				)}
			</For>
		</div>
	);
}
export default SideBar;
