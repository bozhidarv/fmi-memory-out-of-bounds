import { Sprite } from "~/services/type";
export class Health {
  sprites: Sprite[] = [];

  currentHealth = 5;
  maxHealth = 5;
  constructor(maxHealth: number, game) {
    this.currentHealth = maxHealth
    this.maxHealth = maxHealth;

    for (let i = 0; i < this.maxHealth; i++) {
      const sp = game.physics.add.sprite(
        window.innerWidth - 100 - i * 50,
        35,
        "health"
      );
      sp.scale=1.2;
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
