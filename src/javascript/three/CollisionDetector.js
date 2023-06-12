import * as THREE from "three"
import {
  scene,
  environment,
  camera,
  player,
  gallery,
  navMeshFolder,
} from "./Experience"

export class CollisionDetector {
  constructor() {
    this.raycaster = new THREE.Raycaster()
    this.currentIntersect = null
    this.movementBlocked = false
    this.detectionMeshes = []
    this.setCollisionDetector()
  }

  setCollisionDetector() {
    // this.detectionMeshGeometry = new THREE.PlaneGeometry(10, 10, 1, 1)
    // this.detectionMeshMaterial = new THREE.MeshBasicMaterial({
    //   color: 0xff0000,
    //   wireframe: true,
    // })
    // for (let i = 0; i < 3; i++) {
    //   this.detectionMesh = new THREE.Mesh(
    //     this.detectionMeshGeometry,
    //     this.detectionMeshMaterial
    //   )
    //   this.detectionMesh.rotation.x = -Math.PI / 2
    //   this.detectionMeshes.push(this.detectionMesh)
    //   scene.add(this.detectionMeshes[i])
    // }
    // this.detectionMeshes[0].position.set(0, 0, -13)
    // this.detectionMeshes[0].scale.set(0.62, 0.7)
    // this.detectionMeshes[1].position.set(0, 0, -7.6)
    // this.detectionMeshes[1].scale.set(1.25, 0.5)
    // this.detectionMeshes[2].position.set(0, 0, -2.25)
    // this.detectionMeshes[2].scale.set(1.5, 0.75)
  }

  updateRaycaster() {
    //Raycaster pointing down
    this.raycaster.ray.set(camera.camera.position, new THREE.Vector3(0, -1, 0))

    // const intersects = this.raycaster.intersectObjects(this.detectionMeshes)
    const intersects = this.raycaster.intersectObject(gallery.navMesh)

    if (intersects.length) {
      if (!this.currentIntersect) {
        //Player on detectionMesh
        this.movementBlocked = false
      }

      this.currentIntersect = intersects[0]
    } else {
      if (this.currentIntersect) {
        //Player off detectionMesh
        this.movementBlocked = true
      }

      this.currentIntersect = null
    }
  }
}
