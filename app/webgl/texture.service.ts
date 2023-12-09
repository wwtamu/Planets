import {Injectable} from 'angular2/core';

@Injectable()
export class TextureService {

    textureLoader: THREE.TextureLoader;
    cubeRextureLoader: THREE.CubeTextureLoader;

    constructor() {
        this.setTextureLoader(new THREE.TextureLoader());
        this.setCubeTextureLoader(new THREE.CubeTextureLoader());
    }

    setTextureLoader(textureLoader) {
        this.textureLoader = textureLoader;
    }

    setCubeTextureLoader(cubeRextureLoader) {
        this.cubeRextureLoader = cubeRextureLoader;
    }

    loadTexture(file) {
        return this.textureLoader.load(file);
    }

    loadMultipleTextures(files) {
        var promises = [];
        files.forEach(file => {
            promises.push(this.loadTexture(file));
        });
        return Promise.all(promises);
    }

    loadCubeTexture(urls) {
        return this.cubeRextureLoader.load(urls);
    }

}