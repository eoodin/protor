import {Figure, DrawDevice} from '../interfaces.ts';

export class DiagramFigure implements Figure {
    private figures: Figure[];
    private device: DrawDevice;

    constructor(parent) {
        this.figures = [];
    }

    public addFigure(figure: Figure) {
        this.figures.push(figure);

        this.repaint();
    }

    public removeFigure(figure: Figure) {
        for(var i = this.figures.length - 1; i > -1; i--){
            if (this.figures[i] === figure) {
                this.figures.splice(i, 1);
                break;
            }
        }

        this.repaint();
    }

    public setDevice(device: DrawDevice) {
        this.device = device;
    }

    public paint(device: DrawDevice) {
        for (var f of this.figures) {
            f.paint(device);
        }
    }

    public invalid() {
        this.repaint();
    }

    private repaint() {
        this.device.clear();
        this.paint(this.device);
    }
}