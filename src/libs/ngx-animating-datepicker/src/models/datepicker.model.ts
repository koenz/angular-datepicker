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

export interface YearMonth {
	year: number;
	month: number;
}

export interface NavigationItem extends YearMonth {
	navigationTitle: string | number;
}

export interface Range {
	startDate;
	endDate;
}
