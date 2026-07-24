import * as THREE from "https://unpkg.com/three@0.167.1/build/three.module.js";

import Player from "./player.js";
import Weapon from "./weapon.js";
import Enemy from "./enemy.js";

export default class Engine {

    constructor() {

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB);
        this.scene.fog = new THREE.Fog(0x87CEEB, 80, 180);

        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        this.scene.add(this.camera);

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

        this.renderer.shadowMap.enabled = true;

        this.clock = new THREE.Clock();

        this.player = new Player(this.camera);

        this.weapon = new Weapon(
            this.scene,
            this.camera
        );

        this.enemies = [];

        this.createLights();

        this.createGround();

        this.createEnvironment();

        this.spawnEnemies();

        this.setupEvents();

        window.addEventListener("resize", () => {

            this.camera.aspect =
                window.innerWidth /
                window.innerHeight;

            this.camera.updateProjectionMatrix();

            this.renderer.setSize(
                window.innerWidth,
                window.innerHeight
            );

        });

    }

    createLights() {

        const ambient =
            new THREE.AmbientLight(
                0xffffff,
                2
            );

        this.scene.add(ambient);

        const sun =
            new THREE.DirectionalLight(
                0xffffff,
                3
            );

        sun.position.set(25,40,25);

        sun.castShadow = true;

        sun.shadow.mapSize.width = 2048;
        sun.shadow.mapSize.height = 2048;

        this.scene.add(sun);

    }

    createGround() {

        const ground =
            new THREE.Mesh(

                new THREE.PlaneGeometry(
                    500,
                    500
                ),

                new THREE.MeshStandardMaterial({

                    color:0x3AA655

                })

            );

        ground.rotation.x = -Math.PI/2;

        ground.receiveShadow = true;

        ground.name = "Ground";

        this.scene.add(ground);

    }

    createEnvironment() {

        for(let i=0;i<60;i++){

            const cube =
                new THREE.Mesh(

                    new THREE.BoxGeometry(

                        2 + Math.random()*4,

                        2 + Math.random()*8,

                        2 + Math.random()*4

                    ),

                    new THREE.MeshStandardMaterial({

                        color:Math.random()*0xffffff

                    })

                );

            cube.position.set(

                (Math.random()-0.5)*180,

                cube.geometry.parameters.height/2,

                (Math.random()-0.5)*180

            );

            cube.castShadow = true;
            cube.receiveShadow = true;

            cube.name = "Wall";

            this.scene.add(cube);

        }

    }

    spawnEnemies(){

        for(let i=0;i<10;i++){

            const enemy = new Enemy(

                this.scene,

                (Math.random()-0.5)*100,

                (Math.random()-0.5)*100

            );

            this.enemies.push(enemy);

        }

    }
        setupEvents() {

        window.addEventListener("mousedown", () => {

            this.weapon.shoot();

        });

        window.addEventListener("keydown", (e) => {

            if (e.code === "KeyR") {

                this.weapon.reload();

            }

        });

    }

    update(delta) {

        this.player.update(delta);

        for (const enemy of this.enemies) {

            enemy.update(

                delta,

                this.player.position

            );

        }

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

            const delta = this.clock.getDelta();

            this.update(delta);

            this.render();

        };

        animate();

    }

}
