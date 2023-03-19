import Phaser, { Scene } from "phaser";

export default class PauseScene extends Phaser.Scene {

  keyESC: Phaser.Input.Keyboard.Key = {} as Phaser.Input.Keyboard.Key;
  launchScene: Scene = {} as Scene;
  constructor() {
    super("Pause");
  }

  init(data: {launchScene: Scene}) {
	this.launchScene = data.launchScene;
  }

  preload() {
	this.load.image("pause", "assets/pause-screen.png");
	this.keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
  }

  create() {
	const background = this.add.image(window.innerWidth / 2, window.innerHeight /2, "pause");
    background.width = window.innerWidth;
    background.height = window.innerHeight;
  }

  update(time: number) {
	if(this.keyESC.isDown) {
		this.launchScene.scene.resume();
		this.scene.setVisible(false);
	}
  }
}