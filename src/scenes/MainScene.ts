import Phaser from "phaser";
import { Monster } from "~/Monsters/Monster";
import { Player } from "~/players/player";

export default class MainScene extends Phaser.Scene {
  monsters: Monster[] = [];
  player: Player = {} as Player;

  preload() {
    this.load.image("background", "assets/basic_background.png");
    this.load.image(
      "logo",
      "http://labs.phaser.io/assets/sprites/phaser3-logo.png"
    );
    this.load.image("monster", "assets/monster.jpeg");
  }

  create() {
    const background = this.add.image(0, 0, "background");
    background.displayHeight = window.innerHeight * 2;
    background.displayWidth = window.innerHeight * 4;

    const logo = this.physics.add.image(400, 100, "logo");
    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    this.monsters.push(new Monster(100, 100, this));
    
    this.player=new Player(100,100,this);

    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);
  }

  update(time: number, delta: number) {
    this.player.move();

    this.monsters.forEach((monster) => {
      monster.move();
    });
    
  }
}
