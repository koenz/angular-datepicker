import { Injectable } from "@angular/core";
import { log } from "util";

@Injectable()
export class UtilitiesService {
	public position: Object;
	
	private static getScrollOffset(){
		const x = window.pageXOffset;
		const y = window.pageYOffset;
		return {x: x, y: y}
	}

	createArray(start: number, end: number): number[] {
        return new Array(end - start + 1).fill(1).map((_, idx) => start + idx);
	}

	getPageOffset(el: HTMLElement) {
		const scrollOffset = UtilitiesService.getScrollOffset();
		const width = el.offsetWidth;
		const height = el.offsetHeight;

		if ( el.getBoundingClientRect ) {
			const props = el.getBoundingClientRect();
			const position = {
			 	top: props.top + scrollOffset.y,
				left: props.left + scrollOffset.x,
				right: props.left + scrollOffset.x + width,
				bottom: props.top + scrollOffset.y + height
			}
			console.log(position);			
		}
	}



}