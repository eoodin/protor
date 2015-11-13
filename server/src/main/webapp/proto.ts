import {Component, ElementRef, bootstrap, FORM_DIRECTIVES, CORE_DIRECTIVES} from 'angular2/angular2';

import {ProtoEditor} from 'proto/editor.ts';

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
    constructor(private editor: ProtoEditor) {
    }
}

@Component({
    selector: '[editor]',
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES],
    template: `
    <canvas class="editor" (mouseup)="mouseUp($event)" (mousedown)="mouseDown($event)" (mousemove)="mouseMove($event)"></canvas>
    `,
    styles: [`
    .editor { height: 100%; width: 100%; cursor: crosshair; display: block; }
    `]
})
class EditorComponent {
    private editorFocus: boolean;

    constructor(private editor: ProtoEditor, element: ElementRef) {
        editor.initialize(element);
        this.editorFocus = false;
    }

    mouseDown(event) {
        this.editorFocus = true;
        this.editor.getActiveTool().mouseDown(event);
    }

    mouseUp(event){
        this.editorFocus = true;
        this.editor.getActiveTool().mouseUp(event);
    }

    mouseMove(event){
        this.editor.getActiveTool().mouseMove(event);
    }

    onBlur(event) {
        this.editorFocus = false;
        console.log('mouse moved out from sense.')
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
        .left { float:left; height: 100%; width: 120px; box-sizing: border-box; border: 1px solid #AAA;}
        .right{ height: 100%; padding-left: 120px; box-sizing: border-box; border: 1px solid #AAA;}
    `],
    bindings: [ProtoEditor]
})
class Proto {
    constructor(private editor: ProtoEditor) {
    }
}

bootstrap(Proto);
