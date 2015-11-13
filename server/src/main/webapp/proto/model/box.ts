import {BaseModel} from '../../edit/base_model.ts';

import {Point} from '../../graphics/interfaces.ts';

export class BoxModel extends BaseModel {

    constructor(private p1: Point, private p2: Point) {
    }

    public getStartPoint(): Point {
        return this.p1;
    }

    public getEndPoint(): Point {
        return this.p2;
    }
}