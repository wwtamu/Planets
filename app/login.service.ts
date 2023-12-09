import {EventEmitter} from 'angular2/core';

export class LoginService {

    showing: boolean;

    emitter: EventEmitter;

    constructor() {
        this.showing = false;
        this.emitter = new EventEmitter();
    }

    isShowing() {
        this.showing;
    }

    setShowing(showing) {
        this.showing = showing;
        this.emitter.next(showing);
    }

}