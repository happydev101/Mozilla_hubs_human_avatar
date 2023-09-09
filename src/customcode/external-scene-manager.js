import * as THREE from "three";
import { EventDispatcher } from "three";
import { Utils } from "./utils/Utils";
import * as TWEEN from "@tweenjs/tween.js";
import coin_glb from "../assets/models/custom/coin.glb";

export class ExternalSceneManager extends EventDispatcher {
  static instance;
  static onShowSuggestionBox = { type: "showSuggestionBox", data: {} };
  isSuggestion = false;
  coins = [];
  coinPositions = [
    new THREE.Vector3(-13.5, 1.5, -8),
    new THREE.Vector3(-13.5, 1.5, -6.5),
    new THREE.Vector3(-13.5, 1.5, -5)
  ];
  clock = new THREE.Clock();
  constructor() {
    super();
  }
  static init = () => {
    ExternalSceneManager.instance = new ExternalSceneManager();
  };
  static getInstance = () => {
    if (ExternalSceneManager.instance === undefined || ExternalSceneManager.instance === null)
      ExternalSceneManager.instance = new ExternalSceneManager();

    return ExternalSceneManager.instance;
  };
  load = () => {
    this.scene = document.querySelector("a-scene").object3D;
    this.avatarRig = document.getElementById("avatar-rig").object3D;
    // console.log("ExternalSceneManager Scene hirarchy....", this.scene);
    // console.log("ExternalSceneManager Avatar hirarchy...", this.scene);

    //load dummy suggestionbox
    this.isSuggestion = false;
    const geometry = new THREE.BoxGeometry(0.25, 3, 0.25);
    const material = new THREE.MeshBasicMaterial({ color: 0x3e2e79 });
    this.suggestionBox = new THREE.Mesh(geometry, material);
    this.scene.add(this.suggestionBox);

    let pos = new THREE.Vector3(-10, 0, -7);
    this.suggestionBox.position.copy(pos);
    // ***********************

    //load daily coins
    Utils.load3DModelWithAnimationData(coin_glb)
      // Utils.load3DModelWithAnimationData(require("./assets/Coin.glb"))
      .then(animdata => {
        // this.coins.add(animdata.makeClone());
        for (let i = 0; i < this.coinPositions.length; i++) {
          animdata.model.traverse(child => {
            if (child.isMesh) {
              child.matrixAutoUpdate = true;
              child._needsSync = true;
            }
          });

          let cloneData = animdata.makeClone();
          this.scene.add(cloneData.model);
          cloneData.model.scale.set(20, 20, 20);
          cloneData.model.position.copy(this.coinPositions[i]);
          cloneData.getAction(0).play();
          cloneData.getAction(0).loop = THREE.LoopRepeat;
          cloneData.isExecuted = false;
          this.coins.push(cloneData);

          // cloneData.model.traverse(child => {
          //   if (child.isMesh) {
          //     child.matrixAutoUpdate = true;
          //     child._needsSync = true;
          //   }
          // });
        }

        // console.log("coin.glb loaded", animdata.model);
        // this.coins[0].
        //this.coins.
      })
      .catch(err => {
        console.log("coin.glb not loade", err);
      });
    //************************

    //Update logic , later use aframe tick function to update
    this.lastDeltaTime = Date.now();
    setInterval(() => {
      this.update();
    }, 1000 / 40);
  };

  update = () => {
    this.delta = this.clock.getDelta();
    //suggestion box trigger logic
    this.suggestionBoxTriggerLogic();

    //coin trigger logic
    this.coinTriggerLogic();

    TWEEN.update();
  };

  suggestionBoxTriggerLogic = () => {
    // console.log("suggestion box distance", this.avatarRig.position.distanceTo(this.suggestionBox.position));
    if (this.isSuggestion === false && this.avatarRig.position.distanceTo(this.suggestionBox.position) < 1.0) {
      // console.log("trigger suggestion box from ui");
      this.dispatchEvent(ExternalSceneManager.onShowSuggestionBox);
      this.isSuggestion = true;
    } else if (this.isSuggestion === true && this.avatarRig.position.distanceTo(this.suggestionBox.position) > 1.0) {
      this.isSuggestion = false;
    }
  };

  coinTriggerLogic = () => {
    for (let i = 0; i < this.coins.length; i++) {
      if (
        this.coins[i].isExecuted === false &&
        this.avatarRig.position.distanceTo(this.coins[i].model.position) < 2.5
      ) {
        this.coins[i].isExecuted = true;
        let newPos = new THREE.Vector3(0, 0, 0);
        newPos.copy(this.coins[i].model.position);
        newPos.y = newPos.y + 5;
        this.coins[i].getAction(0).stop();
        new TWEEN.Tween(this.coins[i].model)
          .to({ position: newPos }, 1000)
          .start()
          .onUpdate(() => {
            // console.log("pos update:", this.coins[i].model.position);
            this.coins[i].model.matrixAutoUpdate = true;
          })
          .onComplete(() => {
            this.coins[i].model.visible = false;
            // this.coins[i].model.position.copy(newPos);
          });
      } else if (this.coins[i].isExecuted === false) this.coins[i].mixer.update(this.delta);
    }
  };

  resetSuggestion = () => {
    this.isSuggestion = false;
  };
}
