import Phaser, { GameObjects } from "phaser";
import { SmallMonster } from "~/Monsters/SmallMonster";
import { Player, PlayerData } from "~/players/player";
import { Health } from "~/players/health";
import { InvisibleTopWall } from "~/services/invisibleTopWall";
import { SceneMonstersConfigT, Sprite } from "~/services/type";
import { BigMonster } from "~/Monsters/BigMonster";
import { generateBackground } from "~/services/sceneUtils";
import { BossMonster } from "~/Monsters/BossMonster";
import { ProgressBar } from "~/players/progres";

const waveConfig: SceneMonstersConfigT[] = [
  {
    smallMonsters: [
      {
        startX: 400,
        startY: 100,
      },
      {
        startX: 450,
        startY: 100,
      },
    ],
    bigMonsters: [
      {
        startX: 100,
        startY: 100,
      },
      {
        startX: 200,
        startY: 200,
      },
    ],
  },
  {
    smallMonsters: [
      {
        startX: 400,
        startY: 100,
      },
      {
        startX: 500,
        startY: 200,
      },
    ],
    bigMonsters: [
      {
        startX: 100,
        startY: 100,
      },
      {
        startX: 200,
        startY: 200,
      },
    ],
  },
  {
    smallMonsters: [
      {
        startX: 400,
        startY: 100,
      },
      {
        startX: 500,
        startY: 200,
      },
    ],
    bigMonsters: [
      {
        startX: 100,
        startY: 100,
      },
      {
        startX: 200,
        startY: 200,
      },
    ],
  }
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
    generateBackground(this, "boss-room");

    const wall = new InvisibleTopWall(70, this);
    this.generatePlayer();

    new ProgressBar([0, 1, 2, 3], this);

    this.physics.add.collider(wall.sprite, this.player.sprite);

    this.generateBoss();
    this.generateMonsters();
  }

  generatePlayer() {
    this.player = new Player(
      window.innerWidth / 2,
      window.innerHeight / 2 + 80,
      this,
      this.playerData
    );
  }

  generateBoss() {
    this.bossMonster = new BossMonster(
      200,
      200,
      this
    );

    this.physics.add.collider(
      this.bossMonster.body.mainSprite,
      this.player.sprite,
      () => {
        this.player.hit();
      }
    );
  }

  generateMonsters() {
    if (this.wave > waveConfig.length - 1) {
      return;
    }

    const monsterConfig = waveConfig[this.wave];

    this.monsters = this.monsters.concat(
      monsterConfig.smallMonsters.map(
        (monster, index) =>
          new SmallMonster(this.bossMonster.x+ monster.startX, this.bossMonster.y+ monster.startY, index, this)
      )
    );

    this.monsters = this.monsters.concat(
      monsterConfig.bigMonsters.map(
        (monster, index) =>
          new BigMonster(this.bossMonster.x+ monster.startX, this.bossMonster.y+ monster.startY, index, this)
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
            this.scene.pause();
            this.scene.launch("Win", { launchScene: this });
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
