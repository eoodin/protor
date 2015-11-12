import {Component, ElementRef, bootstrap, FORM_DIRECTIVES, CORE_DIRECTIVES} from 'angular2/angular2';

class Point {
    constructor(public x:number, public y:number) {}
}

class Tool {
    public name;
    public active;

    constructor(private editor: Editor) {
    }

    public mouseDown(event) {
    }

    public mouseUp(event) {
    }

    public mouseMove(event){
    }

    public getEditor() : Editor {
        return this.editor;
    }
}


interface DrawDevice {
    drawRect(p1: Point, p2: Point);
    clear();
}

class CanvasDevice implements DrawDevice {
    private context;
    constructor(private canvasElement) {
        this.context = canvasElement.getContext('2d');
        this.context.width = canvasElement.clientWidth;
        this.context.height = canvasElement.clientHeight;
        this.resetSize();
    }

    public drawRect(p1: Point, p2: Point) {
        this.context.beginPath();
        this.context.lineWidth = 2;
        this.context.strokeStyle = '#005588';
        this.context.moveTo(p1.x, p1.y);
        this.context.lineTo(p1.x, p2.y);
        this.context.lineTo(p2.x, p2.y);
        this.context.lineTo(p2.x, p1.y);
        this.context.lineTo(p1.x, p1.y);
        this.context.closePath();
        this.context.stroke();
    }

    public clear() {
        this.context.clearRect(0, 0, this.context.width, this.context.height);
        this.resetSize();
    }

    private resetSize(){
        this.canvasElement.width =  this.canvasElement.clientWidth;
        this.canvasElement.height =  this.canvasElement.clientHeight;
    }
}

interface Figure {
    paint(device: DrawDevice);
}


class RectangleFigure implements Figure {
    constructor(public p1, public p2) {

    }

    public paint(device: DrawDevice) {
        device.drawRect(this.p1, this.p2);
    }
}

class DiagramFigure implements Figure {
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

interface ModelChangeListener {
    onModelChange();
    onChildAdded(child: Model);
    onChildRemoved(child: Model);
}

interface Model {
    addChangeListener(listener: ModelChangeListener);
    removeChangeListener(lister: ModelChangeListener);
}

interface EditPart extends ModelChangeListener {
    refresh();
    createFigure(): Figure;
    getModel(): Model;
}

class DiagramView {
    constructor(private editPart: EditPart) {
    }

    public setRootFigure(figure: Figure) {
        this.rootFigure = figure;
    }

    public setModel(model: DiagramModel) {
        this.model = model;
    }

    public update() {
        this.rootFigure.addFigure(this.editPart.getFigure());
        this.editor.getDiagramFigure().invalid();
    }
}

class BoxEditPart implements EditPart {
    private figure: RectangleFigure;

    constructor(private model: Model) {}

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

class DiagramEditPart implements EditPart {
    private editor: Editor;
    private children: EditPart[];

    public constructor(private model: DiagramModel) {
        model.addChangeListener(this);
        this.children = [];
    }

    public setEditor(e: Editor) {
        this.editor = e;
    }

    onModelChange() {
    }

    onChildAdded(child:Model) {
        var childEditPart: EditPart = this.createEditPart(child);
        if (!childEditPart) {
            alert('Error!');
            return;
        }

        this.editor.getDiagramFigure().addFigure(childEditPart.createFigure());

        this.children.push(childEditPart);
        childEditPart.refresh();
    }

    onChildRemoved(child:Model) {
    }

    public refresh() {
    }

    createFigure():Figure {
        console.log("Not implemented.");
        return null;
    }

    private createEditPart(model: Model) {
        if (model instanceof BoxModel) {
            return new BoxEditPart(model);
        }

        return null;
    }
}

class BaseModel implements Model {

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

class DiagramModel extends BaseModel {
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

interface Command {
    execute();
    redo();
    undo();

    canRedo(): boolean;
    canUndo(): boolean;
}

interface Request {

}

class CreateBoxRequest implements Request {
    private startPoint;
    private endPoint;

    constructor(p1: Point, p2: Point) {
        this.startPoint = p1;
        this.endPoint = p2;
    }

    public getStartPoint() {
        return this.startPoint;
    }

    public getEndPoint() {
        return this.endPoint;
    }
}

class BoxModel implements Model {
    constructor(private p1: Point, private p2: Point) {
    }

    public getStartPoint(): Point {
        return this.p1;
    }

    public getEndPoint(): Point {
        return this.p2;
    }
}

class CreateBoxCommand implements Command {
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
        return ! typeof(this.boxModel) == 'undefined' && this.boxModel != null;
    }

    public setStartPoint(p: Point) {
        this.startPoint = p ;
    }

    public setEndPoint(p: Point) {
        this.endPoint = p ;
    }

}

class CommandStack {
    private commandStack;

    constructor() {
        this.commandStack = [];
    }

    public executeCommand(command: Command) {
        command.execute();
        this.commandStack.push(command);
    }

    public redo() {

    }

    public undo() {

    }
}

class BoxTool extends Tool{
    private startPoint: Point;
    private feedbackFigure: RectangleFigure;
    private creatingBox: boolean;

