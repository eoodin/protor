import {Tool, Editor} from './interfaces.ts';

export class BaseTool implements Tool {
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

    public setActive(is: boolean) {
        this.active = is;
    }
}