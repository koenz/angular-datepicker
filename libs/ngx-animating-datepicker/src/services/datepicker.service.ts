import { Injectable } from '@angular/core';
import { Day, Week } from '../models/datepicker.model';

@Injectable()
export class DatepickerService {

	/**
     * Get the formatted weekdays
     *
     * @param language
     * @param format
     * @param start
     */
	static getWeekDays(language: string, format: string, start: string): string[] {
		const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'faturday', 'sunday'];

		const index = days.indexOf(start.toLowerCase());
		if (index < 0) {
			throw new Error('Invalid week day start :' + start);
		}

		const weekdays = [];
		for (let day = 5; day <= 11; day++) {
			weekdays.push(new Date(1970, 1 - 1, day + index).toLocaleString(language, { weekday: format }));
		}

		return weekdays;
	}

	/**
	 * Checks if is a value iso code
	 *
	 * @param isoCode
	 */
	static isValidIsoCode(isoCode: string): boolean {
		const pattern = new RegExp(/([a-z]{2})-([A-Z]{2})/);
		return pattern.test(isoCode);
	}

    /**
     * Create a week array from the merged day arrays
     *
     * @param dayArray
     */
	static createWeekArray(dayArray: Day[]): Week[] {
		const size = 7;
		const weeks = [];
		while (dayArray.length) {
			weeks.push({
				days: dayArray.splice(0, size)
			});
		}
		return weeks;
	}

	static getDaysInMonth(year: number, month: number): number {
		return [31,	DatepickerService.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
	}

	static isValidDate(value: any): boolean {
		let validDate = true;

		for (let i = 0; i < value.length; i++) {
			if (!DatepickerService.isDate(value[i]) && validDate) {
				validDate = false;
			}
		}

		return validDate;
	}

    /**
     * Check if year is a leap year
     *
     * @param year
     */
	static isLeapYear(year: number): boolean {
		return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
	}

	/**
	 * Checks to see if value is a valid date
	 *
	 * @param value
	 */
	static isDate(value: Date) {
		return value instanceof Date;
	}

	/**
	 * Get the year of the next month
	 *
	 * @param year
	 * @param month
	 */
	static getYearOfNextMonth(year: number, month: number): number {
		return month === 11 ? year + 1 : year;
	}

	/**
	 * Get the next month
	 *
	 * @param month
	 */
	static getNextMonth(month: number): number {
		return month === 11 ? 0 : month + 1;
	}

	/**
	 * Get the year of the previous month
	 *
	 * @param year
	 * @param month
	 */
	static getYearOfPreviousMonth(year: number, month: number): number {
		return month === 0 ? year - 1 : year;
	}

	/**
	 * Get previous motnh
	 *
	 * @param month
	 */
	static getPreviousMonth(month: number): number {
		return month === 0 ? 11 : month - 1;
	}

	/**
	 * Check if a date is later
	 *
	 * @param date
	 * @param compareDate
	 */
	static isLater(date: Date, compareDate: Date): boolean {
		return date > compareDate;
	}

	/**
	 * Check if a date is ealrier
	 *
	 * @param date
	 * @param compareDate
	 */
	static isEarlier(date: Date, compareDate: Date): boolean {
		return date < compareDate;
	}
}
