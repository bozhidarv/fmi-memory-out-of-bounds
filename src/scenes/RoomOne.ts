import Phaser, { GameObjects } from "phaser";
import { SmallMonster } from "~/Monsters/SmallMonster";
import { Player, PlayerData } from "~/players/player";
import { InvisibleTopWall } from "~/services/invisibleTopWall";
import { SceneMonstersConfigT, Sprite } from "~/services/type";
import { BigMonster } from "~/Monsters/BigMonster";
import { generateBackground } from "~/services/sceneUtils";
import { Fss } from "~/players/fss";

const monsterConfig: SceneMonstersConfigT = {
  smallMonsters: [
    {
      startX: window.innerWidth - 100,
      startY: 100,
    },
    {
      startX: window.innerWidth + 100,
      startY: 100,
    },
    {
      startX: 100,
      startY: 600,
    },
    {
      startX: window.innerWidth - 100,
      startY: 600,
    },
    {
      startX: window.innerWidth - 100,
      startY: 900,
    },
    {
      startX: 100,
      startY: 900,
    },
    {
      startX: window.innerWidth / 2,
      startY: window.innerHeight / 2,
    },
  ],
  bigMonsters: [
    {
      startX: 100,
      startY: 100,
    },
    {
      startX: window.innerWidth - 100,
      startY: 100,
    },
    {
      startX: 100,
      startY: window.innerHeight - 100,
    },
    {
      startX: window.innerWidth - 100,
      startY: window.innerHeight - 100,
    },
  ],
};

export default class RoomOne extends Phaser.Scene {
  monsters: (SmallMonster | BigMonster)[] = [];
  player: Player = {} as Player;
  monsterSprites: Sprite[] = [];
  lastBulletsCount = 0;
  lastBulletPower = 0;
  bulletPowerSprite: GameObjects.Image = {} as GameObjects.Image;

  fssMage: Fss = {} as Fss;

  isRoomOpened = false;

  playerData?: PlayerData;
  constructor() {
    super("Room1");
  }

  init(data: { playerData?: PlayerData }) {
    this.restartMonster();
    this.playerData = data.playerData;
  }

  create() {
    generateBackground(this,"room1");

    const wall = new InvisibleTopWall(126, this);
    
    this.generateFss();
    this.generatePlayer();

    if (!this.isRoomOpened) {
      this.generateMonsters();
    }

    this.physics.add.collider(wall.sprite, this.player.sprite);
  }

  generatePlayer() {
    this.player = new Player(
      window.innerWidth / 2,
      window.innerHeight - 100,
      this,
      this.playerData
    );
  }

  generateFss() {
    this.fssMage = new Fss(window.innerWidth / 2 + 75, 300, this);
  }

  restartMonster() {
    this.monsters.forEach((monster) => monster.destroy());
    this.monsterSprites = [];
    this.monsters = [];
  }

  moveToCorridor() {
    this.scene.start("Corridor", { playerData: this.player.getData() });
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
        if(this.player.isPlayerDead()) {
          this.isRoomOpened = false;
        }
      }
    );
  }

  moveBack = () => {
    this.isRoomOpened = true;
    this.scene.start("Corridor", { playerData: this.player.getData() });
  };

  update(time, delta) {
    this.player.update();
    this.fssMage.isNearPlayer(
      this.isRoomOpened,
      this.moveBack,
      this.monsters.length == 0,
      this.player
    );

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
