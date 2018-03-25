export interface Week {
	weekNumber?: number;
	inRange?: boolean;
	days: Day[];
}

export interface Day {
	date: Date;
	dayNumber: number;
	inRange?: boolean;
	isStartRange: boolean;
	isEndRange: boolean;
	inDisabled?: boolean;
	isSelected: boolean;
	isToday: boolean;
}

export interface Month {
	weeks: Week[];
}

export interface Range {
	startDate;
	endDate;
}
