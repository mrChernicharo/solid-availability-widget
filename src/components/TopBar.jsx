import { For } from "solid-js";
import s from "../styles/App.module.css";
import { WEEKDAYS } from "../lib/constants";

function TopBar(props) {
	return (
		<div class={s.TopBar}>
			<div></div>

			<For each={WEEKDAYS}>
				{day => (
					<div
						style={{
							"border-left": `1px solid ${
								props.theme === "light" ? "#ddd" : "#666"
							}`,
						}}>
						{day.toUpperCase()}
					</div>
				)}
			</For>
		</div>
	);
}
export default TopBar;
