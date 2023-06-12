import * as THREE from "three"
import nipplejs from "nipplejs"
import { camera, finiteStateMachine, player, sizes } from "./Experience"

function clamp(x, a, b) {
  return Math.min(Math.max(x, a), b)
}

export class MobileControls {
  constructor(camera) {
    this.camera = camera
    this.moveForward = false
    this.moveBackward = false
    this.moveLeft = false
    this.moveRight = false
    this.prevFingerX = 0
    this.prevFingerY = 0

    this.rotation = new THREE.Quaternion()
    this.translation = new THREE.Vector3()
    this.phi = 0
    this.theta = 0

    this.setMobileControls()
  }

  setMobileControls() {
    const joystickOptions = {
      zone: document.querySelector(".zone-joystick"),
      color: "white",
    }

    const joystickManager = nipplejs.create(joystickOptions)

    joystickManager.on("move", (evData, joystickData) => {
      // console.log(joystickData.vector)
      let deadzone = 0.2

      joystickData.vector.y > deadzone
        ? (this.moveForward = true)
        : (this.moveForward = false)
      joystickData.vector.y < -deadzone
        ? (this.moveBackward = true)
        : (this.moveBackward = false)

      joystickData.vector.x < -deadzone
        ? (this.moveLeft = true)
        : (this.moveLeft = false)
      joystickData.vector.x > deadzone
        ? (this.moveRight = true)
        : (this.moveRight = false)
    })

    document.addEventListener("touchmove", (ev) => {
      if (ev.touches.length === 1) {
        this.fingerX = ev.touches[0].clientX
        this.fingerY = ev.touches[0].clientY
      } else {
        this.fingerX = ev.touches[1].clientX
        this.fingerY = ev.touches[1].clientY
      }

      this.normFingerX = this.fingerX - sizes.width / 2
      this.normFingerY = this.fingerY - sizes.height / 2

      if (this.fingerX < sizes.width / 2 && this.fingerY > sizes.height / 2) {
      } else {
        this.fingerXDelta = this.normFingerX - this.prevFingerX
        this.fingerYDelta = this.normFingerY - this.prevFingerY

        this.updateRotation()

        this.prevFingerX = this.normFingerX
        this.prevFingerY = this.normFingerY
      }
    })

    document.addEventListener("touchend", (ev) => {
      this.moveForward = false
      this.moveBackward = false
      this.moveLeft = false
      this.moveRight = false
    })
  }
  updateRotation() {
    const xh = this.fingerXDelta / sizes.width
    const yh = this.fingerYDelta / sizes.height

    this.phi += -xh * 14
    this.theta = clamp(this.theta + -yh * 5, -Math.PI / 3, Math.PI / 3)

    const qx = new THREE.Quaternion()
    qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi)

    const qz = new THREE.Quaternion()
    qz.setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.theta)

    const q = new THREE.Quaternion()
    q.multiply(qx)
    q.multiply(qz)

    this.rotation.copy(q)

    this.camera.quaternion.copy(this.rotation)
  }

  updatePosition() {
    const mobileSpeed = 0.02
    this.moveForward && camera.camera.translateZ(-mobileSpeed)
    this.moveBackward && camera.camera.translateZ(mobileSpeed)

    this.moveLeft && camera.camera.translateX(-mobileSpeed)
    this.moveRight && camera.camera.translateX(mobileSpeed)

    camera.camera.position.y = 1.7
  }

  updateFiniteStateMachine() {
    // console.log(this.moveForward)
  }
}
