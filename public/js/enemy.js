import * as THREE from "https://unpkg.com/three@0.167.1/build/three.module.js";

export default class Enemy {

    constructor(scene, x = 0, z = 0) {

        this.scene = scene;

        this.maxHealth = 100;
        this.health = this.maxHealth;

        this.speed = 2.5;

        this.dead = false;

        this.mesh = new THREE.Group();

        // الجسم
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(1, 2, 1),
            new THREE.MeshStandardMaterial({
                color: 0xcc3333
            })
        );

        body.position.y = 1;

        // الرأس
        const head = new THREE.Mesh(
            new THREE.SphereGeometry(0.35, 16, 16),
            new THREE.MeshStandardMaterial({
                color: 0xffddaa
            })
        );

        head.position.y = 2.35;

        this.mesh.add(body);
        this.mesh.add(head);

        this.mesh.position.set(x, 0, z);

        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        this.mesh.userData.enemy = this;

        scene.add(this.mesh);

    }

    update(delta, playerPosition) {

        if (this.dead)
            return;

        const direction = new THREE.Vector3();

        direction.subVectors(
            playerPosition,
            this.mesh.position
        );

        direction.y = 0;

        const distance = direction.length();

        if (distance > 1.5) {

            direction.normalize();

            this.mesh.position.addScaledVector(
                direction,
                this.speed * delta
            );

            this.mesh.lookAt(
                playerPosition.x,
                this.mesh.position.y,
                playerPosition.z
            );

        }

    }

    takeDamage(amount) {

        if (this.dead)
            return;

        this.health -= amount;

        if (this.health <= 0) {

            this.die();

        }

    }

    die() {

        this.dead = true;

        this.scene.remove(this.mesh);

    }

}
