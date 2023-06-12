import * as THREE from "three"
import { loaders } from "./Experience"

export class Environment {
  constructor() {
    this.setEnvironment()
  }

  setEnvironment() {
    this.envMap = loaders.cubeTextureLoader.load([
      "/assets/2/px.png",
      "/assets/2/nx.png",
      "/assets/2/py.png",
      "/assets/2/ny.png",
      "/assets/2/pz.png",
      "/assets/2/nz.png",
    ])
    this.envMap.encoding = THREE.sRGBEncoding
  }
}
