import {Component, View} from 'angular2/core';
import {NgClass, NgForm} from 'angular2/common';

import {LoginService} from './login.service'

@Component({
    selector: 'login'
})
@View({
        template: `
                    <div class="login fade in" [ngClass]="{in: showing}">
                        <form class="form-inline" (ngSubmit)="onSubmit()">
                            <div class="form-group">
                                <label class="sr-only" for="exampleInputEmail3">Email address</label>
                                <input type="email" class="form-control" id="exampleInputEmail3" placeholder="Enter email" autofocus>
                            </div>
                            <div class="form-group">
                                <label class="sr-only" for="exampleInputPassword3">Password</label>
                                <input type="password" class="form-control" id="exampleInputPassword3" placeholder="Password">
                            </div>  
                            <button type="submit" class="btn btn-primary">Sign in</button>
                            <button class="btn btn-warning" (click)="onCancel()">Cancel</button>
                        </form>
                    </div>
                  `
})

export class LoginComponent {
    showing: Boolean;
    constructor(private loginService: LoginService) {
        this.showing = false;
        this.loginService.emitter.subscribe((showing) => {
            this.showing = showing;
        });
    }

    onSubmit() {
        this.loginService.setShowing(false);
    }

    onCancel() {
        console.log('cancel');
        this.loginService.setShowing(false);
    }

}