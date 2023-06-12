import * as THREE from "three"
import { fsmFolder, pane, player, scene } from "./Experience"

export class FiniteStateMachine {
  constructor() {
    this.setFiniteStateMachineTweaks()
  }

  setFiniteStateMachine(characterParent) {
    this.character = characterParent.scene

    //SkeletonHelper
    const skeleton = new THREE.SkeletonHelper(this.character)
    skeleton.visible = false
    scene.add(skeleton)

    this.characterAnimations = characterParent.animations
    // console.log(this.characterAnimations)

    this.mixer = new THREE.AnimationMixer(this.character)

    //IDLE
    this.idleAnimation = this.mixer.clipAction(this.characterAnimations[0])
    //STRAFE LEFT
    this.strafeLeftAnimation = this.mixer.clipAction(
      this.characterAnimations[1]
    )
    //STRAFE RIGHT
    this.strafeRightAnimation = this.mixer.clipAction(
      this.characterAnimations[2]
    )
    //WALK FORWARD
    this.walkForwardAnimation = this.mixer.clipAction(
      this.characterAnimations[3]
    )
    //WALK BACKWARD
    this.walkBackwardAnimation = this.mixer.clipAction(
      this.characterAnimations[4]
    )
    //Speed up the backward animation a bit
    this.walkBackwardAnimation.timeScale = 2

    this.idleAnimation.play()
  }

  changeAnimation(startAnimation, endAnimation, duration) {
    startAnimation.crossFadeTo(endAnimation, duration)
    endAnimation.play()

    setTimeout(() => {
      startAnimation.stop()
    }, duration * 1000 + 50)
  }

  setFiniteStateMachineTweaks() {
    this.btn1 = fsmFolder.addButton({
      label: "Idle to Walk",
      title: "Play",
    })
    this.btn2 = fsmFolder.addButton({
      label: "Walk to idle",
      title: "Play",
    })

    this.btn1.on("click", () => {
      this.changeAnimation(this.idleAnimation, this.walkForwardAnimation, 0.2)
    })
    this.btn2.on("click", () => {
      this.changeAnimation(this.walkForwardAnimation, this.idleAnimation, 0.2)
    })
  }
}
