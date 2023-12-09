import {bootstrap} from 'angular2/platform/browser'
import {HTTP_PROVIDERS, Http} from 'angular2/http';
import {ROUTER_PROVIDERS} from 'angular2/router';

import {AppComponent} from './app.component'

import {PlanetFactory} from './galaxy/planet.factory';

import {WebGl} from './webgl/webgl.service';

import {TextureService} from './webgl/texture.service'
import {HttpService} from './utils/http.service'
import {WebSocketService} from './utils/websocket.service'

import 'rxjs/add/operator/map';

bootstrap(AppComponent, [ROUTER_PROVIDERS, HTTP_PROVIDERS, HttpService, WebSocketService, TextureService, PlanetFactory, WebGl]);
