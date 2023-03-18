import { Player } from "~/players/player";
import {
  generateEquation,
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

class BigMonsterBody {
  mainSprite: Sprite = {} as Sprite;
  brainSprites: BrainSprite[] = [];
  constructor(
    x: number,
    y: number,
    equation: string,
    index: number,
    game: Phaser.Scene
  ) {
    this.mainSprite = game.physics.add.sprite(x, y, "big-monster");
    this.mainSprite.name = `big-${index}`;

    this.brainSprites.push({
      sprite: game.physics.add.sprite(x, y, `enemy-sign-${equation[2]}`),
      xOffset: 0,
      yOffset: 0,
    });

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
      sprite: game.physics.add.sprite(x, y, `enemy-digit-${equation[3]}`),
      xOffset: -XOffset,
      yOffset: YOffset,
    });

    this.brainSprites.push({
      sprite: game.physics.add.sprite(x, y, `enemy-digit-${equation[4]}`),
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

export class BigMonster {
  speed = 50;

  body: BigMonsterBody = {} as BigMonsterBody;

  equation: string = "";
  lives: number[] = [];

  constructor(x: number, y: number, index: number, game: Phaser.Scene) {
    const gen = generateEquation(2);

    this.equation = gen.equation;
    this.lives = gen.answer;

    this.body = new BigMonsterBody(x, y, gen.equation, index, game);
  }

  destroy() {
    this.body.destroy();
  }

  checkIfAlive() {
    if (!this.lives.length) {
      this.destroy();
      return false;
    }
    return true;
  }

  hit(digit: number) {
    const currDigit = this.lives.pop();
    if (digit === currDigit) {
      return this.checkIfAlive();
    } else {
      this.lives.push(currDigit ?? 0);
      this.speed += this.speed / 10;
      return true;
    }
  }

  move(player: Player, game: Phaser.Scene): void {
    this.body.move(player, game, this.speed);
  }
}
