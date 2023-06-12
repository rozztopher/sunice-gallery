import * as THREE from "three"
import { XRControllerModelFactory } from "three/examples/jsm/webxr/XRControllerModelFactory"
import {
  camera,
  collisionDetector,
  environment,
  finiteStateMachine,
  loaders,
  raycaster,
  renderer,
  scene,
  video,
  audio
} from "./Experience"

// const handsModelPath = "/assets/Hands.gltf"

export class Player {
  constructor() {
    this.currentIntersect = null
    this.frameCounter = 0
    this.prevPositionX = null
    this.prevPositionZ = null

    this.cameraDirection = new THREE.Vector3()

    this.moveForward = false
    this.moveBackward = false
    this.moveLeft = false
    this.moveRight = false
    this.isRunning = false

    this.velocity = new THREE.Vector3()
    this.direction = new THREE.Vector3()
    this.cameraWorldDirection = new THREE.Vector3()

    this.frameNames = [
      "Auf1", "Auf2", "Auf3", "Auf4", "Auf5", "BA", "BM", "IW", "SF", "SM"
    ]

    this.loadPlayer()
    this.setPlayer()
    this.setPlayerHands()
    this.checkIntersections()
  }

  loadPlayer() {
    loaders.gltfLoader.load("/assets/Character-Animated-4.gltf", (gltf) => {
      this.characterParent = gltf
      this.character = gltf.scene

      this.character.traverse((child) => {
        if (
          child instanceof THREE.Mesh &&
          child.material instanceof THREE.MeshStandardMaterial
        ) {
          child.material.envMap = environment.envMap
          child.material.envMapIntensity = 2.5
        }
        // Avoids the mesh from dissapearing
        // child.frustumCulled = false
      })

      // this.character.position.z = -2
      this.character.visible = false
      scene.add(this.character)
    })
  }

  setPlayer() {
    // Keydown
    document.addEventListener("keydown", (ev) => {
      // Make sure the keydown event only gets triggered once for the FiniteStateMachine
      if (!ev.repeat) {
        switch (ev.code) {
          case "ArrowUp":
          case "KeyW":
            this.moveForward = true
            finiteStateMachine.changeAnimation(
              finiteStateMachine.idleAnimation,
              finiteStateMachine.walkForwardAnimation,
              0.2
            )
            break

          case "ArrowLeft":
          case "KeyA":
            this.moveLeft = true
            finiteStateMachine.changeAnimation(
              finiteStateMachine.idleAnimation,
              finiteStateMachine.strafeLeftAnimation,
              0.1
            )
            break

          case "ArrowDown":
          case "KeyS":
            this.moveBackward = true
            finiteStateMachine.changeAnimation(
              finiteStateMachine.idleAnimation,
              finiteStateMachine.walkBackwardAnimation,
              0.2
            )
            break

          case "ArrowRight":
          case "KeyD":
            this.moveRight = true
            finiteStateMachine.changeAnimation(
              finiteStateMachine.idleAnimation,
              finiteStateMachine.strafeRightAnimation,
              0.1
            )
            break

          case "ShiftLeft":
            this.isRunning = true
            break
        }
      }
    })

    // Keyup
    document.addEventListener("keyup", (ev) => {
      switch (ev.code) {
        case "ArrowUp":
        case "KeyW":
          this.moveForward = false
          finiteStateMachine.changeAnimation(
            finiteStateMachine.walkForwardAnimation,
            finiteStateMachine.idleAnimation,
            0.1
          )
          break

        case "ArrowLeft":
        case "KeyA":
          this.moveLeft = false
          finiteStateMachine.changeAnimation(
            finiteStateMachine.strafeLeftAnimation,
            finiteStateMachine.idleAnimation,
            0.2
          )
          break

        case "ArrowDown":
        case "KeyS":
          this.moveBackward = false
          finiteStateMachine.changeAnimation(
            finiteStateMachine.walkBackwardAnimation,
            finiteStateMachine.idleAnimation,
            0.2
          )
          break

        case "ArrowRight":
        case "KeyD":
          this.moveRight = false
          finiteStateMachine.changeAnimation(
            finiteStateMachine.strafeRightAnimation,
            finiteStateMachine.idleAnimation,
            0.2
          )
          break

        case "ShiftLeft":
          this.isRunning = false
          finiteStateMachine.walkForwardAnimation.timeScale = 1
          break
      }
    })
  }

