import { camera, postProcessing, renderer, sizes } from "./Experience"

export class Sizes {
  constructor() {
    this.width = window.innerWidth
    this.height = window.innerHeight

    this.resizeWindow()
  }

  resizeWindow() {
    window.addEventListener("resize", () => {
      // Update sizes
      this.width = window.innerWidth
      this.height = window.innerHeight

      // Update camera
      camera.camera.aspect = this.width / this.height
      camera.camera.updateProjectionMatrix()

      // Update renderer
      renderer.renderer.setSize(this.width, this.height)
      renderer.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

      // Update EffectComposer
      postProcessing.effectComposer.setSize(sizes.width, sizes.height)
    })
  }
}
