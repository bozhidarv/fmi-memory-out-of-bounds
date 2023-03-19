import { Sprite } from "~/services/type";
import { ProgressBar } from "./progres";
import { Player } from "./player";

export class Fss {
  FSS_BOUNDS_SIZE = 150;
  sprite: Sprite = {} as Sprite;
  game: Phaser.Scene = {} as Phaser.Scene;
  progress: ProgressBar = {} as ProgressBar;

  constructor(x: number, y: number, game) {
    this.game = game;
    this.sprite = game.physics.add.sprite(x, y, "fss");
    this.sprite.setImmovable(true);
  }
  isNearPlayer(
    isGivenQuest: boolean,
    moveBack: () => void,
    isClear: boolean,
    player: Player
  ): void {
    if (
      player.sprite.body.position.x >
        this.sprite.body.position.x - this.FSS_BOUNDS_SIZE &&
      player.sprite.body.position.x <
        this.sprite.body.position.x + this.FSS_BOUNDS_SIZE &&
      player.sprite.body.position.y <
        this.sprite.body.position.y + this.FSS_BOUNDS_SIZE &&
      player.sprite.body.position.y >
        this.sprite.body.position.y - this.FSS_BOUNDS_SIZE &&
      isClear
    ) {
      this.giveQuest(isGivenQuest, moveBack, player);
    }
  }

  giveQuest(isGivenQuest: boolean, moveBack: () => void, player: Player): void {
    if (!isGivenQuest) {
      player.progressBar.upgradeProgress();
    }
    moveBack();
  }
}
