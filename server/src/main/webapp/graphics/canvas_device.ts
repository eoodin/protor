import {Point, DrawDevice} from './interfaces.ts';

export class CanvasDevice implements DrawDevice {
    private context;
    private strokeStyle;

    constructor(private canvasElement) {
        this.context = canvasElement.getContext('2d');
        this.context.width = canvasElement.clientWidth;
        this.context.height = canvasElement.clientHeight;
        this.resetSize();
    }

    public drawRect(p1:Point, p2:Point) {
        this.context.beginPath();
        this.context.lineWidth = 2;
        this.context.strokeStyle = this.strokeStyle ? this.strokeStyle : '#000';
        this.context.strokeRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
    }

    public setStrokeStyle(style) {
        this.strokeStyle = style;
    }

    public clear() {
        this.context.clearRect(0, 0, this.context.width, this.context.height);
        this.resetSize();
    }

    private resetSize() {
        this.canvasElement.width = this.canvasElement.clientWidth;
        this.canvasElement.height = this.canvasElement.clientHeight;
    }
}
