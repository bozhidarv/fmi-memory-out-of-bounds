import { Player } from "~/players/player";
import { generateSingleDigitEq, MonstersT } from "~/services/EquationGenerator";
import { Sprite } from "~/services/type";

class SmallMonsterBody {
  mainSprite: Sprite = {} as Sprite;
  brainSprite: Sprite = {} as Sprite;
  constructor(
    x: number,
    y: number,
    digits: string,
    index: number,
    game: Phaser.Scene
  ) {
    this.mainSprite = game.physics.add.sprite(x, y, "small-monster");
    this.mainSprite.name = index.toString();
    this.brainSprite = game.physics.add.sprite(x, y, `enemy-digit-${digits}`);
  }

  move(player: Player, game: Phaser.Scene, speed: number): void {
    game.physics.moveToObject(this.mainSprite, player.sprite, speed);
    this.brainSprite.x = this.mainSprite.x;
    this.brainSprite.y = this.mainSprite.y;
  }

  destroy() {
    this.brainSprite.destroy();
    this.mainSprite.destroy();
  }
}

export class SmallMonster {
  speed = 50;

  body: SmallMonsterBody = {} as SmallMonsterBody;

  equation: string = "";
  lives: number[] = [];

  constructor(x: number, y: number, index: number, game: Phaser.Scene) {
    const gen = generateSingleDigitEq();

    this.equation = gen.equation;
    this.lives = gen.answer;

    this.body = new SmallMonsterBody(x, y, gen.equation, index, game);
  }

  destroy() {
    this.body.destroy();
  }

  checkIfAlive() {
    if (this.lives.length) {
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
