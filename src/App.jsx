import AppHeader from './components/AppHeader';
// import WeeklyAvailability from './components/WeeklyAvailability';
import s from './App.module.css';
import { createSignal, lazy, Show, Suspense } from 'solid-js';
import { appStore } from './lib/constants';
let WeeklyAvailability = lazy(() => import('./components/WeeklyAvailability'));

function App() {
	const [open, setOpen] = createSignal(true)
	const [store, setStore] = appStore;

	function handleAvailabilityChange(availability) {
		// const obj = Object.keys(availability).map(k => availability[k]);
		// console.log(availability);
	}

	return (
		<div class={s.App}>
			<AppHeader />
			<button onClick={e => setOpen(!open())}>{open() ? "Close" : "Open"}</button>
			<Show when={open()}><WeeklyAvailability onChange={handleAvailabilityChange} /></Show>

			<div class={s.DataPeek}>
				<h4>Availability</h4>
				<pre >
					{JSON.stringify(store.availability, null, 2)}
				</pre>
			</div>
		</div>
	);
}

export default App;
