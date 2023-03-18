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
    this.load.image("small-monster", "assets/small-ram-monster-64.png");
    this.load.image("chest", "assets/chests.png");
    this.load.image('bullet', 'assets/bullet.png');
  }

  create() {
    const background = this.add.image(0, 0, "background");
    background.displayHeight = window.innerHeight * 2;
    background.displayWidth = window.innerHeight * 4;

    const chests = this.physics.add.image(500, 500, "chest");
    chests.setCollideWorldBounds(true);
    chests.body.immovable = true;

    const logo = this.physics.add.image(400, 100, "logo");

    this.physics.add.collider(logo, chests);
    for (let index = 0; index < 10; index++) {
      this.monsters.push(
        new Monster(
          Math.random() * window.innerHeight,
          Math.random() * window.innerHeight * 2,
          this
        )
      );
    }

    this.player = new Player(100, 100, this);
    this.physics.add.collider(this.player.sprite, logo);

    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);
  }

  update(time: number, delta: number) {
    this.player.move();
    this.player.shoot();

    this.monsters.forEach((monster) => {
      monster.move(this.player, this);
    });
  }
}
