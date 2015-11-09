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

class Diagram implements Figure {
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
        for(var i = this.figures.length - 1; i--;){
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
        this.getEditor().getDiagram().addFigure(this.getFeedbackFigure());
        this.creatingBox = true;
    }

    public mouseUp(event) {
        this.getEditor().getDiagram().removeFigure(this.getFeedbackFigure());
        this.creatingBox = false;
        this.feedbackFigure = null;

        var endPoint = new Point(event.offsetX, event.offsetY);
        var rect = new RectangleFigure(this.startPoint, endPoint);
        this.getEditor().getDiagram().addFigure(rect);
    }

    public mouseMove(event){
        if (this.creatingBox) {
            this.getFeedbackFigure().p2.x = event.offsetX;
            this.getFeedbackFigure().p2.y = event.offsetY;

            this.getEditor().getDiagram().invalid();
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
    private diagram: Diagram;
    private element: ElementRef;

    constructor() {
        this.tools = [
            new BoxTool(this),
        ];

        this.diagram = new Diagram(null);
    }

    public chooseTool(tool) {
        this.tools.forEach(t => t.active = false);
        tool.active = true;
        this.activeTool = tool;
    }

    public getDiagram() {
        return this.diagram;
    }

    initialize(er: ElementRef):void {
        var el:any    = er['nativeElement'];
        var canvas = el.children[0];
        this.diagram.setDevice(new CanvasDevice(canvas));
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
    <canvas class="editor" (mouseup)="mouseUp($event)" (mousedown)="mouseDown($event)" (mousemove)="mouseMove($event)" height="1099" width="1783"></canvas>
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
