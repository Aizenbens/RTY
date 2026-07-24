import * as THREE from "https://unpkg.com/three@0.167.1/build/three.module.js";

export default class Engine {

    constructor() {

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87ceeb);

        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById("gameCanvas"),
            antialias: true
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.clock = new THREE.Clock();

        this.createLights();

        this.createGround();

        this.camera.position.set(0, 2, 5);

        window.addEventListener("resize", () => {

            this.camera.aspect =
                window.innerWidth / window.innerHeight;

            this.camera.updateProjectionMatrix();

            this.renderer.setSize(
                window.innerWidth,
                window.innerHeight
            );

        });

    }

    createLights() {

        const ambient = new THREE.AmbientLight(
            0xffffff,
            2
        );

        this.scene.add(ambient);

        const sun = new THREE.DirectionalLight(
            0xffffff,
            2
        );

        sun.position.set(20, 30, 15);

        this.scene.add(sun);

    }

    createGround() {

        const geometry =
            new THREE.PlaneGeometry(
                500,
                500
            );

        const material =
            new THREE.MeshStandardMaterial({

                color: 0x4caf50

            });

        const ground =
            new THREE.Mesh(
                geometry,
                material
            );

        ground.rotation.x =
            -Math.PI / 2;

        this.scene.add(ground);

    }

    update(delta) {

    }

    render() {

        this.renderer.render(
            this.scene,
            this.camera
        );

    }

    start() {

        const animate = () => {

            requestAnimationFrame(
                animate
            );

            const delta =
                this.clock.getDelta();

            this.update(delta);

            this.render();

        };

        animate();

    }

}
