import Phaser, { Scene } from "phaser";

export default class GameOver extends Phaser.Scene {

  keyEnter: Phaser.Input.Keyboard.Key = {} as Phaser.Input.Keyboard.Key;
  launchScene: Scene = {} as Scene;
  constructor() {
    super("GameOver");
  }

  init(data: {launchScene: Scene}) {
	this.launchScene = data.launchScene;
  }

  preload() {
	this.load.image("game-over-bg", "assets/game-over.png");
	this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }

  create() {
	const background = this.add.image(window.innerWidth / 2, window.innerHeight /2, "game-over-bg");
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
