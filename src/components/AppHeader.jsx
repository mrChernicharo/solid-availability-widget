import s from '../styles/App.module.css';

function AppHeader() {
	return (
		<div class={s.Header}>
			<img src="/assets/logo.svg" width={32} />
			<h1>Solid Availability Widget</h1>
		</div>
	);
}
export default AppHeader;
