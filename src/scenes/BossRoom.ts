import Phaser, { GameObjects } from "phaser";
import { SmallMonster } from "~/Monsters/SmallMonster";
import { Player, PlayerData } from "~/players/player";
import { Health } from "~/players/health";
import { InvisibleTopWall } from "~/services/invisibleTopWall";
import { SceneMonstersConfigT, Sprite } from "~/services/type";
import { BigMonster } from "~/Monsters/BigMonster";
import { generateBackground } from "~/services/sceneUtils";
import { BossMonster } from "~/Monsters/BossMonster";

const waveConfig: SceneMonstersConfigT[] = [
  {
    smallMonsters: [
      {
        startX: 100,
        startY: 100,
      },
    ],
    bigMonsters: [],
  },
  {
    smallMonsters: [],
    bigMonsters: [],
  },
  {
    smallMonsters: [],
    bigMonsters: [],
  },
];

export default class BossRoom extends Phaser.Scene {
  monsters: (SmallMonster | BigMonster)[] = [];
  player: Player = {} as Player;
  monsterSprites: Sprite[] = [];
  lastBulletsCount = 0;
  lastBulletPower = 0;
  bulletPowerSprite: GameObjects.Image = {} as GameObjects.Image;

  bossMonster: BossMonster = {} as BossMonster;

  playerData?: PlayerData;

  wave = 0;

  constructor() {
    super("BossRoom");
  }

  init(data: { playerData?: PlayerData }) {
    this.playerData = data.playerData;
  }

  create() {
    generateBackground(this);

    const wall = new InvisibleTopWall(126, this);
    this.generatePlayer();
    this.physics.add.collider(wall.sprite, this.player.sprite);

    this.generateBoss();
    this.generateMonsters();
  }

  generatePlayer() {
    this.player = new Player(500, 500, this, this.playerData);
  }

  moveToCorridor = () => {
    this.scene.start("Corridor", { playerData: this.player.getData() });
  };

  generateBoss() {
    this.bossMonster = new BossMonster(100, 100, this);

    this.physics.add.collider(
      this.bossMonster.body.mainSprite,
      this.player.sprite,
      () => {
        this.player.hit();
      }
    );
  }

  generateMonsters() {
    const monsterConfig = waveConfig[this.wave];

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

    this.physics.add.collider(
      this.monsterSprites,
      this.bossMonster.body.mainSprite
    );
  }

  update() {
    this.player.update();

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
      this.physics.add.collider(
        this.bossMonster.body.mainSprite,
        this.player.bullets[this.player.bullets.length - 1],
        (_, hitBullet) => {
          const bossState = this.bossMonster.hit(
            parseInt(hitBullet.name.split(";")[1])
          );

          if (!bossState.isAlive) {
            //WIN
          }

          if (bossState.isStageClear) {
            this.wave++;
            this.generateMonsters();
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

    this.bossMonster.move(this.player, this);
  }
}
