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
  game.load.image("stojan-front", "assets/stojan-front.png");
  game.load.image("stojan-back", "assets/stojan-back.png");
  game.load.image("stojan-right", "assets/stojan-right.png");
  game.load.image("stojan-left", "assets/stojan-left.png");
  for (let index = 0; index <= 9; index++) {
    game.load.image(`enemy-digit-${index}`, `assets/enemy-digit-${index}.png`);
    game.load.image(
      `bullet-${index}`,
      `assets/player-bullet-${index}.png`
    );
  }
  game.load.image("health", "assets/health.png");
  game.load.image("empty-bar", "assets/mt-bar.png");
  for (let i = 1; i <= 4; i++) {
    game.load.image(`mt-bar-hex-${i}`, `assets/mt-bar-hex-${i}.png`);
  }
  game.load.image("fss","assets/fss-mage.png");
}

export function generateBackground(game: Phaser.Scene) {
  const background = game.add.image(0, 0, "background");
  background.setOrigin(0, 0);
  background.width = window.innerWidth;
  background.height = window.innerHeight;
}
