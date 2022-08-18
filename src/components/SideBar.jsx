import { For } from "solid-js";
import s from "../styles/App.module.css";
import { GRID_CHUNKS } from "../lib/constants";
import { getFormattedTime } from "../lib/helpers";

function SideBar() {
	return (
		<div class={s.SideBar}>
			<For each={GRID_CHUNKS}>
				{chunk => (
					<div
						class={s.GridHour}
						style={{
							height: `calc(100% / ${GRID_CHUNKS.length})`,
							// border: "1px solid",
						}}>
						<div>{chunk === 0 ? "" : getFormattedTime(chunk)}</div>
					</div>
				)}
			</For>
		</div>
	);
}
export default SideBar;
