import { CursorT, Sprite } from "~/services/type";
export class Player {
  SPEED = 100;
  DRAG = 200;
  BULLET_SPEED = 300;
  sprite: Sprite = {} as Sprite;
  cursor: CursorT = {} as CursorT;

  lastTimeShoot: number = Infinity;

  game: Phaser.Scene = {} as Phaser.Scene;

  constructor(x: number, y: number, game: Phaser.Scene) {
    this.sprite = game.physics.add.sprite(x, y, "player");
    this.cursor = game.input.keyboard.createCursorKeys();
    this.sprite.setCollideWorldBounds(true);
    this.game = game;
  }

  update(): void {
    this.lastTimeShoot++;
    this.move();
    this.shoot();
  }

  move(): void {
    if (this.cursor.left.isDown) {
      this.sprite.setRotation(Math.PI);
      this.sprite.setVelocityX(-this.SPEED);
    } else {
      this.sprite.setDragX(-this.DRAG);
    }

    if (this.cursor.right.isDown) {
      this.sprite.setRotation(0);
      this.sprite.setVelocityX(this.SPEED);
    } else {
      this.sprite.setDragX(this.DRAG);
    }

    if (this.cursor.up.isDown) {
      this.sprite.setRotation(-Math.PI / 2);
      this.sprite.setVelocityY(-this.SPEED);
    } else {
      this.sprite.setDragY(-this.DRAG);
    }

    if (this.cursor.down.isDown) {
      this.sprite.setRotation(Math.PI / 2);
      this.sprite.setVelocityY(this.SPEED);
    } else {
      this.sprite.setDragY(this.DRAG);
    }
  }

  shoot(): void {
    if (this.lastTimeShoot < 100) {
      return;
    }

    if (this.cursor.space.isDown) {
      const bullet = this.game.physics.add.sprite(
        this.sprite.x,
        this.sprite.y,
        "bullet"
      );
      bullet.displayHeight = 10;
      bullet.displayWidth = 30;
      bullet.setRotation(this.sprite.rotation - Math.PI);

      if (
        this.sprite.body.velocity.x === 0 &&
        this.sprite.body.velocity.y === 0
      ) {
        if (this.sprite.rotation === 0) {
          bullet.setVelocityX(this.BULLET_SPEED);
        } else if (this.sprite.rotation === Math.PI / 2) {
          bullet.setVelocityY(this.BULLET_SPEED);
        } else if (this.sprite.rotation === -Math.PI / 2) {
          bullet.setVelocityY(-this.BULLET_SPEED);
        } else if (this.sprite.rotation === Math.PI) {
          bullet.setVelocityX(-this.BULLET_SPEED);
        }
      } else {
        if (this.sprite.body.velocity.x === 0) {
          bullet.setVelocityX(0);
        } else {
          this.sprite.body.velocity.x < 0
            ? bullet.setVelocityX(-this.BULLET_SPEED)
            : bullet.setVelocityX(this.BULLET_SPEED);
        }

        if (this.sprite.body.velocity.y === 0) {
          bullet.setVelocityY(0);
        } else {
          this.sprite.body.velocity.y < 0
            ? bullet.setVelocityY(-this.BULLET_SPEED)
            : bullet.setVelocityY(this.BULLET_SPEED);
        }
      }

      this.lastTimeShoot = 0;
    }
  }

  animation(): void {}
}
