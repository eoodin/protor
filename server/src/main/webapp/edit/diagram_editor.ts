import {Editor, DiagramModel, Tool, CommandStack} from './interfaces.ts';
import {StandardCommandStack} from './command_stack.ts';
import {DiagramEditPart} from './part/diagram.ts';

import {DiagramFigure} from '../graphics/figures/diagram_figure.ts';
import {BaseTool} from '../edit/base_tool.ts';
import {StandardDiagramModel} from './standard_diagram_model.ts';

export class DiagramEditor implements Editor{
    public tools: Tool[];
    public activeTool;
    private diagramFigure: DiagramFigure;
    private diagramModel: DiagramModel;
    private commandStack: CommandStack;
    private rootEditPart: DiagramEditPart;

    private defaultTool: Tool;

    constructor() {
        this.diagramFigure = new DiagramFigure(null);
        this.diagramModel = new StandardDiagramModel();
        this.commandStack = new StandardCommandStack();
        this.rootEditPart = this.createRootEditPart(this.diagramModel);
        this.rootEditPart.setEditor(this);
        this.tools = this.createTools();
    }

    protected createRootEditPart(diagramModel: DiagramModel) {
        return null;
    }

    protected createTools() {}

    public chooseTool(tool) {
        this.tools.forEach(t => t.setActive(false));
        tool.active = true;
        this.activeTool = tool;
    }

    public onWindowResize():void {
        this.diagramFigure && this.diagramFigure.invalid();
    }

    public getDiagramFigure() {
        return this.diagramFigure;
    }

    public getModel() : DiagramModel {
        return this.diagramModel;
    }

    public getCommandStack() : CommandStack {
        return this.commandStack;
    }

    public getActiveTool() : Tool {
        return this.activeTool ? this.activeTool : this.getDefaultTool();
    }

    private getDefaultTool() : Tool {
        if (!this.defaultTool) {
            this.defaultTool = new BaseTool(this);
        }

        return this.defaultTool;
    }
}
