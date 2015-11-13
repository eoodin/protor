import {Command, CommandStack} from './interfaces.ts';

export class StandardCommandStack implements CommandStack {
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