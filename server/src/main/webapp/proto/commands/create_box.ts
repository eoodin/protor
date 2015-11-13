import {Command, DiagramModel} from '../../edit/interfaces';

import {Point} from '../../graphics/interfaces.ts';

import {BoxModel} from '../model/box.ts';

export class CreateBoxCommand implements Command {
    private startPoint: Point;
    private endPoint: Point;
    private boxModel;

    constructor(private model: DiagramModel) {
    }

    public execute() {
        this.boxModel = new BoxModel(this.startPoint, this.endPoint);
        this.model.addEntity(this.boxModel);
    }

    public redo() {
        this.model.addEntity(this.boxModel);
    }

    public undo() {
        this.model.removeEntity(this.boxModel);
    }

    public canRedo():boolean {
        return true;
    }

    public canUndo():boolean {
        return this.boxModel && true;
    }

    public setStartPoint(p: Point) {
        this.startPoint = p ;
    }

    public setEndPoint(p: Point) {
        this.endPoint = p ;
    }

}