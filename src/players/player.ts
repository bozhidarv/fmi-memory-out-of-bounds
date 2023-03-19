import { CursorT, KeyT, Sprite } from "~/services/type";
import { Health } from "./health";
import { v4 as uuidv4 } from "uuid";
import { GameObjects } from "phaser";
import { ProgressBar } from "./progres";

export type PlayerData = {
  health: number;
  progress: number[];
};
export class Player {
  SPEED = 200;
  DRAG = 300;
  BULLET_SPEED = 300;
  bulletPower = 0;
  keyA: KeyT = {} as KeyT;
  keyS: KeyT = {} as KeyT;
  keyD: KeyT = {} as KeyT;
  keyW;

  sprite: Sprite = {} as Sprite;
  cursor: CursorT = {} as CursorT;
  health: Health = {} as Health;
  lastTimeShoot: number = Infinity;
  bullets: Sprite[] = [];
  game: Phaser.Scene = {} as Phaser.Scene;
  bulletPowerSprite: GameObjects.Image = {} as GameObjects.Image;
  changedPower: boolean = false;
  progressBar: ProgressBar = {} as ProgressBar;

  

  constructor(x: number, y: number, game: Phaser.Scene, data?: PlayerData) {
    this.sprite = game.physics.add.sprite(x, y, "stojan-right");

    this.cursor = game.input.keyboard.createCursorKeys();
    this.sprite.setCollideWorldBounds(true);
    this.keyA = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyW = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

    this.game = game;

    this.bulletPowerSprite = game.add.image(
      window.innerWidth - 90,
      window.innerHeight - 50,
      `enemy-digit-${this.bulletPower}`
    );
    this.bulletPowerSprite.scale = 3;

    this.health = new Health(data?.health ?? 5, game);
    this.progressBar = new ProgressBar(data?.progress ?? [], game);
  }



  update(): void {
    this.move();
    this.shoot();
    this.removeBullets();
    this.changeBulletPower();
  }

  move(): void {
    if (this.keyA.isDown) {
      this.sprite.setTexture("stojan-left");
      this.sprite.setVelocityX(-this.SPEED);
    } else {
      this.sprite.setDragX(-this.DRAG);
    }

    if (this.keyD.isDown) {
      this.sprite.setTexture("stojan-right");
      this.sprite.setVelocityX(this.SPEED);
    } else {
      this.sprite.setDragX(this.DRAG);
    }

    if (this.keyW.isDown) {
      this.sprite.setTexture("stojan-back");
      this.sprite.setVelocityY(-this.SPEED);
    } else {
      this.sprite.setDragY(-this.DRAG);
    }

    if (this.keyS.isDown) {
      this.sprite.setTexture("stojan-front");
      this.sprite.setVelocityY(this.SPEED);
    } else {
      this.sprite.setDragY(this.DRAG);
    }

  }

  shoot(): void {
    this.lastTimeShoot++;
    if (this.lastTimeShoot < 90) {
      return;
    }

    if (this.cursor.space.isDown) {
      const bullet = this.game.physics.add.sprite(
        this.sprite.x,
        this.sprite.y,
        `bullet-${this.bulletPower}`
      );
      bullet.name = `${uuidv4()};${this.bulletPower}`;

      if (this.sprite.texture.key === "stojan-right") {
        bullet.setVelocityX(this.BULLET_SPEED);
        bullet.x += 80;
      } else if (this.sprite.texture.key === "stojan-front") {
        bullet.setVelocityY(this.BULLET_SPEED);
        bullet.y += 80;
      } else if (this.sprite.texture.key === "stojan-back") {
        bullet.setVelocityY(-this.BULLET_SPEED);
        bullet.y -= 80;
      } else if (this.sprite.texture.key === "stojan-left") {
        bullet.setVelocityX(-this.BULLET_SPEED);
        bullet.x -= 80;
      }

      if (bullet.body.velocity.x === 0 && bullet.body.velocity.y === 0) {
        bullet.destroy();
      } else {
        this.bullets.push(bullet);
        this.lastTimeShoot = 0;
      }
    }
  }

  removeBullets(): void {
    const bulletsToRemove: number[] = [];
    this.bullets.forEach((bullet, index) => {
      if (
        bullet.x < 0 ||
        bullet.x > this.game.sys.canvas.width ||
        bullet.y < 0 ||
        bullet.y > this.game.sys.canvas.height
      ) {
        bullet.destroy();
        bulletsToRemove.push(index);
      }
    });

    bulletsToRemove.forEach((bulletIndex) => {
      this.bullets.splice(bulletIndex, 1);
    });
  }

  isPlayerDead(): boolean {
    return this.health.currentHealth === 0;
  }

  hit() {
    this.health.loseHealth();
    if (this.isPlayerDead()) {
      console.log("Starting game over scene")
      this.game.scene.launch('GameOver', {launchScene: this.game});
      this.game.scene.pause();
    }
  }

  changeBulletPower() {
    console.log(this.changedPower);
    if (this.cursor.up.isUp && this.cursor.down.isUp) {
      this.changedPower = false;
    }
    if (this.cursor.up.isDown && !this.changedPower) {
      this.bulletPower++;
      if (this.bulletPower > 9) {
        this.bulletPower = 0;
      }
      this.changedPower = true;
    } else if (this.cursor.down.isDown && !this.changedPower) {
      this.bulletPower--;
      if (this.bulletPower < 0) {
        this.bulletPower = 9;
      }
      this.changedPower = true;
    }
    if(this.changedPower) {
      this.bulletPowerSprite.setTexture(
        `enemy-digit-${this.bulletPower}`
      );
    }
  }

  getData(): PlayerData {
    return {
      health: this.health.currentHealth,
      progress: this.progressBar.progress,
    };
  }

  animation(): void {}
}
