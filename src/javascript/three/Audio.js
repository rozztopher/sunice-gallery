import * as THREE from "three"
import { camera, loaders, raycaster, scene, gallery } from "./Experience"

export class Audio {
  constructor() {
    this.audios = []
  }

  setAudio() {
    const audioMap = {
      "Auf1": "/assets/Auf(1).m4a",
      "Auf2": "/assets/Auf(2).m4a",
      "Auf3": "/assets/Auf(3).m4a",
      "Auf4": "/assets/Auf(4).m4a",
      "Auf5": "/assets/Auf(5).m4a",
      "BA": "/assets/zu_Breitenacker-1.mp3",
      "BM": "/assets/zu_BreiteMatten-2.mp3",
      "IW": "/assets/zu_ImWinkel-3.mp3",
      "SF": "/assets/zu_Sonnenfiechten-4.mp3",
      "SM": "/assets/zu_Steinmatten-5.mp3",
    }
    gallery.gallery.children.forEach(item => {
      if (Object.keys(audioMap).includes(item.name)) {
        const clip = audioMap[item.name]
        const sound = this.createSound(clip, 5, 1000)
        item.add(sound)
        this.audios.push(sound)
        raycaster.group.add(item)
      }
    })
  }

  createSound(audio, volume, refDistance) {
    const audioListener = new THREE.AudioListener()
    camera.camera.add(audioListener)
    const sound = new THREE.PositionalAudio(audioListener)
    loaders.audioLoader.load(audio, (buffer) => {
      sound.setBuffer(buffer)
      sound.setVolume(volume)
      sound.setRefDistance(refDistance)
    })
    return sound
  }

  stopAudios() {
    this.audios.forEach(audio => {
      audio.pause()
    })
  }
}
