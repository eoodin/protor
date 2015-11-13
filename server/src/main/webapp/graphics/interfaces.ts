
export class Point {
    constructor(public x:number, public y:number) {}
}

export interface DrawDevice {
    drawRect(p1: Point, p2: Point);
    clear();

    setStrokeStyle(style);
}

export interface Figure {
    paint(device: DrawDevice);
}

