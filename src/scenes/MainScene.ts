import Phaser from "phaser";
import { SmallMonster } from "~/Monsters/SmallMonster";
import { Player } from "~/players/player";
import { Health } from "~/players/health";
import { SceneMonstersConfigT } from "~/services/type";

const monsterConfig: SceneMonstersConfigT = {
  smallMonsters: [
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

  preload() {
    this.load.image("background", "assets/basic_background.png");
    this.load.image("small-monster", "assets/small-ram-monster-64.png");
    this.load.image("bullet", "assets/bullet.png");
    for (let index = 0; index <= 9; index++) {
      this.load.image(
        `enemy-digit-${index}`,
        `assets/enemy-digit-${index}.png`
      );
    }
    this.load.image("health", "assets/health.png");
  }

  create() {
    const background = this.add.image(0, 0, "background");
    
    // const invisWall =this.physics.add.sprite(64,window.innerHeight-50,"invisWall");
    // invisWall.setVisible(false);
    // invisWall.setImmovable(true);
    // invisWall.setSize (0,window.innerHeight);
    // invisWall.scaleX=2;
    // invisWall.scaleY=30;
    

    background.displayHeight = window.innerHeight * 2;
    background.displayWidth = window.innerHeight * 4;

    this.player = new Player(500, 100, this);
   // this.physics.add.collider(invisWall,this.player.sprite);

    this.generateMonsters();

    //this.health.loseHealth();
  }

  generateMonsters() {
    this.monsters = this.monsters.concat(
      monsterConfig.smallMonsters.map(
        (monster, index) =>
          new SmallMonster(monster.startX, monster.startY, index, this)
      )
    );

    const monsterSprites = this.monsters.map(
      (monster) => monster.body.mainSprite
    );
    this.physics.add.collider(monsterSprites, monsterSprites);
    this.physics.add.collider(monsterSprites, this.player.sprite, (obj) => {
      const monsterIndex = this.monsters.findIndex(
        (monster) => monster.body.mainSprite.name === obj.name
      );
      this.monsters[monsterIndex].destroy();
      this.monsters.splice(monsterIndex, 1);

      this.player.hit();
    });
  }

  update(time, delta) {
    this.player.update();

    this.monsters.forEach((monster) => {
      monster.move(this.player, this);
    });
  }
}
