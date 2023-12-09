
export class Planet {

    mass: number;

    axis: THREE.Vector3;

    orbit:  3.75 * Math.PI / 180;

    spin: 0.25 * Math.PI / 180;


    mesh: THREE.Mesh;

    clouds: THREE.Mesh;

    atmosphere: THREE.Mesh;


    satellites: [];

    lights: [];


    


    highlight: THREE.Mesh;

    quaternion: THREE.Quaternion;


    velocity: THREE.Vector3;

    position: THREE.Vector3;

    nextPosition: THREE.Vector3;

    spotLight: THREE.SpotLight;
        
    constructor() {
        var tilt = 53.4 * Math.PI / 180;
        this.axis = new THREE.Vector3(Math.cos(tilt), Math.sin(tilt), 0).normalize();
        this.quaternion = new THREE.Quaternion();
    }

    setMesh(mesh) {
        this.mesh = mesh;
    }

    setClouds(clouds) {
        this.clouds = clouds;
    }

    setSatellites(satellites) {
        this.satellites = satellites;
    }

    setLights(lights) {
        this.lights = lights;
    }

    setAxes(spin) {
        this.spin = spin;
    }

    setSpin(spin) {
        this.spin = spin;
    }

    setHighlight(highlight) {
        this.highlight = highlight;
    }

    rotate() {
        // spin planet
        this.quaternion.setFromAxisAngle(this.axis, this.spin);
        this.mesh.quaternion.multiplyQuaternions(this.quaternion, this.mesh.quaternion);

        // spin clouds
        if (this.clouds != undefined) {
            this.quaternion.setFromAxisAngle(this.axis, this.spin + (Math.random() / 250));
            this.clouds.quaternion.multiplyQuaternions(this.quaternion, this.clouds.quaternion);
        }
    }

    revolve(sun) {

    }

}