import {Figure, DrawDevice} from '../interfaces.ts';

export class RectangleFigure implements Figure {
    private color: any;

    constructor(public p1, public p2) {
        this.color = '#005588';
    }

    public setColor(color: any) {
        this.color = color;
    }

    public paint(device: DrawDevice) {
        device.setStrokeStyle(this.color);
        device.drawRect(this.p1, this.p2);
    }
}