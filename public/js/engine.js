import * as THREE from "https://unpkg.com/three@0.167.1/build/three.module.js";
import Player from "./player.js";

export default class Engine {

    constructor() {

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB);

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

        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

        this.renderer.setPixelRatio(
            window.devicePixelRatio
        );

        this.clock = new THREE.Clock();

        this.player = new Player(this.camera);

        this.createLights();
        this.createGround();
        this.createCube();

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

        const ambient =
            new THREE.AmbientLight(0xffffff, 2);

        this.scene.add(ambient);

        const sun =
            new THREE.DirectionalLight(0xffffff, 2);

        sun.position.set(20, 40, 20);

        this.scene.add(sun);

    }

    createGround() {

        const geometry =
            new THREE.PlaneGeometry(500, 500);

        const material =
            new THREE.MeshStandardMaterial({

                color: 0x3ba84d

            });

        const ground =
            new THREE.Mesh(
                geometry,
                material
            );

        ground.rotation.x = -Math.PI / 2;

        this.scene.add(ground);

    }

    createCube() {

        const cube =
            new THREE.Mesh(

                new THREE.BoxGeometry(2,2,2),

                new THREE.MeshStandardMaterial({

                    color:0xff4444

                })

            );

        cube.position.set(0,1,-8);

        this.scene.add(cube);

    }

    update(delta) {

        this.player.update(delta);

    }

    render() {

        this.renderer.render(
            this.scene,
            this.camera
        );

    }

    start() {

        const animate = () => {

            requestAnimationFrame(animate);

            const delta =
                this.clock.getDelta();

            this.update(delta);

            this.render();

        };

        animate();

    }

}
