import {EditPart, Model} from '../../edit/interfaces.ts';
import {RectangleFigure} from '../../graphics/figures/rectangle.ts';
import {Figure} from '../../graphics/interfaces.ts';

import {BoxModel} from '../model/box.ts';

export class BoxEditPart implements EditPart {
    private figure: RectangleFigure;

    constructor(private model: BoxModel) {}

    getModel():Model {
        return this.model;
    }
    onModelChange() {
        this.refresh();
    }

    onChildAdded(child:Model) {
    }

    onChildRemoved(child:Model) {
    }

    refresh() {
    }

    createFigure():Figure {
        this.figure = new RectangleFigure(this.getBoxModel().getStartPoint(), this.getBoxModel().getEndPoint());
        return this.figure;
    }

    private getBoxModel() : BoxModel {
        return this.model;
    }
}
