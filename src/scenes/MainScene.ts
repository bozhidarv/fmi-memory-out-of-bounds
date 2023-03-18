import Phaser from "phaser";
import { Monster } from "~/Monsters/Monster";
import { Player } from "~/players/player";
import { Health } from "~/players/health";


let counter = 0;
export default class MainScene extends Phaser.Scene {
  monsters: Monster[] = [];
  player: Player = {} as Player;
  health: Health = {} as Health;

  preload() {
    this.load.image("background", "assets/basic_background.png");
    this.load.image("small-monster", "assets/small-ram-monster-64.png");
    this.load.image("bullet", "assets/bullet.png");
    for (let index = 0; index <= 0; index++) {
      this.load.image(`enemy-${index}`, `assets/enemy-${index}.png`);
    }
    this.load.image("health", "assets/health.png");
  }

  create() {
    const background = this.add.image(0, 0, "background");
    background.displayHeight = window.innerHeight * 2;
    background.displayWidth = window.innerHeight * 4;

    this.health = new Health(this);



    this.player = new Player(100, 100, this);

    this.generateMonsters();

    //this.health.loseHealth();
  }

  generateMonsters() {
    for (let index = 0; index < 10; index++) {
      this.monsters.push(
        new Monster(
          Math.random() * window.innerHeight,
          Math.random() * window.innerHeight,
          this
        )
      );
    }

    const monsterSprites = this.monsters.map(
      (monster) => monster.body.mainSprite
    );
    this.physics.add.collider(monsterSprites, monsterSprites);
  }

  update(time, delta) {
    this.player.move();
    // console.log(time);
    if(counter === 0 || counter === 50) {
      this.player.shoot();
      counter = 0;
    }
    counter++;


    this.monsters.forEach((monster) => {
      monster.move(this.player, this);
    });
  }
}
