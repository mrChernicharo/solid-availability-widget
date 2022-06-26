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
	mon: [],
	tue: [],
	wed: [],
	thu: [],
	fri: [],
	sat: [],
	sun: [],
};

export const WEEKDAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export const GRID_CHUNKS = Array(24 * 1)
	.fill()
	.map((_, i) => i * 60);

export const GRID_LINE_HEIGHTS = Array(48)
	.fill(0)
	.map((_, i) => i * 30);
