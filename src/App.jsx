import AppHeader from "./components/AppHeader";
// import WeeklyAvailability from './components/WeeklyAvailability';
import s from "./styles/App.module.css";
import { createSignal, lazy, Show, Suspense } from "solid-js";
import { appStore } from "./lib/constants";
let WeeklyAvailability = lazy(() => import("./components/WeeklyAvailability"));

function App() {
	const [open, setOpen] = createSignal(true);
	const [availability, setAvailability] = createSignal({});

	function handleAvailabilityChange(availability) {
		setAvailability(availability);
	}

	return (
		<div class={s.App}>
			<AppHeader />
			<button onClick={e => setOpen(!open())}>{open() ? "Close" : "Open"}</button>

			{/* <div style={{ display: 'flex' }}> */}
			<Show when={open()}>
				<WeeklyAvailability
					onChange={handleAvailabilityChange}
					minuteSnap={30}
					theme="dark"
					// theme="light"
				/>
			</Show>

			<div class={s.DataPeek}>
				<h4>Availability</h4>
				<pre>{JSON.stringify(availability(), null, 2)}</pre>
			</div>
			{/* </div> */}
		</div>
	);
}

export default App;
