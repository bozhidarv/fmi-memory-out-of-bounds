import { Player } from "~/players/player";
import {
  generateEquation,
  generateMatrix,
  generateSingleDigitEq,
  MonstersT,
} from "~/services/EquationGenerator";
import { Sprite } from "~/services/type";

type BrainSprite = {
  xOffset: number;
  yOffset: number;
  sprite: Sprite;
};

const XOffset = 128 / 4 - 7;
const YOffset = 128 / 4 - 7;

class BossMonsterBody {
  mainSprite: Sprite = {} as Sprite;
  brainSprites: BrainSprite[] = [];
  constructor(x: number, y: number, equation: string, game: Phaser.Scene) {
    this.mainSprite = game.physics.add.sprite(x, y, "big-monster");

    this.brainSprites.push({
      sprite: game.physics.add.sprite(x, y, `enemy-digit-${equation[0]}`),
      xOffset: -XOffset,
      yOffset: -YOffset,
    });

    this.brainSprites.push({
      sprite: game.physics.add.sprite(x, y, `enemy-digit-${equation[1]}`),
      xOffset: XOffset,
      yOffset: -YOffset,
    });

    this.brainSprites.push({
      sprite: game.physics.add.sprite(x, y, `enemy-digit-${equation[2]}`),
      xOffset: -XOffset,
      yOffset: YOffset,
    });

    this.brainSprites.push({
      sprite: game.physics.add.sprite(x, y, `enemy-digit-${equation[3]}`),
      xOffset: XOffset,
      yOffset: YOffset,
    });
  }

  move(player: Player, game: Phaser.Scene, speed: number): void {
    game.physics.moveToObject(this.mainSprite, player.sprite, speed);
    this.brainSprites.forEach((part) => {
      part.sprite.x = this.mainSprite.x + part.xOffset;
      part.sprite.y = this.mainSprite.y + part.yOffset;
    });
  }

  destroy() {
    this.brainSprites.forEach((part) => {
      part.sprite.destroy();
    });
    this.mainSprite.destroy();
  }
}

export class BossMonster {
  speed = 20;

  body: BossMonsterBody = {} as BossMonsterBody;
  game: Phaser.Scene = {} as Phaser.Scene;

  x: number = 0;
  y: number = 0;

  hearts = 3;

  equation: string = "";
  lives: number[] = [];

  constructor(x: number, y: number, game: Phaser.Scene) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.generateBody();
  }

  generateBody() {
    const gen = generateMatrix(2);

    this.equation = gen.equation;
    this.lives = gen.answer;

    this.body = new BossMonsterBody(this.x, this.y, gen.equation, this.game);
  }

  destroy() {
    this.body.destroy();
  }

  checkIfAlive() {
    const isStageClear = this.checkIfStageIsClear();
    if (isStageClear) {
      if (this.hearts === 0) {
        return { isStageClear, isAlive: false };
      }

      this.destroy();
      this.generateBody();
    }
    return { isStageClear, isAlive: true };
  }

  checkIfStageIsClear() {
    if (!this.lives.length) {
      this.hearts--;
      this.x = this.body.mainSprite.x;
      this.y = this.body.mainSprite.y;
      return true;
    }
    return false;
  }

  hit(digit: number) {
    const currDigit = this.lives.pop();

    if (digit === currDigit) {
      return this.checkIfAlive();
    } else {
      this.lives.push(currDigit ?? 0);
      this.speed += this.speed / 10;
      return { isStageClear: false, isAlive: true };
    }
  }

  move(player: Player, game: Phaser.Scene): void {
    this.body.move(player, game, this.speed);
  }
}
