import {Request} from '../../edit/interfaces.ts';

import {Point} from '../../graphics/interfaces.ts';

export class CreateBoxRequest implements Request {
    private startPoint;
    private endPoint;

    constructor(p1: Point, p2: Point) {
        this.startPoint = p1;
        this.endPoint = p2;
    }

    public getStartPoint() {
        return this.startPoint;
    }

    public getEndPoint() {
        return this.endPoint;
    }
}
