import { Injectable } from "@angular/core";

@Injectable()
export class UtilitiesService {
    createArray(start: number, end: number): number[] {
        return new Array(end - start + 1).fill(1).map((_, idx) => start + idx);
    }
}