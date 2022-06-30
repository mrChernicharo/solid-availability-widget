import { children } from 'solid-js';
import s from '../styles/App.module.css';

function OuterGrid(props) {
	const childElements = children(() => props.children);

	return <div class={s.OuterGrid}>{childElements()}</div>;
}
export default OuterGrid;
