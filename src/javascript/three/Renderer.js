import * as THREE from "three"
import { VRButton } from "three/examples/jsm/webxr/VRButton"
import { canvas, sizes } from "./Experience"

export class Renderer {
  constructor() {
    this.renderer

    this.setRenderer()
  }

  setRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    })
    this.renderer.setSize(sizes.width, sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setClearColor(0xffffff)
    this.renderer.outputEncoding = THREE.sRGBEncoding
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping

    this.vrButton = document.body.appendChild(VRButton.createButton(this.renderer))
    this.renderer.xr.enabled = true
  }
}
