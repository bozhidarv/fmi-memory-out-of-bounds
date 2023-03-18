import { CursorT, KeyT, Sprite } from "~/services/type";
import { Health } from "./health";
import { v4 as uuidv4 } from "uuid";
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

  changedPower: boolean = false;

  constructor(x: number, y: number, game: Phaser.Scene) {
    this.sprite = game.physics.add.sprite(x, y, "stojan");
    this.cursor = game.input.keyboard.createCursorKeys();
    this.sprite.setCollideWorldBounds(true);
    this.keyA = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyW = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

    this.game = game;

    this.health = new Health(game);
  }

  update(): void {
    this.move();
    this.shoot();
    this.removeBullets();
    this.changeBulletPower();
  }

  move(): void {
    if (this.keyA.isDown) {
      this.sprite.setRotation(Math.PI);
      this.sprite.setVelocityX(-this.SPEED);
    } else {
      this.sprite.setDragX(-this.DRAG);
    }

    if (this.keyD.isDown) {
      this.sprite.setRotation(0);
      this.sprite.setVelocityX(this.SPEED);
    } else {
      this.sprite.setDragX(this.DRAG);
    }

    if (this.keyW.isDown) {
      this.sprite.setRotation(-Math.PI / 2);
      this.sprite.setVelocityY(-this.SPEED);
    } else {
      this.sprite.setDragY(-this.DRAG);
    }

    if (this.keyS.isDown) {
      this.sprite.setRotation(Math.PI / 2);
      this.sprite.setVelocityY(this.SPEED);
    } else {
      this.sprite.setDragY(this.DRAG);
    }
  }

  shoot(): void {
    this.lastTimeShoot++;
    if (this.lastTimeShoot < 50) {
      return;
    }

    if (this.cursor.space.isDown) {
      const bullet = this.game.physics.add.sprite(
        this.sprite.x,
        this.sprite.y,
        "bullet"
      );
      bullet.name = `${uuidv4()};${this.bulletPower}`;
      bullet.displayHeight = 10;
      bullet.displayWidth = 30;
      bullet.setRotation(this.sprite.rotation - Math.PI);

      if (this.sprite.rotation === 0) {
        bullet.setVelocityX(this.BULLET_SPEED);
      } else if (this.sprite.rotation === Math.PI / 2) {
        bullet.setVelocityY(this.BULLET_SPEED);
      } else if (this.sprite.rotation === -Math.PI / 2) {
        bullet.setVelocityY(-this.BULLET_SPEED);
      } else if (Math.abs(this.sprite.rotation) === Math.PI) {
        bullet.setVelocityX(-this.BULLET_SPEED);
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
  }

  changeBulletPower() {
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
  }

  animation(): void {}
}