  updatePlayer(speed) {
    let playerSpeed = speed

    // if (camera.controls.isLocked) {
      this.velocity.x -= this.velocity.x * 0.8 //Momentum (lower = more momentum)
      this.velocity.z -= this.velocity.z * 0.8

      this.direction.z = Number(this.moveForward) - Number(this.moveBackward)
      this.direction.x = Number(this.moveRight) - Number(this.moveLeft)
      this.direction.normalize() // this ensures consistent movements in all directions

      // Check if player is running
      if (this.isRunning) {
        playerSpeed *= 2
      }

      if (this.moveForward || this.moveBackward)
        this.velocity.z -= this.direction.z * playerSpeed
      if (this.moveLeft || this.moveRight)
        this.velocity.x -= this.direction.x * playerSpeed

      if (collisionDetector.movementBlocked) {
        camera.camera.position.x = Math.round(this.prevPositionX)
        camera.camera.position.z = Math.round(this.prevPositionZ)

        if (camera.vrActive) {
          if (camera.dolly) {
            camera.dolly.position.x = Math.round(this.prevPositionX)
            camera.dolly.position.z = Math.round(this.prevPositionZ)
          }  
        }
      } else {
        //Desktop
        camera.controls.moveRight(-this.velocity.x)
        camera.controls.moveForward(-this.velocity.z)

        //Mobile
        camera.c.updatePosition()

        //VR
        if (camera.vrActive) {
          if (camera.dolly) {
            this.updatePlayerVR()
          }
        }
      }

      if (this.frameCounter === 20) {
        this.prevPositionX = camera.camera.position.x
        this.prevPositionZ = camera.camera.position.z
        this.frameCounter = 0
      } else {
        this.frameCounter++
      }

      if (collisionDetector.playerIsStuck) {
        camera.camera.position.x = 0
        camera.camera.position.z = 0
        collisionDetector.playerIsStuck = false
      }
    // }

    this.character.position.x = camera.camera.position.x
    this.character.position.z = camera.camera.position.z

    this.character.rotation.copy(camera.camera.rotation)

    camera.camera.getWorldDirection(this.cameraWorldDirection)
    this.cameraWorldDirection.y = 0
    this.cameraWorldDirection.add(this.character.position)
    this.character.lookAt(this.cameraWorldDirection)
  }

  updatePlayerVR() {
    if (this.moveForward) {
     //Yeah Ross act like you didn't see this. I know this is jank, but works
     camera.camera.getWorldDirection(this.cameraDirection)
     camera.dolly.position.addScaledVector(this.cameraDirection, -0.033)
     camera.dolly.position.y = 0
    }
  }

  setPlayerHands() {
    //Left Controller
    this.controller1 = renderer.renderer.xr.getController(0)
    //Right Controller
    this.controller2 = renderer.renderer.xr.getController(1)

    scene.add(this.controller1, this.controller2)

    this.controllerModelFactory = new XRControllerModelFactory()

    this.controllerGrip1 = renderer.renderer.xr.getControllerGrip(0)
    this.controllerGrip1.add(
      this.controllerModelFactory.createControllerModel(this.controllerGrip1)
    )
    scene.add(this.controllerGrip1)

    this.controllerGrip2 = renderer.renderer.xr.getControllerGrip(1)
    this.controllerGrip2.add(
      this.controllerModelFactory.createControllerModel(this.controllerGrip2)
    )
    scene.add(this.controllerGrip2)

    //Add visual line
    const laserHelper = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -1),
    ])

    this.lazer = new THREE.Line(laserHelper)
    this.lazer.scale.z = 5

    this.controller1.add(this.lazer.clone())
    this.controller2.add(this.lazer.clone())
    camera.dolly.add(this.controller1)
    camera.dolly.add(this.controller2)
    camera.dolly.add(this.controllerGrip1)
    camera.dolly.add(this.controllerGrip2)
  }

  updatePlayerHands() {}

  checkIntersections() {
    //First Person View (from the center)
    document.addEventListener("click", () => {
      if (raycaster.firstPersonOptions.currentIntersect) {
        //If statement to check which object is being clicked on
        if (
          raycaster.firstPersonOptions.currentIntersect.object.name === "OBJECT"
        ) {
          raycaster.object.material.color = new THREE.Color(
            Math.random(),
            Math.random(),
            Math.random()
          )
        } else if (
          raycaster.firstPersonOptions.currentIntersect.object.name === "naoo-video"
        ) {
          const naooVideo = document.getElementById('video')
          if (!video.playing) {
            naooVideo.play()
            video.sound.play()
            video.playing = true
            audio.stopAudios()
          } else {
            naooVideo.pause()
            video.playing = false
            video.sound.pause()
          }
        } else if (
          this.frameNames.includes(raycaster.firstPersonOptions.currentIntersect.object.name)
        ) {
          const frame = raycaster.firstPersonOptions.currentIntersect.object
          const naooVideo = document.getElementById('video')
          naooVideo.pause()
          video.playing = false
          video.sound.pause()
          audio.stopAudios()
          frame.children[0].play()
        }
      }
    })

    //Left controller in VR
    //EventListener for when user is pressing main button
    this.controller1.addEventListener("selectstart", () => {
      this.moveForward = true
    })

    this.controller1.addEventListener("selectend", () => {
      this.moveForward = false
    })

    //Right controller in VR
    this.controller2.addEventListener("selectstart", () => {
      if (raycaster.rightControllerOptions.currentIntersect) {
        //If statement to check which object is being clicked on
        if (
          raycaster.rightControllerOptions.currentIntersect.object.name === "OBJECT"
        ) {
          raycaster.object.material.color = new THREE.Color(
            Math.random(),
            Math.random(),
            Math.random()
          )
        } else if (
          raycaster.rightControllerOptions.currentIntersect.object.name === "naoo-video"
        ) {
          const naooVideo = document.getElementById('video')
          if (!video.playing) {
            naooVideo.play()
            video.sound.play()
            video.playing = true
            audio.stopAudios()
          } else {
            naooVideo.pause()
            video.playing = false
            video.sound.pause()
          }
        } else if (
          this.frameNames.includes(raycaster.rightControllerOptions.currentIntersect.object.name)
        ) {
          const frame = raycaster.rightControllerOptions.currentIntersect.object
          naooVideo.pause()
          video.playing = false
          video.sound.pause()
          audio.stopAudios()
          frame.children[0].play()
        }
      }
    })
  }
}
