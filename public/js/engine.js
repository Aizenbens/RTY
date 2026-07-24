import * as THREE from "https://unpkg.com/three@0.167.1/build/three.module.js";

import Player from "./player.js";
import Weapon from "./weapon.js";

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

        this.createLights();

        this.createGround();

        this.createObjects();

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

        const ambient = new THREE.AmbientLight(
            0xffffff,
            2
        );

        this.scene.add(ambient);

        const sun =
            new THREE.DirectionalLight(
                0xffffff,
                3
            );

        sun.position.set(25,40,15);

        sun.castShadow = true;

        this.scene.add(sun);

    }

    createGround(){

        const ground =
            new THREE.Mesh(

                new THREE.PlaneGeometry(
                    500,
                    500
                ),

                new THREE.MeshStandardMaterial({

                    color:0x2f9e44

                })

            );

        ground.rotation.x =
            -Math.PI/2;

        ground.receiveShadow = true;

        ground.name = "Ground";

        this.scene.add(ground);

    }

    createObjects(){

        for(let i=0;i<20;i++){

            const cube =
                new THREE.Mesh(

                    new THREE.BoxGeometry(2,2,2),

                    new THREE.MeshStandardMaterial({

                        color:
                        Math.random()*0xffffff

                    })

                );

            cube.position.set(

                (Math.random()-0.5)*80,

                1,

                (Math.random()-0.5)*80

            );

            cube.castShadow = true;

            cube.receiveShadow = true;

            cube.name = "Box";

            this.scene.add(cube);

        }

    }

    setupEvents(){

        window.addEventListener(

            "mousedown",

            ()=>{

                this.weapon.shoot();

            }

        );

        window.addEventListener(

            "keydown",

            (e)=>{

                if(e.code==="KeyR")

                    this.weapon.reload();

            }

        );

    }

    update(delta){

        this.player.update(delta);

    }

    render(){

        this.renderer.render(

            this.scene,

            this.camera

        );

    }

    start(){

        const loop=()=>{

            requestAnimationFrame(loop);

            const delta =
                this.clock.getDelta();

            this.update(delta);

            this.render();

        };

        loop();

    }

}
