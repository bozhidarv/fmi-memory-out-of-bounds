import Phaser, { GameObjects } from "phaser";
import { SmallMonster } from "~/Monsters/SmallMonster";
import { Player, PlayerData } from "~/players/player";
import { ProgressBar } from "~/players/progres";
import { SceneMonstersConfigT, Sprite } from "~/services/type";
import { v4 as uuidv4 } from "uuid";
import { BigMonster } from "~/Monsters/BigMonster";
import { generateBackground, preloadImages } from "~/services/sceneUtils";
import { InvisibleTopWall } from "~/services/invisibleTopWall";
import { Fss } from "~/players/fss";
import { whichRoom } from "~/services/SwitchRooom";

const WallHight = 266;
const spawnRate = 1000;
export default class MainScene extends Phaser.Scene {
  player: Player = {} as Player;

  progress: ProgressBar = {} as ProgressBar;
  monsters: (SmallMonster | BigMonster)[] = [];
  monsterSprites: Sprite[] = [];
  lastBulletsCount = 0;
  lastBulletPower = 0;
  bulletPowerSprite: GameObjects.Image = {} as GameObjects.Image;

  playerData?: PlayerData;

  monsterToSpawnCounter = spawnRate;

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

    const wall = new InvisibleTopWall(WallHight, this);

    this.generatePlayer();

    this.physics.add.collider(wall.sprite, this.player.sprite);
    this.physics.add.collider(wall.sprite, this.monsterSprites);

    this.moveToOtherRoom()

  }

  generateFss() {
    
    this.fssMage=new Fss(window.innerWidth/2+75,300,this,this.player);
    this.fssMage.isNearPlayer();

  }

  generatePlayer() {
    this.player = new Player(
      window.innerWidth / 1.1,
      window.innerHeight / 1.1,
      this,
      this.playerData
    );
  }

  getRandomWidth() {
    const leftOrRight = Math.round(Math.random());
    const offset = Math.random() * 100 + 200;

    return (1 - leftOrRight * 2) * offset + leftOrRight > 0 ? innerWidth : 0;
  }

  getRandomHight() {
    const offset =
      Math.random() * (innerHeight - 1.5 * WallHight) + 1.5 * WallHight;

    return offset;
  }

  generateMonster() {
    const typeMonster = Math.round(Math.random());
    let monster: SmallMonster | BigMonster;
    switch (typeMonster) {
      case 0:
        monster = new SmallMonster(
          this.getRandomWidth(),
          this.getRandomHight(),
          uuidv4(),
          this
        );
        break;
      default:
        monster = new BigMonster(
          this.getRandomWidth(),
          this.getRandomHight(),
          uuidv4(),
          this
        );
    }
    this.monsters.push(monster);

    this.monsterSprites.push(monster.body.mainSprite);

    this.physics.add.collider(this.monsterSprites, monster.body.mainSprite);

    this.physics.add.collider(
      monster.body.mainSprite,
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

  moveToOtherRoom(roomId) {
    this.scene.start(`Room${roomId}`, { playerData: this.player.getData() });
  }

  update() {
    if (this.monsters.length === 0 || this.monsterToSpawnCounter < 1) {
      this.monsterToSpawnCounter = spawnRate;

      this.generateMonster();
    } else {
      this.monsterToSpawnCounter--;
    }

    this.player.update();

    const roomId = whichRoom(this.player.sprite.x, this.player.sprite.y);
    if (roomId) {
      this.moveToOtherRoom(roomId);
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
