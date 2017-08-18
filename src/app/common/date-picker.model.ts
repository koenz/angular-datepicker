export interface Day {
    date: Date;
    dayNumber: number;
    inRange?: boolean;
    isSelected: boolean;
    isToday: boolean;
}

export interface Week {
    weekNumber?: number;
    inRange?: boolean;
    days: Day[];
}