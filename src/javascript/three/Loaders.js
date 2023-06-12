import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { finiteStateMachine, mobileControls, player, audio } from "./Experience"
import gsap from "gsap"

export class Loaders {
  constructor() {
    this.setLoaders()
  }

  setLoaders() {
    this.loadingManager = new THREE.LoadingManager(() => {
      //Put everything here what you want to load asynsc
      player.setPlayer()
      finiteStateMachine.setFiniteStateMachine(player.characterParent)
      audio.setAudio()
    })

    this.loadingManager.onProgress = (url, loaded, total) => {
      gsap.timeline().to('.progress', {duration: 1, width: (loaded/43*100) + "%"})
      if (loaded === 43) {
        gsap.timeline().set('.border-button', {pointerEvents: 'all'})
      }
    }

    //Textures
    this.textureLoader = new THREE.TextureLoader(this.loadingManager)

    //Models
    this.gltfLoader = new GLTFLoader(this.loadingManager)

    //Env Maps
    this.cubeTextureLoader = new THREE.CubeTextureLoader(this.loadingManager)

    //Audio
    this.audioLoader = new THREE.AudioLoader(this.loadingManager)
  }
}
