import Phaser, { GameObjects } from "phaser";
import { SmallMonster } from "~/Monsters/SmallMonster";
import { Player, PlayerData } from "~/players/player";
import { Health } from "~/players/health";
import { InvisibleTopWall } from "~/services/invisibleTopWall";
import { SceneMonstersConfigT, Sprite } from "~/services/type";
import { BigMonster } from "~/Monsters/BigMonster";
import { generateBackground } from "~/services/sceneUtils";
import { Fss } from "~/players/fss";

const waveConfig: SceneMonstersConfigT[] = [
  {
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
    bigMonsters: [],
  },
  {
    smallMonsters: [],
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
  },
];

export default class RoomTwo extends Phaser.Scene {
  WAVE_SIZE = 2;
  monsters: (SmallMonster | BigMonster)[] = [];
  player: Player = {} as Player;
  monsterSprites: Sprite[] = [];
  lastBulletsCount = 0;
  lastBulletPower = 0;
  bulletPowerSprite: GameObjects.Image = {} as GameObjects.Image;
  fssMage: Fss = {} as Fss;
  isRoomOpened = false;
  wave = 1;

  playerData?: PlayerData;
  constructor() {
    super("Room2");
  }

  init(data: { playerData?: PlayerData }) {
    this.restartMonster();
    this.playerData = data.playerData;
  }

  create() {
    generateBackground(this);

    this.generateFss();
    this.generatePlayer();
    const wall = new InvisibleTopWall(126, this);
    if (!this.isRoomOpened) {
      this.generateMonsters();
    }
    this.physics.add.collider(wall.sprite, this.player.sprite);
  }

  generatePlayer() {
    this.player = new Player(100, 100, this, this.playerData);
  }

  generateFss() {
    this.fssMage = new Fss(window.innerWidth / 2 + 75, 300, this);
  }

  restartMonster() {
    this.monsters.forEach((monster) => monster.destroy());
    this.monsterSprites = [];
    this.monsters = [];
  }

  moveToCorridor = () => {
    this.scene.start("Corridor", { playerData: this.player.getData() });
    this.isRoomOpened = true;
  }

  generateMonsters() {
    const monsterConfig = waveConfig[this.wave-1];

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
        if (this.player.isPlayerDead()) {
          this.isRoomOpened = false;
          this.wave = 1;
        }
      }
    );
  }

  update(time, delta) {
    this.player.update();
    if(this.wave === this.WAVE_SIZE && this.monsters.length === 0) {
      console.log(this.isRoomOpened);
      this.fssMage.isNearPlayer(this.isRoomOpened, this.moveToCorridor, true, this.player);
    }

    if (this.monsters.length === 0 && this.wave < this.WAVE_SIZE) {
      this.wave++;
      this.generateMonsters();
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
