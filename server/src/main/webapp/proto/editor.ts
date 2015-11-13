import {DiagramEditor} from '../edit/diagram_editor.ts';
import {DiagramModel} from '../edit/interfaces.ts';

import {CanvasDevice} from '../graphics/canvas_device.ts';
import {ElementRef} from 'angular2/angular2';

import {BoxTool} from './tools/box.ts';
import {ProtoDiagramEditPart} from './part/diagram.ts';

export class ProtoEditor extends DiagramEditor {
    constructor() {
        super();
    }

    protected createRootEditPart(diagramModel: DiagramModel) {
        return new ProtoDiagramEditPart(diagramModel);
    }

    createTools() {
        return [
            new BoxTool(this),
        ];
    }

    initialize(er: ElementRef):void {
        var el:any    = er['nativeElement'];
        var canvas = el.children[0];
        this.getDiagramFigure().setDevice(new CanvasDevice(canvas));
    }
}
