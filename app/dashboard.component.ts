import {Component, View, ElementRef} from 'angular2/core';
import {WebGl} from './webgl/webgl.service';

@Component({
    selector: "dashboard"
})
@View({
        template: `
                    <div id="content"
                        (document:keydown)="onKeyDown($event)"
                        (window:resize)="onResize($event)" 
                        (mousedown)="onMouseDown($event)" 
                        (mousemove)="onMouseMove($event)" 
                        (mouseup)="onMouseUp($event)"
                        (mouseenter)="onMouseEnter($event)"
                        (mouseleave)="onMouseLeave($event)">
                    </div>
                  `
})
export class DashboardComponent {

    // template element
    elementRef: ElementRef;

    constructor(elementRef: ElementRef, private webGl: WebGl) {
        this.elementRef = elementRef;
    }

    onKeyDown(event) {
        this.webGl.keyDown(event);
    }

    onMouseEnter(event) {
        this.webGl.mouseEnter(event);
    }

    onMouseLeave(event) {
        this.webGl.mouseLeave(event);
    }

    onResize(event) {        
        this.webGl.resize(event.target.innerHeight, event.target.innerWidth);
    }

    onMouseDown(event) {
        this.webGl.mouseDown(event);
    }

    onMouseMove(event) {
        this.webGl.mouseMove(event);
    }

    onMouseUp(event) {
        this.webGl.mouseUp(event);
    }

    ngAfterViewInit() {
        var webGlContainer = this.elementRef.nativeElement.querySelector('#content');
        
        // add renderer dom element
        webGlContainer.appendChild(this.webGl.getRenderer().domElement);
        
        // start
        if (this.webGl.isActive()) {
            // you've returned
            alert('Welcome back');
        }
        else {
            this.webGl.init(webGlContainer.clientHeight, webGlContainer.clientWidth);
            this.webGl.start();
        }
                
    }
    
}