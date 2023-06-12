import * as THREE from "three"
import { loaders, scene } from "./Experience"

import vertexShaderPath from "../../shaders/vertex.glsl"
import fragmentShaderPath from "../../shaders/fragment.glsl"

export class Shader {
  constructor() {
    //Load texture
    this.texture = loaders.textureLoader.load("/assets/Icon.png")
    this.setShader()
  }

  setShader() {
    this.shader = new THREE.Mesh(
      new THREE.SphereGeometry(25, 50, 50),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        vertexShader: vertexShaderPath,
        fragmentShader: fragmentShaderPath,

        uniforms: {
          uTime: { value: 0 },
          uTexture: { value: this.texture },
        },
      })
    )
    this.shader.rotation.y = Math.PI
    this.shader.position.z = -10
    scene.add(this.shader)
  }
}
