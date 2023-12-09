import {Injectable} from 'angular2/core';

import {TextureService} from './texture.service';
import {WebSocketService} from '../utils/websocket.service';
import {HttpService} from '../utils/http.service';

import {PlanetFactory} from '../galaxy/planet.factory';

import {Planet} from '../model/planet.model';

@Injectable()
export class WebGl {

    clock: THREE.Clock;

    scene: THREE.Scene;

    camera: THREE.Camera;

    renderer: THREE.WebGLRenderer;

    light: THREE.AmbientLight;

    planets: [];

    selectable: [];

    skybox: THREE.Mesh;

    raycaster: THREE.Raycaster;

    controls: THREE.FirstPersonControls;

    width: number;
    height: number;

    active: boolean;
    
    constructor(private planetFactory: PlanetFactory, private httpService: HttpService, private webSocketService: WebSocketService) {

        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();
        this.renderer = new THREE.WebGLRenderer();
        this.raycaster = new THREE.Raycaster();

        this.planets = new Array();
        this.selectable = new Array();

        this.width = 800;
        this.height = 800;
        this.active = false;
    }

    init(height, width) {

        this.height = height;
        this.width = width;

        // camera
        {

            this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 200000);

            this.camera.position.set(1490.0, 0.0, 0.0);

            this.camera.receiveShadow = true;

            this.camera.lookAt({
                x: 1496,
                y: 0,
                z: 0
            });
            
            this.scene.add(this.camera);

        }

        // controls
        {   
            this.controls = new THREE.FirstPersonControls(this.camera);

            this.controls.movementSpeed = 100.0;
            this.controls.lookSpeed = 0.20;
            this.controls.lookVertical = true;
            this.controls.enabled = true;
        }

        // renderer
        {
           
            this.renderer.setSize(this.width, this.height);
            this.renderer.setClearColor(0x000000, 1);
        }

        // light
        {
            // TODO: apply lights to planets/suns

            this.light = new THREE.AmbientLight(0x010104);

            this.scene.add(this.light);
            
        }

