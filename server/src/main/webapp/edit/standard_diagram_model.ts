import {DiagramModel, Model, ModelChangeListener} from './interfaces.ts';

import {BaseModel} from './base_model.ts';

export class StandardDiagramModel extends BaseModel implements DiagramModel {

    private entities: Model[];

    public constructor() {
        super();
        this.entities = [];
    }

    public getEntities() : Model[] {
        return this.entities;
    }

    public addEntity(entity: Model) {
        this.entities.push(entity);
        this.fireChildAdded(entity);
    }

    public removeEntity(entity: Model) {
        var idx = this.entities.indexOf(entity);
        if (idx != -1) {
            this.entities.splice(idx, 1);
            this.fireChildRemoved(entity);
        }
    }
}