import * as THREE from "three"
import { Reflector } from "three/examples/jsm/objects/Reflector.js"
import { scene, sizes } from "./Experience"

export class Mirror {
  constructor() {
    this.setMirror()
  }

  setMirror() {
    this.mirror = new Reflector(new THREE.PlaneGeometry(5, 5), {
      clipBias: 0.003,
      textureWidth: sizes.width * window.devicePixelRatio,
      textureHeight: sizes.height * window.devicePixelRatio,
      color: 0x777777,
    })
    this.mirror.rotation.y = -Math.PI / 2
    this.mirror.position.x = 2
    scene.add(this.mirror)
  }
}
