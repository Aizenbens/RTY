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

        this.createWeaponModel();

        this.createMuzzleFlash();

        this.updateHUD();

    }

    createWeaponModel() {

        this.weapon = new THREE.Group();

        const body = new THREE.Mesh(

            new THREE.BoxGeometry(
                0.18,
                0.18,
                0.9
            ),

            new THREE.MeshStandardMaterial({

                color: 0x333333,

                metalness: 0.8,

                roughness: 0.3

            })

        );

        body.position.z = -0.45;

        this.weapon.add(body);

        const barrel = new THREE.Mesh(

            new THREE.CylinderGeometry(
                0.03,
                0.03,
                0.55,
                16
            ),

            new THREE.MeshStandardMaterial({

                color: 0x111111

            })

        );

        barrel.rotation.x = Math.PI / 2;

        barrel.position.set(
            0,
            0,
            -0.95
        );

        this.weapon.add(barrel);

        const handle = new THREE.Mesh(

            new THREE.BoxGeometry(
                0.12,
                0.35,
                0.12
            ),

            new THREE.MeshStandardMaterial({

                color: 0x222222

            })

        );

        handle.position.set(
            0,
            -0.22,
            -0.2
        );

        handle.rotation.z = 0.35;

        this.weapon.add(handle);

        this.camera.add(this.weapon);

        this.weapon.position.set(

            0.35,

            -0.30,

            -0.60

        );

    }

    createMuzzleFlash() {

        const geometry =
            new THREE.SphereGeometry(
                0.08,
                12,
                12
            );

        const material =
            new THREE.MeshBasicMaterial({

                color: 0xffdd55

            });

        this.flash =
            new THREE.Mesh(
                geometry,
                material
            );

        this.flash.visible = false;

        this.weapon.add(this.flash);

        this.flash.position.set(
            0,
            0,
            -1.25
        );

    }    shoot() {

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

        this.weapon.position.z = -0.65;

        setTimeout(() => {

            this.flash.visible = false;

            this.weapon.position.z = -0.60;

        },40);

        this.raycaster.setFromCamera(

            new THREE.Vector2(0,0),

            this.camera

        );

        const hit = this.raycaster.intersectObjects(

            this.scene.children,

            true

        );

        if(hit.length){

            let object = hit[0].object;

            while(object){

                if(object.userData.enemy){

                    object.userData.enemy.takeDamage(

                        this.damage

                    );

                    break;

                }

                object = object.parent;

            }

        }

    }

    reload(){

        if(this.reloading)
            return;

        this.reloading = true;

        console.log("Reloading...");

        setTimeout(()=>{

            this.ammo = this.maxAmmo;

            this.reloading = false;

            this.updateHUD();

        },this.reloadTime);

    }

    updateHUD(){

        const ammo = document.getElementById("ammo");

        if(ammo){

            ammo.textContent = this.ammo;

        }

    }

    update(delta){

        this.weapon.position.x +=

            (0.35 - this.weapon.position.x)

            * 8 * delta;

        this.weapon.position.y +=

            (-0.30 - this.weapon.position.y)

            * 8 * delta;

    }

}
