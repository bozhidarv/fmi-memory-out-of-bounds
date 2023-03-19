import Phaser, { Scene } from "phaser";

export default class WinScene extends Phaser.Scene {

  keyEnter: Phaser.Input.Keyboard.Key = {} as Phaser.Input.Keyboard.Key;
  launchScene: Scene = {} as Scene;
  constructor() {
    super("Win");
  }

  init(data: {launchScene: Scene}) {
	this.launchScene = data.launchScene;
  }

  preload() {
	this.load.image("win-screen", "assets/win-screen.png");
	this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }

  create() {
	const background = this.add.image(window.innerWidth / 2, window.innerHeight /2, "win-screen");
    background.width = window.innerWidth;
    background.height = window.innerHeight;
  }

  update(time: number) {
	if(this.keyEnter.isDown) {
		this.launchScene.scene.stop();
		this.scene.start("Corridor");
	}
  }
}