    constructor(editor: Editor) {
        super(editor);
        this.name = 'Box';
        this.creatingBox = false;

    }

    public mouseDown(event) {
        this.startPoint = new Point(event.offsetX, event.offsetY);
        this.getEditor().getDiagramFigure().addFigure(this.getFeedbackFigure());
        this.creatingBox = true;
    }

    public mouseUp(event) {
        this.getEditor().getDiagramFigure().removeFigure(this.getFeedbackFigure());
        this.creatingBox = false;
        this.feedbackFigure = null;

        var endPoint = new Point(event.offsetX, event.offsetY);
        var request = new CreateBoxRequest(this.startPoint, endPoint);
        var command = this.createCommand(request);
        this.getEditor().getCommandStack().executeCommand(command);

        this.getEditor().getDiagramFigure().invalid();
    }

    private createCommand(request: CreateBoxRequest) : Command {
        var p1: Point = request.getStartPoint();
        var p2: Point = request.getEndPoint();

        var createBoxCommand = new CreateBoxCommand(this.getEditor().getModel());
        createBoxCommand.setStartPoint(p1);
        createBoxCommand.setEndPoint(p2);
        return createBoxCommand;
    }

    public mouseMove(event){
        if (this.creatingBox) {
            this.getFeedbackFigure().p2.x = event.offsetX;
            this.getFeedbackFigure().p2.y = event.offsetY;

            this.getEditor().getDiagramFigure().invalid();
        }
    }

    private getFeedbackFigure(): RectangleFigure {
        if ( ! this.feedbackFigure){
            this.feedbackFigure = new RectangleFigure(this.startPoint, new Point(this.startPoint.x, this.startPoint.y));
        }

        return this.feedbackFigure;
    }

}

class Editor {
    public tools: Tool[];
    public activeTool;
    private diagramFigure: DiagramFigure;
    private diagramModel: DiagramModel;
    private commandStack: CommandStack;
    private rootEditPart: DiagramEditPart;

    constructor() {
        this.tools = [
            new BoxTool(this),
        ];

        this.diagramFigure = new DiagramFigure(null);
        this.diagramModel = new DiagramModel();
        this.commandStack = new CommandStack();
        this.rootEditPart = new DiagramEditPart(this.diagramModel);
        this.rootEditPart.setEditor(this);
    }

    public chooseTool(tool) {
        this.tools.forEach(t => t.active = false);
        tool.active = true;
        this.activeTool = tool;
    }

    public getDiagramFigure() {
        return this.diagramFigure;
    }

    initialize(er: ElementRef):void {
        var el:any    = er['nativeElement'];
        var canvas = el.children[0];
        this.diagramFigure.setDevice(new CanvasDevice(canvas));
    }

    public getModel() : DiagramModel {
        return this.diagramModel;
    }

    public getCommandStack() : CommandStack {
        return this.commandStack;
    }
}

@Component({
    selector: 'tool-box',
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES],
    template: `
    <ul class="tool-box">
       <li
         *ng-for="#tool of editor.tools"
         [ng-class]="{active: tool.active}"
         (click)="editor.chooseTool(tool);">
        {{tool.name}}
       </li>
    </ul>
    `,
    styles: [`
    .tool-box>li { width: 100%; background-color: #AAA; list-style: none;}
    .tool-box>li.active {background-color: #555; color: #EEE}
    `]
})
class ToolBox {
    constructor(private editor: Editor) {
    }
}

class ToolStub extends Tool {
    public mouseDown(event) { }

    public mouseUp(event) { }

    public mouseMove(event){ }
}


@Component({
    selector: '[editor]',
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES],
    template: `
    <canvas class="editor" (mouseup)="mouseUp($event)" (mousedown)="mouseDown($event)" (mousemove)="mouseMove($event)" resize></canvas>
    `,
    styles: [`
    .editor { height: 100%; width: 100%; }
    `]
})
class EditorComponent {
    private toolStub: Tool;

    private editorFocus: boolean;

    constructor(private editor: Editor, element: ElementRef) {
        editor.initialize(element);
        this.toolStub = new ToolStub(this.editor);
        this.editorFocus = false;
    }

    mouseDown(event) {
        this.editorFocus = true;
        this.getCurrentTool().mouseDown(event);
    }

    mouseUp(event){
        this.editorFocus = true;
        this.getCurrentTool().mouseUp(event);
    }

    mouseMove(event){
        this.getCurrentTool().mouseMove(event);
    }

    onBlur(event) {
        this.editorFocus = false;
        console.log('mouse moved out from sense.')
    }

    private getCurrentTool() : Tool {
        if ( ! this.editorFocus) return this.toolStub;

        var t = this.editor.activeTool || this.toolStub;
        return t;
    }
}

@Component({
    selector: '[proto-app]',
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES, ToolBox, EditorComponent],
    template: `
    <div class="left"><tool-box></tool-box></div>
    <div class="right" editor></div>
    `,
    styles: [`
        .left { float:left; height: 100%; width: 120px;}
        .right{ height: 100%; padding-left: 120px; }
    `],
    bindings: [Editor]
})
class Proto {
    constructor(private editor: Editor) {
    }
}

bootstrap(Proto);
