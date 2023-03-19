import Phaser from "phaser";

export default class GameOver extends Phaser.Scene {

  keyEnter: Phaser.Input.Keyboard.Key = {} as Phaser.Input.Keyboard.Key;

  constructor() {
    super("GameOver");
  }

  preload() {
	console.log('Game over has started')
	this.load.image("game-over-bg", "assets/game-over.jpg");
	this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }

  create() {
	const background = this.add.image(window.innerWidth / 2, window.innerHeight /2, "game-over-bg");
    background.width = window.innerWidth;
    background.height = window.innerHeight;
  }

  update(time: number) {
	if(this.keyEnter.isDown) {
		console.log("ENTER is pressed");
		this.scene.start("Corridor");
	}
  }
}
