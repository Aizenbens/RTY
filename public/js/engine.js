import * as THREE from "https://unpkg.com/three@0.167.1/build/three.module.js";

import Player from "./player.js";
import Weapon from "./weapon.js";
import Enemy from "./enemy.js";

export default class Engine {

    constructor() {

        /* ==========================
           Scene
        ========================== */

        this.scene = new THREE.Scene();

        this.scene.background =
            new THREE.Color(0x87CEEB);

        this.scene.fog =
            new THREE.Fog(
                0x87CEEB,
                70,
                220
            );

        /* ==========================
           Camera
        ========================== */

        this.camera =
            new THREE.PerspectiveCamera(

                75,

                window.innerWidth /
                window.innerHeight,

                0.1,

                1000

            );

        this.camera.position.set(
            0,
            2,
            5
        );

        this.scene.add(
            this.camera
        );

        /* ==========================
           Renderer
        ========================== */

        this.renderer =
            new THREE.WebGLRenderer({

                canvas:
                    document.getElementById(
                        "gameCanvas"
                    ),

                antialias:true,

                alpha:false

            });

        this.renderer.setSize(

            window.innerWidth,

            window.innerHeight

        );

        this.renderer.setPixelRatio(

            Math.min(

                window.devicePixelRatio,

                2

            )

        );

        this.renderer.shadowMap.enabled = true;

        this.renderer.shadowMap.type =
            THREE.PCFSoftShadowMap;

        /* ==========================
           Clock
        ========================== */

        this.clock =
            new THREE.Clock();

        /* ==========================
           Game Objects
        ========================== */

        this.player =
            new Player(
                this.camera
            );

        this.weapon =
            new Weapon(

                this.scene,

                this.camera

            );

        /* ==========================
           Arrays
        ========================== */

        this.enemies = [];

        this.walls = [];

        this.pickups = [];

        this.bullets = [];

        /* ==========================
           Settings
        ========================== */

        this.enemyCount = 12;

        this.worldSize = 250;

        this.running = false;    /* ==========================
       LIGHTS
    ========================== */

    createLights() {

        const ambient = new THREE.AmbientLight(
            0xffffff,
            2
        );

        this.scene.add(ambient);

        const sun = new THREE.DirectionalLight(
            0xffffff,
            3
        );

        sun.position.set(50, 80, 40);

        sun.castShadow = true;

        sun.shadow.mapSize.width = 2048;
        sun.shadow.mapSize.height = 2048;

        sun.shadow.camera.left = -100;
        sun.shadow.camera.right = 100;
        sun.shadow.camera.top = 100;
        sun.shadow.camera.bottom = -100;

        this.scene.add(sun);

    }

    /* ==========================
       GROUND
    ========================== */

    createGround() {

        const geometry =
            new THREE.PlaneGeometry(

                this.worldSize,

                this.worldSize,

                50,

                50

            );

        const material =
            new THREE.MeshStandardMaterial({

                color: 0x3BAA3B,

                roughness: 1,

                metalness: 0

            });

        const ground =
            new THREE.Mesh(

                geometry,

                material

            );

        ground.rotation.x = -Math.PI / 2;

        ground.receiveShadow = true;

        ground.name = "Ground";

        this.scene.add(ground);

    }

    /* ==========================
       SKY
    ========================== */

    createSky() {

        const sky = new THREE.Mesh(

            new THREE.SphereGeometry(

                500,

                32,

                32

            ),

            new THREE.MeshBasicMaterial({

                color: 0x87CEEB,

                side: THREE.BackSide

            })

        );

        this.scene.add(sky);

    }
            /* ==========================
       ENVIRONMENT
    ========================== */

    createEnvironment() {

        for (let i = 0; i < 50; i++) {

            const width = 2 + Math.random() * 6;
            const height = 2 + Math.random() * 10;
            const depth = 2 + Math.random() * 6;

            const box = new THREE.Mesh(

                new THREE.BoxGeometry(
                    width,
                    height,
                    depth
                ),

                new THREE.MeshStandardMaterial({

                    color: Math.random() * 0xffffff

                })

            );

            box.position.set(

                (Math.random() - 0.5) * this.worldSize,

                height / 2,

                (Math.random() - 0.5) * this.worldSize

            );

            box.castShadow = true;

            box.receiveShadow = true;

            box.name = "Wall";

            this.walls.push(box);

            this.scene.add(box);

        }

    }

    /* ==========================
       ENEMIES
    ========================== */

    spawnEnemies() {

        for (let i = 0; i < this.enemyCount; i++) {

            const enemy = new Enemy(

                this.scene,

                (Math.random() - 0.5) * this.worldSize,

                (Math.random() - 0.5) * this.worldSize

            );

            this.enemies.push(enemy);

        }

    }

    /* ==========================
       EVENTS
    ========================== */

    setupEvents() {

        window.addEventListener(

            "mousedown",

            () => {

                this.weapon.shoot();

            }

        );

        window.addEventListener(

            "keydown",

            (event) => {

                if (event.code === "KeyR") {

                    this.weapon.reload();

                }

            }

        );

    }
            /* ==========================
       UPDATE
    ========================== */

    update(delta) {

        /* Player */

        this.player.update(delta);

        /* Weapon */

        if (this.weapon.update) {

            this.weapon.update(delta);

        }

        /* Enemies */

        for (let i = this.enemies.length - 1; i >= 0; i--) {

            const enemy = this.enemies[i];

            if (enemy.dead) {

                this.enemies.splice(i, 1);

                continue;

            }

            enemy.update(

                delta,

                this.player.position

            );

        }

        /* Respawn enemies */

        while (this.enemies.length < this.enemyCount) {

            const enemy = new Enemy(

                this.scene,

                (Math.random() - 0.5) * this.worldSize,

                (Math.random() - 0.5) * this.worldSize

            );

            this.enemies.push(enemy);

        }

    }

    /* ==========================
       RENDER
    ========================== */

    render() {

        this.renderer.render(

            this.scene,

            this.camera

        );

    }
