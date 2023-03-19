import Phaser, { GameObjects } from "phaser";
import { SmallMonster } from "~/Monsters/SmallMonster";
import { Player, PlayerData } from "~/players/player";
import { ProgressBar } from "~/players/progres";
import { SceneMonstersConfigT, Sprite } from "~/services/type";
import { BigMonster } from "~/Monsters/BigMonster";
import { generateBackground, preloadImages } from "~/services/sceneUtils";
import { InvisibleTopWall } from "~/services/invisibleTopWall";

const monsterConfig: SceneMonstersConfigT = {
  smallMonsters: [
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
    {
      startX: 1000,
      startY: 100,
    },
    {
      startX: 100,
      startY: 500,
    },
    {
      startX: 1000,
      startY: 600,
    },
    {
      startX: 700,
      startY: 1000,
    },
  ],
  bigMonsters: [
    {
      startX: 1500,
      startY: 500,
    },
    {
      startX: 700,
      startY: 200,
    },
    {
      startX: 1000,
      startY: 700,
    },
    {
      startX: 1000,
      startY: 500,
    },
  ],
};

export default class MainScene extends Phaser.Scene {
  player: Player = {} as Player;

  progress: ProgressBar = {} as ProgressBar;
  monsters: (SmallMonster | BigMonster)[] = [];
  monsterSprites: Sprite[] = [];
  lastBulletsCount = 0;
  lastBulletPower = 0;
  bulletPowerSprite: GameObjects.Image = {} as GameObjects.Image;

  playerData?: PlayerData;

  constructor() {
    super("Corridor");
  }

  init(data: { playerData?: PlayerData }) {
    this.restartMonster();
    this.playerData = data.playerData;
  }

  preload() {
    preloadImages(this);
  }

  create() {
    generateBackground(this);

    const wall = new InvisibleTopWall(226, this);

    this.generatePlayer();

    //TODO add random spawn
    this.generateMonsters();

    this.progress = new ProgressBar(this);
    this.progress.upgradeProgress();

    this.physics.add.collider(wall.sprite, this.player.sprite);
    this.physics.add.collider(wall.sprite, this.monsterSprites);
  }

  generatePlayer() {
    this.player = new Player(
      window.innerWidth / 2,
      window.innerHeight / 2,
      this,
      this.playerData
    );
  }

  generateMonsters() {
    this.monsters = this.monsters.concat(
      monsterConfig.smallMonsters.map(
        (monster, index) =>
          new SmallMonster(monster.startX, monster.startY, index, this)
      )
    );

    this.monsters = this.monsters.concat(
      monsterConfig.bigMonsters.map(
        (monster, index) =>
          new BigMonster(monster.startX, monster.startY, index, this)
      )
    );

    this.monsterSprites = this.monsters.map(
      (monster) => monster.body.mainSprite
    );

    this.physics.add.collider(this.monsterSprites, this.monsterSprites);

    this.physics.add.collider(
      this.monsterSprites,
      this.player.sprite,
      (obj) => {
        const monsterIndex = this.monsters.findIndex(
          (monster) => monster.body.mainSprite.name === obj.name
        );

        this.monsters[monsterIndex].destroy();
        this.monsters.splice(monsterIndex, 1);

        this.player.hit();
      }
    );
  }

  restartMonster() {
    this.monsters.forEach((monster) => monster.destroy());
    this.monsterSprites = [];
    this.monsters = [];
  }

  moveToOtherRoom() {
    this.scene.start("RoomOne", { playerData: this.player.getData() });
  }

  update() {
    this.player.update();

    if (this.lastBulletPower !== this.player.bulletPower) {
      this.player.bulletPowerSprite.setTexture(
        `enemy-digit-${this.player.bulletPower}`
      );
      this.lastBulletPower = this.player.bulletPower;
    }

    if (this.player.bullets.length < this.lastBulletsCount) {
      this.lastBulletsCount--;
    }

    if (this.player.bullets.length > this.lastBulletsCount) {
      this.physics.add.collider(
        this.monsterSprites,
        this.player.bullets[this.player.bullets.length - 1],
        (hitMonster, hitBullet) => {
          const monsterIndex = this.monsters.findIndex(
            (monster) => monster.body.mainSprite.name === hitMonster.name
          );

          const isAlive = this.monsters[monsterIndex].hit(
            parseInt(hitBullet.name.split(";")[1])
          );

          if (!isAlive) {
            this.monsters.splice(monsterIndex, 1);
          }

          const hitBulletIndex = this.player.bullets.findIndex(
            (bullet) => bullet.name === hitBullet.name
          );

          hitBullet.destroy();
          this.player.bullets.splice(hitBulletIndex, 1);
        }
      );
    }

    this.monsters.forEach((monster) => {
      monster.move(this.player, this);
    });
  }
}
