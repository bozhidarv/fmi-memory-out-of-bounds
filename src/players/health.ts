import { Sprite } from "~/services/type";
export class Health {
  sprites: Sprite[] = [];

  currentHealth = 5;
  maxHealth = 5;
  constructor(game) {
    //this.sprite= game.physics.add.sprite(window.innerWidth-140,25,"health");
    for (let i = 0; i < this.maxHealth; i++) {
      const sp = game.physics.add.sprite(
        window.innerWidth - 100 - i * 20,
        25,
        "health"
      );
      sp.scale = 0.1;
      this.sprites.push(sp);
    }
  }

  loseHealth(): void {
    if (this.currentHealth === 0) {
      return;
    }
    this.currentHealth -= 1;

    const sp = this.sprites.pop();
    sp?.destroy();
  }
}
