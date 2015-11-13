import {Figure} from '../graphics/interfaces.ts';

export interface ModelChangeListener {
    onModelChange();
    onChildAdded(child: Model);
    onChildRemoved(child: Model);
}

export interface Model {
    addChangeListener(listener: ModelChangeListener);
    removeChangeListener(lister: ModelChangeListener);
}

export interface EditPart extends ModelChangeListener {
    refresh();
    createFigure(): Figure;
    getModel(): Model;
}


export interface Command {
    execute();
    redo();
    undo();

    canRedo(): boolean;
    canUndo(): boolean;
}

export interface CommandStack {
    executeCommand(command: Command);
    redo();
    undo();
}

export interface Request {

}

export interface Tool {
    mouseDown(event);
    mouseUp(event);
    mouseMove(event);

    getEditor() : Editor;

    setActive(active: boolean);
}

export interface DiagramModel extends Model {
    getEntities() : Model[];
    addEntity(entity: Model);
    removeEntity(entity: Model)
}

export interface Editor {
    getDiagramFigure();
    getModel() : DiagramModel;
    getCommandStack(): CommandStack;
}
