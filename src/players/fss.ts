import { Sprite } from "~/services/type";
import { ProgressBar } from "./progres";
import { Player } from "./player";

export class Fss {
  FSS_BOUNDS_SIZE = 150;
  player: Player = {} as Player;
  sprite: Sprite = {} as Sprite;
  game: Phaser.Scene = {} as Phaser.Scene;
  progress: ProgressBar = {} as ProgressBar;

  constructor(x: number, y: number, game, player) {
    this.player = player;
    this.game = game;
    this.sprite = game.physics.add.sprite(x, y, "fss");
    this.sprite.setImmovable(true);
  }
  isNearPlayer(): void {
    if (
      this.player.sprite.body.position.x > this.sprite.body.position.x - this.FSS_BOUNDS_SIZE &&
      this.player.sprite.body.position.x < this.sprite.body.position.x + this.FSS_BOUNDS_SIZE &&
      this.player.sprite.body.position.y < this.sprite.body.position.y + this.FSS_BOUNDS_SIZE &&
      this.player.sprite.body.position.y > this.sprite.body.position.y - this.FSS_BOUNDS_SIZE
    ) {
      this.giveQuest();
    }
  }

  giveQuest(): void {
    this.player.progressBar.upgradeProgress();
    this.sprite.destroy();
  }
}
