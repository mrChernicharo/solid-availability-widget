import styles from './App.module.css';
import AppHeader from './components/AppHeader';
import InnerGrid from './components/InnerGrid';
import OuterGrid from './components/OuterGrid';
import SideBar from './components/SideBar';
import TopBar from './components/TopBar';

function App() {
	return (
		<div class={styles.App}>
			<AppHeader></AppHeader>

			<OuterGrid>
				<TopBar />

				<SideBar />

				<InnerGrid />
			</OuterGrid>
		</div>
	);
}

export default App;
