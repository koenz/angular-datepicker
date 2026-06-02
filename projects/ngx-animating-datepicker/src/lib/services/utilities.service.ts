import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UtilitiesService {
	private static getScrollOffset() {
		const x = window.pageXOffset || document.documentElement.scrollLeft;
		const y = window.pageYOffset || document.documentElement.scrollTop;
		return { x: x, y: y };
	}

	static getPageOffset(el: HTMLElement) {
		const scrollOffset = UtilitiesService.getScrollOffset();
		const width = el.offsetWidth;
		const height = el.offsetHeight;

		if (el.getBoundingClientRect) {
			const props = el.getBoundingClientRect();
			const position = {
				top: props.top + scrollOffset.y,
				left: props.left + scrollOffset.x,
				right: props.left + scrollOffset.x + width,
				bottom: props.top + scrollOffset.y + height,
				forRight: window.innerWidth - props.left,
				forBottom: window.innerHeight - (props.top + scrollOffset.y)
			};

			return position;
		}

		return {
			top: 0,
			left: 0,
			right: width,
			bottom: height,
			forRight: window.innerWidth,
			forBottom: window.innerHeight
		};
	}

	createArray(start: number, end: number): number[] {
		return new Array(end - start + 1).fill(1).map((_, idx) => start + idx);
	}
}
