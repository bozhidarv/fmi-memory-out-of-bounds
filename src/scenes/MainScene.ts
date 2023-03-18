import Phaser, { GameObjects } from "phaser";
import { SmallMonster } from "~/Monsters/SmallMonster";
import { Player } from "~/players/player";
import { Health } from "~/players/health";
import { invWall } from "~/services/invisWalls";
import { SceneMonstersConfigT, Sprite } from "~/services/type";
import { BigMonster } from "~/Monsters/BigMonster";

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
  monsters: (SmallMonster | BigMonster)[] = [];
  player: Player = {} as Player;
  monsterSprites: Sprite[] = [];
  lastBulletsCount = 0;
  lastBulletPower = 0;
  bulletPowerSprite: GameObjects.Image = {} as GameObjects.Image;
  invisWall1: invWall = {} as invWall;
  invisWall2: invWall = {} as invWall;
  invisWall3: invWall = {} as invWall;


  preload() {
    this.load.image("background", "assets/corridor.png");
    this.load.image("small-monster", "assets/small-ram-monster-64.png");
    this.load.image("big-monster", "assets/big-ram-monster.png");
    this.load.image("enemy-sign--", "assets/enemy-sign-minus.png");
    this.load.image("enemy-sign-+", "assets/enemy-sign-plus.png");
    this.load.image("enemy-sign-*", "assets/enemy-sign-multiply.png");
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
    // const invisWall =this.physics.add.sprite(64,window.innerHeight-50,"invisWall");
    // invisWall.setVisible(false);
    // invisWall.setImmovable(true);
    // invisWall.setSize (0,window.innerHeight);
    // invisWall.scaleX=2;
    // invisWall.scaleY=30;
    const background = this.add.image(1920 / 2, 960 / 2, "background");
    background.displayHeight = window.innerHeight;
    background.displayWidth = window.innerHeight;
    background.scale = 1;

    this.invisWall1=new invWall(64,window.innerHeight-50,this);
    this.invisWall1.sizeSet(0,window.innerHeight);
    this.invisWall1.sprite.scaleX=2;
    this.invisWall1.sprite.scaleY=30;

    this.invisWall2=new invWall(window.innerWidth-64,window.innerHeight-50,this);
    this.invisWall2.sizeSet(0,window.innerHeight);
    this.invisWall2.sprite.scaleX=2;
    this.invisWall2.sprite.scaleY=30;

    this.invisWall3=new invWall(window.innerWidth/2,128,this,);
    this.invisWall3.sizeSet(window.innerWidth,0);
    


    this.player = new Player(window.innerWidth/2, window.innerHeight/2, this);
    this.physics.add.collider(this.invisWall1.sprite,this.player.sprite);
    this.physics.add.collider(this.invisWall2.sprite,this.player.sprite);
    this.physics.add.collider(this.invisWall3.sprite,this.player.sprite);


    this.generateMonsters();
    this.physics.add.collider(this.invisWall1.sprite,this.monsterSprites);
    this.physics.add.collider(this.invisWall2.sprite,this.monsterSprites);
    this.physics.add.collider(this.invisWall3.sprite,this.monsterSprites);


    //this.health.loseHealth();

    this.bulletPowerSprite = this.add.image(window.innerWidth-85, window.innerHeight-40, `enemy-digit-${this.lastBulletPower}`);
    this.bulletPowerSprite.scale = 2
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

  update(time, delta) {
    this.player.update();

    if(this.lastBulletPower !== this.player.bulletPower) {
      this.bulletPowerSprite.setTexture(`enemy-digit-${this.player.bulletPower}`);
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
