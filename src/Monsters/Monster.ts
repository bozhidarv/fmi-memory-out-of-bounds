import { generateSingleDigitEq } from "~/services/EquationGenerator";
import { Sprite } from "~/services/type";

export class Monster {
  SPEED = 100;
  sprite: Sprite = {} as Sprite;

  equation: string = "";
  lives: number[] = [];

  constructor(x: number, y: number, game: Phaser.Scene) {
    const gen = generateSingleDigitEq();
    this.equation = gen.equation;
    this.lives = gen.answer;

    this.sprite = game.physics.add.sprite(x, y, "monster");
  }

  move(spriteToFollow: Sprite, game: Phaser.Scene): void {
    game.physics.moveToObject(this.sprite, spriteToFollow, this.SPEED);
  }
}
