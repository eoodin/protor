import {EditPart, Model, Editor, DiagramModel} from '../interfaces.ts';
import {Figure} from '../../graphics/interfaces.ts';

export class DiagramEditPart implements EditPart {
    private editor: Editor;
    private children: EditPart[];

    public constructor(private model: DiagramModel) {
        model.addChangeListener(this);
        this.children = [];
    }

    public setEditor(e: Editor) {
        this.editor = e;
    }

    public onModelChange() {
    }

    public onChildAdded(child:Model) {
        var childEditPart: EditPart = this.createEditPart(child);
        if (!childEditPart) {
            alert('Error!');
            return;
        }

        this.editor.getDiagramFigure().addFigure(childEditPart.createFigure());

        this.children.push(childEditPart);
        childEditPart.refresh();
    }

    public onChildRemoved(child:Model) {
        // TODO
        console.log('Not implemented.');
    }

    public refresh() {
        // TODO
        console.log('Not implemented.');
    }

    public getModel():Model {
        return null;
    }

    protected createEditPart(model: Model) {

    }

    protected createFigure():Figure {
        // TODO
        console.log('Not implemented.');
        return null;
    }
}
