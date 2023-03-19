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
  DRAG = 500;
  BULLET_SPEED = 300;
  bulletPower = 0;
  keyA: KeyT = {} as KeyT;
  keyS: KeyT = {} as KeyT;
  keyD: KeyT = {} as KeyT;
  keyG: KeyT = {} as KeyT;
  keyM: KeyT = {} as KeyT;
  keyW: KeyT = {} as KeyT;
  keyESC: KeyT = {} as KeyT;

  sprite: Sprite = {} as Sprite;
  cursor: CursorT = {} as CursorT;
  health: Health = {} as Health;
  lastTimeShoot: number = Infinity;
  bullets: Sprite[] = [];
  game: Phaser.Scene = {} as Phaser.Scene;
  bulletPowerSprite: GameObjects.Image = {} as GameObjects.Image;
  changedPower: boolean = false;
  progressBar: ProgressBar = {} as ProgressBar;
  usedGodMode: boolean = false;
  shootingDirection: string = 'right';

  constructor(x: number, y: number, game: Phaser.Scene, data?: PlayerData) {
    game.anims.create({
      key: 'right',
      frames: game.anims.generateFrameNumbers('stojan-right-spritesheet', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    game.anims.create({
      key: 'left',
      frames: game.anims.generateFrameNumbers('stojan-left-spritesheet', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    game.anims.create({
      key: 'front',
      frames: game.anims.generateFrameNumbers('stojan-front-spritesheet', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
    game.anims.create({
      key: 'back',
      frames: game.anims.generateFrameNumbers('stojan-back-spritesheet', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
    this.sprite = game.physics.add.sprite(x, y, "stojan-right-spritesheet");

    this.cursor = game.input.keyboard.createCursorKeys();
    this.sprite.setCollideWorldBounds(true);
    this.keyA = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyW = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyG = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G);
    this.keyM = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
    this.keyESC = game.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ESC
    );

    this.game = game;

    this.bulletPowerSprite = game.add.image(
      window.innerWidth - 90,
      window.innerHeight - 50,
      `enemy-digit-${this.bulletPower}`
    );
    this.bulletPowerSprite.scale = 3;

    this.health = new Health(data?.health ?? 5, game);
    this.progressBar = new ProgressBar([], game);
    data?.progress.forEach((progressEl) => {
      this.progressBar.setProgress(progressEl);
    });
  }

  update(): void {
    this.move();
    this.shoot();
    this.removeBullets();
    this.changeBulletPower();
    if (this.keyG.isUp && this.keyM.isUp) {
      this.usedGodMode = false;
    }
    if (this.keyG.isDown && this.keyM.isDown && !this.usedGodMode) {
      this.usedGodMode = true;
      this.progressBar.upgradeProgress();
    }
    this.pauseTheGame();
  }

  move(): void {
    if (this.keyA.isDown) {
      this.shootingDirection = 'left';
      this.sprite.anims.play("left", true);
      this.sprite.setVelocityX(-this.SPEED);
    } else {
      this.sprite.setDragX(-this.DRAG);
    }

    if (this.keyD.isDown) {
      this.shootingDirection = 'right';
      this.sprite.setVelocityX(this.SPEED);
      this.sprite.anims.play('right', true);
    } else {
      this.sprite.setDragX(this.DRAG);
    }

    if (this.keyW.isDown) {
      this.shootingDirection = 'back';
      this.sprite.anims.play("back", true);
      this.sprite.setVelocityY(-this.SPEED);
    } else {
      this.sprite.setDragY(-this.DRAG);
    }

    if (this.keyS.isDown) {
      this.shootingDirection = 'front';
      this.sprite.anims.play("front", true);
      this.sprite.setVelocityY(this.SPEED);
    } else {
      this.sprite.setDragY(this.DRAG);
    }

    if(this.sprite.body.velocity.x === 0 && this.sprite.body.velocity.y === 0) {
      this.sprite.anims.stop();
      // this.sprite.setTexture("stojan-right");
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

      if (this.shootingDirection === "right") {
        bullet.setVelocityX(this.BULLET_SPEED);
        bullet.x += 80;
      } else if (this.shootingDirection === "front") {
        bullet.setVelocityY(this.BULLET_SPEED);
        bullet.y += 80;
      } else if (this.shootingDirection === "back") {
        bullet.setVelocityY(-this.BULLET_SPEED);
        bullet.y -= 80;
      } else if (this.shootingDirection === "left") {
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

  pauseTheGame() {
    if (this.keyESC.isDown) {
      this.game.scene.launch("Pause", { launchScene: this.game });
      this.game.scene.pause();
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
      this.progressBar = new ProgressBar([], this.game);
      this.game.scene.launch("GameOver", { launchScene: this.game });
      this.game.scene.pause();
    }
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
    if (this.changedPower) {
      this.bulletPowerSprite.setTexture(`enemy-digit-${this.bulletPower}`);
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
