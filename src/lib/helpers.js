import { ID_CHARS, WEEKDAYS } from './constants';

export function pxToTime(yVariation, columnHeight) {
	const minutePerPx = 1440 / columnHeight;

	// console.log({ columnHeight, minutePerPx, yVariation });
}

export function timeToYPos(startTime, columnHeight) {
	// console.log({ startTime, columnHeight });
	const pxPerMinute = columnHeight / 1440;
	const yPos = startTime * pxPerMinute;

	// console.log('timeToYPos', { startTime, columnHeight, yPos });
	return yPos;
}

export function yPosToTime(yPos, columnHeight, columnTop) {
	// const columnBottomY = columnTop + columnHeight;
	// console.log({ yPos, columnBottomY, columnTop, columnHeight });

	const columnYClick = yPos - columnTop;
	const ClickVerticalPercentage = (columnYClick / columnHeight) * 100;
	const timeClicked = (ClickVerticalPercentage * 1440) / 100;
	return Math.round(timeClicked);
	// return Math.abs(Math.round(timeClicked));
}

export function dayToLeftPos(day, containerWidth) {
	// console.log('dayToLeftPos', day, containerWidth);
	const columnW = containerWidth / 7;
	const colIdx = WEEKDAYS.findIndex(d => d === day) + 1;
	const leftPos = columnW * colIdx;
	return leftPos;
}

// ************************************************** //

export function mergeTimeslots(timeSlots, overlappingIds) {
	const overlapping = timeSlots.filter(item =>
		overlappingIds.includes(item.id)
	);

	// console.log('before merge', overlapping);

	const mergedSlot = overlapping.reduce(
		(acc, next) => {
			(acc.start = Math.min(acc.start, next.start)),
				(acc.end = Math.max(acc.end, next.end));

			return acc;
		},
		{
			id: overlapping[0].id,
			start: overlapping[0].start,
			end: overlapping[0].end,
		}
	);

	const snappedSlot = {
		id: mergedSlot.id,
		start: snap(mergedSlot.start),
		end: snap(mergedSlot.end),
	};

	return snappedSlot;
}

export function findOverlappingSlots(timeSlot, timeSlots) {
	// if (!timeSlot?.start || !timeSlot?.end) return;
	const { start, end } = timeSlot;

	// prettier-ignore
	const overlappingItems = timeSlots.filter(
		(s, i) =>
			(start <= s.start && start <= s.end && end >= s.start && end <= s.end) || // top overlap
			(start >= s.start && start <= s.end && end >= s.start && end <= s.end) || // fit inside
			(start >= s.start && start <= s.end && end >= s.start && end >= s.end) || // bottom overlap
			(start <= s.start && start <= s.end && end >= s.start && end >= s.end) // encompass
	);

	// console.log('findOverlappingSlots', {
	// 	timeSlot,
	// 	timeSlots,
	// 	overlappingItems,
	// });

	return overlappingItems;
}

export function getMergedTimeslots(newTimeSlot, newTimeslots) {
	if (!newTimeSlot) return newTimeslots;

	const overlappingItems = findOverlappingSlots(newTimeSlot, newTimeslots);

	if (overlappingItems?.length > 0) {
		const overlappingIds = overlappingItems
			.map(item => item.id)
			.concat(newTimeSlot.id);

		const mergedSlot = mergeTimeslots(
			[...newTimeslots, newTimeSlot],
			overlappingIds
		);

		const filteredSlots = newTimeslots.filter(
			item => !overlappingIds.includes(item.id)
		);

		const mergedSlots = [...filteredSlots, mergedSlot];

		return mergedSlots;
	} else {
		return [...newTimeslots, newTimeSlot];
	}
}

export function snap(val) {
	const snap = 15; // 30?
	const mod = parseInt(val) % snap;

	const roundUp = mod > Math.floor(snap) / 2;

	return roundUp ? val + snap - mod : val - mod;
}

// export function snapTimeslot(val) {}

// *************************************************** //

export function getHoursFromTime(time) {
	let res = Math.floor(time / 60);
	if (res === 24) res = 0; // we don't want 24:00
	return Number.isNaN(res) ? 0 : res;
}

// export function getTimeFromHourString(hour) {
// 	let res = hour * 60
// 	// let res = Math.floor(time / 60);
// 	// if (res === 24) res = 0; // we don't want 24:00
// 	return Number.isNaN(res) ? 0 : res;
// }

export function getMinutesFromTime(time) {
	const res = Math.floor(time % 60);
	return Number.isNaN(res) ? 0 : res;
}

export function formatTimeUnit(time) {
	return time >= 10 ? `${time}` : `0${time}`;
}

export function getFormattedTime(time) {
	const [h, m] = [getHoursFromTime(time), getMinutesFromTime(time)];

	return `${formatTimeUnit(h)}:${formatTimeUnit(m)}`;
}

export function getFormattedTimeFromSlot(slot) {
	const { start, end } = slot;

	return `${getFormattedTime(start)} - ${getFormattedTime(end)}`;
}

// *************************************************  //

export function getElementRect(ref) {
	return ref.getBoundingClientRect();
}

export function setCSSVariable(key, val) {
	document.documentElement.style.setProperty(key, val);
}

export function getCSSVariable(key) {
	return getComputedStyle(document.documentElement)
		.getPropertyValue(key)
		.trim();
}

