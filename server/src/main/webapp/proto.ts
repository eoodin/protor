import {Component, bootstrap, FORM_DIRECTIVES, CORE_DIRECTIVES} from 'angular2/angular2';

@Component({
    selector: '[proto-app]',
    template: '<canvas class="proto-canvas" resize></canvas>',
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES]
})
class Proto {
    constructor() {
    }
}

bootstrap(Proto);
