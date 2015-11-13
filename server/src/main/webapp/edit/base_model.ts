import {Model, ModelChangeListener} from  './interfaces.ts';

export class BaseModel implements Model {

    private changeListeners: ModelChangeListener[];

    public constructor() {
        this.changeListeners = [];
    }

    addChangeListener(listener:ModelChangeListener) {
        this.changeListeners.push(listener);
    }

    removeChangeListener(lister:ModelChangeListener) {
        var idx = this.changeListeners.indexOf(lister);
        if (idx != -1) {
            this.changeListeners.splice(idx, 1);
        }
    }

    fireModelChanged() {
        for(var listener: ModelChangeListener of this.changeListeners ) {
            listener.onModelChange();
        }
    }

    fireChildAdded(child: Model) {
        for(var listener: ModelChangeListener of this.changeListeners ) {
            listener.onChildAdded(child);
        }
    }

    fireChildRemoved(child: Model) {
        for(var listener: ModelChangeListener of this.changeListeners ) {
            listener.onChildRemoved(child);
        }
    }
}