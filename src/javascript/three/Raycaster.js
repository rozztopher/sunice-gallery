import * as THREE from "three"
import { camera, player, scene } from "./Experience"

export class Raycaster {
  constructor() {
    // this.currentIntersect = null
    this.firstPersonOptions = {
      raycaster: new THREE.Raycaster(),
      currentIntersect: null,
    }

    this.leftControllerOptions = {
      raycaster: new THREE.Raycaster(),
      tempMatrix: new THREE.Matrix4(),
      currentIntersect: null,
    }

    this.rightControllerOptions = {
      raycaster: new THREE.Raycaster(),
      tempMatrix: new THREE.Matrix4(),
      currentIntersect: null,
    }
    this.raycaster = new THREE.Raycaster()
    this.tempMatrix = new THREE.Matrix4()
    this.currentIntersect = null

    this.setObjectsToTest()
  }

  setObjectsToTest() {
    this.group = new THREE.Group()
    scene.add(this.group)

    this.object = new THREE.Mesh(
      new THREE.SphereGeometry(1, 20, 20),
      new THREE.MeshBasicMaterial({ color: "" })
    )
    this.object.name = "OBJECT"
    this.object.position.set(0, 0.5, -5)
    this.object.visible = false
    this.group.add(this.object)
  }

  getFirstPersonIntersections() {
    //Cast a ray from the center of the canvas
    this.firstPersonOptions.raycaster.setFromCamera(
      new THREE.Vector2(0, 0),
      camera.camera
    )

    const intersects = this.firstPersonOptions.raycaster.intersectObjects(
      this.group.children
    )

    if (intersects.length) {
      if (!this.firstPersonOptions.currentIntersect) {
      }

      this.firstPersonOptions.currentIntersect = intersects[0]
    } else {
      if (this.firstPersonOptions.currentIntersect) {
      }

      this.firstPersonOptions.currentIntersect = null
    }
  }

  getLeftControllerIntersections(controller1) {
    this.leftControllerOptions.tempMatrix
      .identity()
      .extractRotation(controller1.matrixWorld)
    this.leftControllerOptions.raycaster.ray.origin.setFromMatrixPosition(
      controller1.matrixWorld
    )
    this.leftControllerOptions.raycaster.ray.direction
      .set(0, 0, -1)
      .applyMatrix4(this.leftControllerOptions.tempMatrix)
    const intersects = this.leftControllerOptions.raycaster.intersectObjects(
      this.group.children,
      false
    )

    if (intersects.length) {
      if (!this.leftControllerOptions.currentIntersect) {
      }
      this.leftControllerOptions.currentIntersect = intersects[0]
    } else {
      if (this.leftControllerOptions.currentIntersect) {
      }
      this.leftControllerOptions.currentIntersect = null
    }
  }

  getRightControllerIntersections(controller2) {
    this.rightControllerOptions.tempMatrix
      .identity()
      .extractRotation(controller2.matrixWorld)
    this.rightControllerOptions.raycaster.ray.origin.setFromMatrixPosition(
      controller2.matrixWorld
    )
    this.rightControllerOptions.raycaster.ray.direction
      .set(0, 0, -1)
      .applyMatrix4(this.rightControllerOptions.tempMatrix)
    const intersects = this.rightControllerOptions.raycaster.intersectObjects(
      this.group.children,
      false
    )

    if (intersects.length) {
      if (!this.rightControllerOptions.currentIntersect) {
      }
      this.rightControllerOptions.currentIntersect = intersects[0]
    } else {
      if (this.rightControllerOptions.currentIntersect) {
      }
      this.rightControllerOptions.currentIntersect = null
    }
  }
}
