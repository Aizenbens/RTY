import * as THREE from "https://unpkg.com/three@0.167.1/build/three.module.js";

export default class Weapon {

    constructor(scene, camera) {

        this.scene = scene;
        this.camera = camera;

        this.damage = 25;

        this.fireRate = 120;

        this.lastShot = 0;

        this.maxAmmo = 30;

        this.ammo = this.maxAmmo;

        this.reloadTime = 2000;

        this.reloading = false;

        this.flash = null;

        this.raycaster = new THREE.Raycaster();

        this.createMuzzleFlash();

    }

    createMuzzleFlash() {

        const geometry =
            new THREE.SphereGeometry(0.08, 12, 12);

        const material =
            new THREE.MeshBasicMaterial({

                color: 0xffcc44

            });

        this.flash =
            new THREE.Mesh(
                geometry,
                material
            );

        this.flash.visible = false;

        this.camera.add(this.flash);

        this.flash.position.set(
            0.35,
            -0.15,
            -0.8
        );

    }

    shoot() {

        if (this.reloading)
            return;

        if (this.ammo <= 0) {

            this.reload();

            return;

        }

        const now = performance.now();

        if (now - this.lastShot < this.fireRate)
            return;

        this.lastShot = now;

        this.ammo--;

        this.updateHUD();

        this.flash.visible = true;

        setTimeout(() => {

            this.flash.visible = false;

        },40);

        this.raycaster.setFromCamera(
            new THREE.Vector2(0,0),
            this.camera
        );

        const objects =
            this.scene.children;

        const hit =
            this.raycaster.intersectObjects(
                objects,
                true
            );

        if(hit.length){

            console.log(
                "Hit:",
                hit[0].object.name
            );

        }

    }

    reload(){

        if(this.reloading)
            return;

        this.reloading = true;

        console.log("Reloading...");

        setTimeout(()=>{

            this.ammo =
                this.maxAmmo;

            this.reloading = false;

            this.updateHUD();

        },this.reloadTime);

    }

    updateHUD(){

        const ammo =
            document.getElementById("ammo");

        if(ammo){

            ammo.textContent =
                this.ammo;

        }

    }

}
