import * as THREE from "https://unpkg.com/three@0.167.1/build/three.module.js";

export default class Player {

    constructor(camera) {

        this.camera = camera;

        this.position = new THREE.Vector3(0, 2, 5);

        this.velocity = new THREE.Vector3();

        this.direction = new THREE.Vector3();

        this.speed = 8;

        this.jumpForce = 8;

        this.gravity = 20;

        this.canJump = true;

        this.keys = {};

        this.pitch = 0;

        this.yaw = 0;

        this.mouseSensitivity = 0.002;

        this.setupKeyboard();

        this.setupMouse();

    }

    setupKeyboard() {

        window.addEventListener("keydown", (e) => {

            this.keys[e.code] = true;

        });

        window.addEventListener("keyup", (e) => {

            this.keys[e.code] = false;

        });

    }

    setupMouse() {

        document.addEventListener("click", () => {

            document.body.requestPointerLock();

        });

        document.addEventListener("mousemove", (e) => {

            if (document.pointerLockElement !== document.body)
                return;

            this.yaw -= e.movementX * this.mouseSensitivity;

            this.pitch -= e.movementY * this.mouseSensitivity;

            const limit = Math.PI / 2 - 0.05;

            this.pitch = Math.max(-limit, Math.min(limit, this.pitch));

        });

    }

    update(delta) {

        this.direction.set(0, 0, 0);

        if (this.keys["KeyW"])
            this.direction.z -= 1;

        if (this.keys["KeyS"])
            this.direction.z += 1;

        if (this.keys["KeyA"])
            this.direction.x -= 1;

        if (this.keys["KeyD"])
            this.direction.x += 1;

        this.direction.normalize();

        const forward = new THREE.Vector3(
            Math.sin(this.yaw),
            0,
            Math.cos(this.yaw)
        );

        const right = new THREE.Vector3(
            forward.z,
            0,
            -forward.x
        );

        this.position.addScaledVector(
            forward,
            -this.direction.z * this.speed * delta
        );

        this.position.addScaledVector(
            right,
            this.direction.x * this.speed * delta
        );

        if (this.keys["Space"] && this.canJump) {

            this.velocity.y = this.jumpForce;

            this.canJump = false;

        }

        this.velocity.y -= this.gravity * delta;

        this.position.y += this.velocity.y * delta;

        if (this.position.y < 2) {

            this.position.y = 2;

            this.velocity.y = 0;

            this.canJump = true;

        }

        this.camera.position.copy(this.position);

        this.camera.rotation.order = "YXZ";

        this.camera.rotation.y = this.yaw;

        this.camera.rotation.x = this.pitch;

    }

}
