import {BaseTool} from '../../edit/base_tool.ts';
import {Editor, Command} from '../../edit/interfaces.ts';

import {Point} from '../../graphics/interfaces.ts';
import {RectangleFigure} from '../../graphics/figures/rectangle.ts';

import {CreateBoxRequest} from '../requests/create_box.ts';
import {CreateBoxCommand} from '../commands/create_box.ts';


export class BoxTool extends BaseTool{
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
            this.feedbackFigure.setColor('#E77');
        }

        return this.feedbackFigure;
    }
}