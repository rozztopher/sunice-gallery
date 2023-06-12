import * as THREE from "three"
import { loaders, scene, camera, raycaster } from "./Experience"

export class Video {
  constructor() {
    this.video = null
    this.playing = false
    this.sound = null
    this.setVideo()
  }

  setVideo() {
    const video = document.getElementById('video');

    video.addEventListener('ended', () => {
        video.currentTime = 0
        this.playing = false
    }, false)

    //Create your video texture:
    const videoTexture = new THREE.VideoTexture(video);
    const videoMaterial =  new THREE.MeshBasicMaterial( {map: videoTexture, side: THREE.DoubleSide, toneMapped: false} );
    //Create screen
    const screen = new THREE.PlaneGeometry(3.7, 2.125);
    const videoScreen = new THREE.Mesh(screen, videoMaterial);
    scene.add(videoScreen);

    videoScreen.position.x = 0
    videoScreen.position.y = 2.3
    videoScreen.position.z = 0.66
    videoScreen.rotation.y = Math.PI
    videoScreen.name = 'naoo-video'

    this.video = videoScreen

    this.audioListener = new THREE.AudioListener()
    camera.camera.add(this.audioListener)

    this.sound = new THREE.PositionalAudio(this.audioListener)
    loaders.audioLoader.load("/assets/NAOO.mp3", (buffer) => {
      this.sound.setBuffer(buffer)
      this.sound.setVolume(2)
      this.sound.setRefDistance(1000)
    })

    videoScreen.add(this.sound)
    raycaster.group.add(this.video)

    video.load()
    video.currentTime = 0
  }
}
