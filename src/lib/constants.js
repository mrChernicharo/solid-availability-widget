import { createStore } from 'solid-js/store';
export const ID_CHARS =
	'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';

// export const COLUMN_HEIGHT = 1468;
// export const COLUMN_HEIGHT = 968;
// export const COLUMN_HEIGHT = 768;
// export const COLUMN_HEADER_HEIGHT = 40;

// export const WEEKDAYS = [
// 	'monday',
// 	'tuesday',
// 	'wednesday',
// 	'thursday',
// 	'friday',
// 	'saturday',
// 	'sunday',
// ];

export const initialAvailability = {
	mon: [{ id: 'masd', start: 9 * 60, end: 17 * 60 }],
	tue: [{ id: 'tsd3', start: 9 * 60, end: 17 * 60 }],
	wed: [{ id: 'w1sd', start: 9 * 60, end: 17 * 60 }],
	thu: [{ id: 'thsd', start: 9 * 60, end: 17 * 60 }],
	fri: [{ id: 'frsd', start: 9 * 60, end: 17 * 60 }],
	sat: [],
	sun: [],
};

export const appStore = createStore({
	availability: initialAvailability,
	gesture: 'idle',
	selectedItem: null,
	cursor: 'default',
	isEditMode: false,
});

export const WEEKDAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export const GRID_CHUNKS = Array(24 * 1)
	.fill()
	.map((_, i) => i * 60);

console.log(GRID_CHUNKS);

export const GRID_LINE_HEIGHTS = Array(48)
	.fill(0)
	.map((_, i) => i * 30);


export const SNAP_OFFSET = 30; // 60 | 30 | 15 | 10 | 5
