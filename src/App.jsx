import AppHeader from './components/AppHeader';
// import WeeklyAvailability from './components/WeeklyAvailability';
import s from './App.module.css';
import { lazy, Suspense } from 'solid-js';
let WeeklyAvailability = lazy(() => import('./components/WeeklyAvailability'));

function App() {
	function handleAvailabilityChange(availability) {
		// const obj = Object.keys(availability).map(k => availability[k]);
		// console.log(availability);
	}

	return (
		<div class={s.App}>
			<AppHeader />
			<WeeklyAvailability onChange={handleAvailabilityChange} />
		</div>
	);
}

export default App;
