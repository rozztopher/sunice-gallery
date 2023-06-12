import * as THREE from "three"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"
import {
  camera,
  postProcessingFolder,
  renderer,
  scene,
  sizes,
} from "./Experience"

export class PostProcessing {
  constructor() {
    this.setPostProcessing()
    // this.setPostProcessingTweaks()
  }

  setPostProcessing() {
    this.effectComposer = new EffectComposer(renderer.renderer)
    this.effectComposer.setSize(sizes.width, sizes.height)
    this.effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    this.renderPass = new RenderPass(scene, camera.camera)
    this.effectComposer.addPass(this.renderPass)

    // this.unrealBloomPass = new UnrealBloomPass()
    // this.unrealBloomPass.strength = 0.1
    // this.unrealBloomPass.radius = 1
    // this.unrealBloomPass.threshold = 0
    // this.effectComposer.addPass(this.unrealBloomPass)
  }

  setPostProcessingTweaks() {
    postProcessingFolder.addInput(this.unrealBloomPass, "strength", {
      min: 0,
      max: 2,
      step: 0.01,
      label: "Bloom Strength",
    })
    postProcessingFolder.addInput(this.unrealBloomPass, "radius", {
      min: 0,
      max: 5,
      step: 0.01,
      label: "Bloom Radius",
    })
    postProcessingFolder.addInput(this.unrealBloomPass, "threshold", {
      min: 0,
      max: 1,
      step: 0.01,
      label: "Bloom Threshold",
    })
  }
}
