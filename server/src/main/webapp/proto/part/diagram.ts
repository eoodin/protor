import {Model, DiagramModel} from '../../edit/interfaces.ts';
import {DiagramEditPart} from '../../edit/part/diagram.ts';

import {BoxModel} from '../model/box.ts';

import {BoxEditPart} from './box.ts';

export class ProtoDiagramEditPart extends DiagramEditPart {
    constructor(model: DiagramModel) {
        super(model);
    }

    protected createEditPart(model: Model) {
        if (model instanceof BoxModel) {
            return new BoxEditPart(model);
        }

        return null;
    }
}