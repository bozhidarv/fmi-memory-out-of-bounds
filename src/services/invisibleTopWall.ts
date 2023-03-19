import { Sprite } from "./type";

export class InvisibleTopWall {
  sprite: Sprite = {} as Sprite;

  constructor(height: number, game: Phaser.Scene) {
    this.sprite = game.physics.add.sprite(innerWidth / 2, height / 2, "");
    this.sprite.setSize(innerWidth, height);
    this.sprite.setVisible(false);
    this.sprite.setImmovable(true);
  }
}
