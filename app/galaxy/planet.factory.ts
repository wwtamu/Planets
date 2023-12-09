import {Injectable} from 'angular2/core';

import {TextureService} from '../webgl/texture.service';
import {HttpService} from '../utils/http.service';

import {Planet} from '../model/planet.model';

@Injectable()
export class PlanetFactory {

    constructor(private textureService: TextureService, private httpService: HttpService) { }
    
    buildPlanet(prop) {

        let factory = this;
        
        return new Promise(

            function (resolve, reject) {

                factory.textureService.loadMultipleTextures([
                    prop.map,
                    prop.bumpMap,
                    prop.specMap,
                    prop.cloudMap,
                    prop.alphaMap
                ]).then(function (textures) {

                    let planet = new Planet();

                    // planet
                    planet.mesh = new THREE.Mesh(new THREE.SphereGeometry(prop.diameter, prop.widthSegments, prop.heightSegments),
                        new THREE.MeshPhongMaterial({
                            map: textures[0],
                            wireframe: false,
                            bumpMap: textures[1],
                            bumpScale: 0.25,
                            specularMap: textures[2],
                            specular: new THREE.Color('grey')
                    }));
                    planet.mesh.castShadow = true;
                    planet.mesh.receiveShadow = true;
                    planet.mesh.position.set(prop.x, prop.y, prop.z);

                    // highlight
                    planet.highlight = new THREE.Mesh(
                        new THREE.SphereGeometry(prop.diameter + prop.atmosphere + 0.005, prop.widthSegments, prop.heightSegments),
                        new THREE.MeshLambertMaterial({
                            color: 0x0000ff,
                            opacity: 0.25
                    }));
                    planet.highlight.position.set(prop.x, prop.y, prop.z);
                    planet.highlight.name = prop.name;


                    //spotlight
                    planet.spotLight = new THREE.SpotLight(0xffffff, .15, 0, 10, 2);
                    planet.spotLight.position.set(0, 0, 0);
                    planet.spotLight.castShadow = true;
                    planet.spotLight.shadow.camera.near = .005;


                    // atmosphere
                    

                    // clouds
                    if (prop.cloudMap != undefined) {                        
                        planet.clouds = new THREE.Mesh(new THREE.SphereGeometry(prop.diameter + prop.atmosphere, prop.widthSegments, prop.heightSegments),
                            new THREE.MeshPhongMaterial({
                                map: textures[3],
                                alphaMap: textures[4],
                                side: THREE.DoubleSide,
                                opacity: 0.9,
                                transparent: true,
                                depthWrite: false
                        }));
                        planet.clouds.castShadow = true;
                        planet.clouds.receiveShadow = true;
                        planet.clouds.position.set(prop.x, prop.y, prop.z);
                    }
                    planet.spotLight.target = planet.mesh;
                    planet.mass = prop.mass * Math.pow(10, prop.pow);
                    
                    resolve(planet);

                });

            }

        );

    }
    
}