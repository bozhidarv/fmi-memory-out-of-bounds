import { Player } from "~/players/player";
import { generateSingleDigitEq, MonstersT } from "~/services/EquationGenerator";
import { Sprite } from "~/services/type";

class MonsterBody {
  mainSprite: Sprite = {} as Sprite;
  brainSprite: Sprite = {} as Sprite;
  constructor(x: number, y: number, digits: string, game: Phaser.Scene) {
    this.mainSprite = game.physics.add.sprite(x, y, "small-monster");
    this.brainSprite = game.physics.add.sprite(x, y, `enemy-${digits}`);
  }

  move(player: Player, game: Phaser.Scene, speed: number): void {
    game.physics.moveToObject(this.mainSprite, player.sprite, speed);
    this.brainSprite.x = this.mainSprite.x;
    this.brainSprite.y = this.mainSprite.y;
  }
}

export class Monster {
  SPEED = 50;

  body: MonsterBody = {} as MonsterBody;

  equation: string = "";
  lives: number[] = [];

  constructor(x: number, y: number, game: Phaser.Scene) {
    // const gen = generateSingleDigitEq();

    const gen: MonstersT = { equation: "0", answer: [0] };
    this.equation = gen.equation;
    this.lives = gen.answer;

    this.body = new MonsterBody(x, y, gen.equation, game);
  }

  move(player: Player, game: Phaser.Scene): void {
    this.body.move(player, game, this.SPEED);
  }
}