        // skybox
        {
            // TODO: move with controls

            let textureService = new TextureService();


            let urlPrefix = "images/skybox/";

            let urls = [
                urlPrefix + "galaxy_rit.png",
                urlPrefix + "galaxy_lft.png",
                urlPrefix + "galaxy_top.png",
                urlPrefix + "galaxy_btm.png",
                urlPrefix + "galaxy_frn.png",
                urlPrefix + "galaxy_bak.png"
            ];

            let cubemap = textureService.loadCubeTexture(urls);
            cubemap.format = THREE.RGBFormat;

            let shader = THREE.ShaderLib["cube"];
            shader.uniforms['tCube'].value = cubemap;

            let material = new THREE.ShaderMaterial({
                fragmentShader: shader.fragmentShader,
                vertexShader: shader.vertexShader,
                uniforms: shader.uniforms,
                depthWrite: false,
                side: THREE.BackSide
            });

            this.skybox = new THREE.Mesh(new THREE.CubeGeometry(200000, 200000, 200000, 1, 1, 1, null, true), material);

            this.scene.add(this.skybox);
        }
    }

    isActive() {
        return this.active;
    }

    getRenderer() {
        return this.renderer;
    }

    getScene() {
        return this.scene;
    }

    getCamera() {
        return this.camera;
    }

    mouseDown(event) {
        
        let mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        let mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

        let vector = new THREE.Vector3(mouseX, mouseY, 1);

        vector.unproject(this.camera);

        this.raycaster.set(this.camera.position, vector.sub(this.camera.position).normalize());

        let intersects = this.raycaster.intersectObjects(this.selectable);
        
        if (intersects.length > 0) {

            let highlight = this.scene.getObjectByName('highlight');

            if (highlight != undefined) {
                this.scene.remove(highlight);
            }
            else {
                console.log(intersects);
                //this.scene.add(highlight);
            }

        }
        
    }

    mouseUp(event) {

    }

    mouseMove(event) {
        
    }

    mouseEnter(event) {
        this.controls.enabled = true;
    }

    mouseLeave(event) {
        this.controls.enabled = false;
    }

    toggleAutoMouseControls() {
        this.controls.enabled = !this.controls.enabled;
    }

    keyDown(event) {

        this.controls.onKeyDown(event);

        switch (event.keyCode) {
            case 32: { // space
                this.toggleAutoMouseControls();
            } break;
            case 87: { // w
                this.controls.moveForward = true;
            } break;
            case 83: { // s
                this.controls.moveBackward = true;
            } break;
            case 65: { // a
                this.controls.moveLeft = true;
            } break;
            case 68: { // d
                this.controls.moveRight = true;
            } break;
            case 82: { // r
                this.camera.translateY(0.15);
            } break;
            case 70: { // f
                this.camera.translateY(-0.15);
            } break;
        }

    }
    
    loadPlanets() {
        
        this.webSocketService.getManyJson([
            './resources/planets/sun.json',
            './resources/planets/mercury.json',
            './resources/planets/venus.json',
            './resources/planets/earth.json',
            './resources/planets/mars.json',
            './resources/planets/jupiter.json',
            './resources/planets/saturn.json',
            './resources/planets/uranus.json',
            './resources/planets/neptune.json'
        ]).subscribe(
            res => {
                let webgl = this;

                res.forEach(data => {
                    this.planetFactory.buildPlanet(data).then(function (planet) {

                        console.log(planet);
                        // planets
                        webgl.planets.push(planet);

                        // scene
                        webgl.scene.add(planet.mesh);

                        if (planet.atmosphere != undefined) {
                            webgl.scene.add(planet.atmosphere);
                        }

                        if (planet.clouds != undefined) {
                            webgl.scene.add(planet.clouds);
                        }

                        webgl.scene.add(planet.spotLight);

                        // selectable
                        webgl.selectable.push(planet.highlight);
                    });
                });
            },
            err => {
                console.error(err);
            },
            () => { /* done */ }
        );
        
        //this.httpService.getManyJson([
        //    'resources/planets/sun.json',
        //    'resources/planets/mercury.json',
        //    'resources/planets/venus.json',
        //    'resources/planets/earth.json',
        //    'resources/planets/mars.json',
        //    'resources/planets/jupiter.json',
        //    'resources/planets/saturn.json',
        //    'resources/planets/uranus.json',
        //    'resources/planets/neptune.json'
        //]).subscribe(
        //    res => {
        //        let webgl = this;
        //
        //        res.forEach(data => {
        //            this.planetFactory.buildPlanet(data).then(function (planet) {
        //
        //                // planets
        //                webgl.planets.push(planet);
        //
        //                // scene
        //                webgl.scene.add(planet.mesh);
        //
        //                if (planet.atmosphere != undefined) {
        //                    webgl.scene.add(planet.atmosphere);
        //                }
        //
        //                if (planet.clouds != undefined) {
        //                    webgl.scene.add(planet.clouds);
        //                }
        //
        //                webgl.scene.add(planet.spotLight);
        //
        //                // selectable
        //                webgl.selectable.push(planet.highlight);
        //            });
        //        });
        //    },
        //    err => {
        //        console.error(err);
        //    },
        //    () => { /* done */ }
        //);
        
    }

    clear() {
        this.renderer.clear();
    }

    resize(height, width) {
        this.height = height;
        this.width = width;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.controls.handleResize();
    }

    rotate() {
        this.planets.forEach(function (planet) {
            planet.rotate();
        });
    }

    revolve() {
        
    }

    animate() {
        this.rotate();
        this.revolve();
        this.render();
        requestAnimationFrame(() => this.animate());
    }

    render() {
        var delta = this.clock.getDelta();
        this.controls.update(delta);
        this.renderer.render(this.getScene(), this.getCamera());
    }
    
    start() {
        this.loadPlanets();
        this.clear();
        this.animate();
        this.active = true;
    }

}