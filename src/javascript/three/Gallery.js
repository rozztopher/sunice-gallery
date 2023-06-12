import * as THREE from "three"
import { environment, loaders, scene } from "./Experience"

const texturePath = "/assets/Baked.jpg"
const galleryPath = "/assets/Gallery3.gltf"

export class Gallery {
  constructor() {
    this.setGallery()
  }

  setGallery() {
    // this.galleryTexture = loaders.textureLoader.load(texturePath)
    // this.galleryTexture.flipY = false
    // this.galleryTexture.encoding = THREE.sRGBEncoding
    // this.galleryMaterial = new THREE.MeshBasicMaterial({
    //   map: this.galleryTexture,
    // })

    // loaders.gltfLoader.load(galleryPath, (gltf) => {
    //   this.gallery = gltf.scene

    //   this.gallery.traverse((child) => {
    //     if (child.name === "BaseMesh") {
    //       child.material = this.galleryMaterial
    //     }
    //   })

    //   scene.add(this.gallery)
    // })

    const textures = window.innerWidth > 768 
    ? ["/assets/MarbleBake-2k.jpg", "/assets/Wood1Bake-4k.jpg", "/assets/Wood2Bake-2k.jpg"]
    : ["/assets/MarbleBake-1k.jpg", "/assets/Wood1Bake-1k.jpg", "/assets/Wood2Bake-1k.jpg"]

    //Loading all the textures
    this.marbleTexture = loaders.textureLoader.load(textures[0])
    this.marbleTexture.flipY = false
    this.marbleTexture.encoding = THREE.sRGBEncoding
    this.marbleMaterial = new THREE.MeshStandardMaterial({
      map: this.marbleTexture,
    })

    this.wood1Texture = loaders.textureLoader.load(textures[1])
    this.wood1Texture.flipY = false
    this.wood1Texture.encoding = THREE.sRGBEncoding
    this.wood1Material = new THREE.MeshStandardMaterial({
      map: this.wood1Texture,
    })

    this.wood2Texture = loaders.textureLoader.load(textures[2])
    this.wood2Texture.flipY = false
    this.wood2Texture.encoding = THREE.sRGBEncoding
    this.wood2Material = new THREE.MeshStandardMaterial({
      map: this.wood2Texture,
    })

    loaders.gltfLoader.load("/assets/Gallery10.gltf", (gltf) => {
      this.gallery = gltf.scene

      this.gallery.traverse((child) => {
        if (child.name === "Marble") child.material = this.marbleMaterial
        if (child.name === "Wood1" || child.name === "Frames")
          child.material = this.wood1Material
        if (child.name === "Wood2") child.material = this.wood2Material
      })

      // this.floor = this.gallery.getObjectByName("Wood1")
      // this.floor.visible = false

      this.glass = this.gallery.getObjectByName("Glass")
      this.glass.material.envMap = environment.envMap
      this.glass.material.envMapIntensity = 500
      this.glass.material.transparent = true
      this.glass.material.opacity = 0.08

      this.navMesh = this.gallery.getObjectByName("NavMesh")

      scene.add(this.gallery)
    })
  }
}
