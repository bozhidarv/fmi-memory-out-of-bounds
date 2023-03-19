import { Sprite } from "~/services/type";

export class ProgressBar {
  game: Phaser.Scene = {} as Phaser.Scene;
  lastPart: number[] = [0, 1, 2, 3];
  progress: number[] = [];

  constructor(progress: number[], game) {
    this.game = game;
    this.progress = progress;
    this.game.physics.add.image(window.innerWidth / 2, 30, "empty-bar");
  }

  setProgress(number: number) {
    this.progress.push(number);
    const index = this.lastPart.findIndex((el) => el === number);
    this.lastPart.splice(index, 1);

    this.loadProgress(number);
  }

  upgradeProgress(): void {
    const index = Math.round(Math.random() * (this.lastPart.length - 1));
    const el = this.lastPart.splice(index, 1);
    this.progress.push(el[0]);

    this.loadProgress(el[0]);

    if (this.isComplete()) {
      this.game.scene.start("BossRoom");
    }
  }

  loadProgress(number: number) {
    this.game.add.sprite(
      window.innerWidth / 2 - 70 + 60 * number,
      30,
      `mt-bar-hex-${number + 1}`
    );
  }

  isComplete(): boolean {
    return this.lastPart.length === 0;
  }
}
