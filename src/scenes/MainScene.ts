import Phaser from "phaser";
import { SmallMonster } from "~/Monsters/SmallMonster";
import { Player } from "~/players/player";
import { Health } from "~/players/health";
import { SceneMonstersConfigT } from "~/services/type";

let counter = 0;

const monsterConfig: SceneMonstersConfigT = {
  smallMonsters: [
    {
      startX: 100,
      startY: 100,
    },
    {
      startX: 200,
      startY: 100,
    },
    {
      startX: 300,
      startY: 100,
    },
    {
      startX: 400,
      startY: 500,
    },
    {
      startX: 500,
      startY: 600,
    },
    {
      startX: 600,
      startY: 700,
    },
  ],
  bigMonsters: [],
};
export default class MainScene extends Phaser.Scene {
  monsters: SmallMonster[] = [];
  player: Player = {} as Player;
  health: Health = {} as Health;

  preload() {
    this.load.image("background", "assets/basic_background.png");
    this.load.image("small-monster", "assets/small-ram-monster-64.png");
    this.load.image("bullet", "assets/bullet.png");
    for (let index = 0; index <= 0; index++) {
      this.load.image(`enemy-${index}`, `assets/enemy-digits-${index}.png`);
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
    this.monsters = this.monsters.concat(
      monsterConfig.smallMonsters.map(
        (monster) => new SmallMonster(monster.startX, monster.startY, this)
      )
    );

    const monsterSprites = this.monsters.map(
      (monster) => monster.body.mainSprite
    );
    this.physics.add.collider(monsterSprites, monsterSprites);
  }

  update(time, delta) {
    this.player.move();
    // console.log(time);
    if (counter === 0 || counter === 50) {
      this.player.shoot();
      counter = 0;
    }
    counter++;

    this.monsters.forEach((monster) => {
      monster.move(this.player, this);
    });
  }
}
