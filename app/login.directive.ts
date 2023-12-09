import {Directive, Input} from 'angular2/core';

import {LoginService} from './login.service'

@Directive({
    selector: '[loginClick]',
    host: {
        '(click)': 'onMouseClick()'
    }
})
export class LoginDirective {

    open: boolean;

    constructor(private loginService: LoginService) {
        this.open = false;
    }

    onMouseClick() {
        this.open = !this.open;
        this.loginService.setShowing(this.open);
    }
    
}