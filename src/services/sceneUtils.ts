import { BigMonster } from "~/Monsters/BigMonster";
import { SmallMonster } from "~/Monsters/SmallMonster";
import { SceneMonstersConfigT, Sprite } from "~/services/type";

export function preloadImages(game: Phaser.Scene) {
  game.load.image("background", "assets/corridor.png");
  game.load.image("small-monster", "assets/small-ram-monster-64.png");
  game.load.image("big-monster", "assets/big-ram-monster.png");
  game.load.image("enemy-sign--", "assets/enemy-sign-minus.png");
  game.load.image("enemy-sign-+", "assets/enemy-sign-plus.png");
  game.load.image("enemy-sign-*", "assets/enemy-sign-multiply.png");
  game.load.image("bullet", "assets/bullet.png");
  game.load.image("stojan", "assets/stojan.png");
  for (let index = 0; index <= 9; index++) {
    game.load.image(`enemy-digit-${index}`, `assets/enemy-digit-${index}.png`);
    game.load.image(
      `player-bullet-${index}`,
      `assets/player-bullet-${index}.png`
    );
  }
  game.load.image("health", "assets/health.png");
  game.load.image("empty-bar", "assets/mt-bar.png");
  for (let i = 1; i <= 4; i++) {
    //console.log(`mt-bar-hex-${i}`)
    game.load.image(`mt-bar-hex-${i}`, `assets/mt-bar-hex-${i}.png`);
  }
}

export function generateBackground(game: Phaser.Scene) {
  const background = game.add.image(1920 / 2, 960 / 2, "background");
  background.displayHeight = window.innerHeight;
  background.displayWidth = window.innerHeight;
  background.scale = 1;
}
