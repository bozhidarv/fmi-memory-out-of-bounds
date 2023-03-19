import Phaser from "phaser";
import GameOver from "./scenes/GameOver";
import BossRoom from "./scenes/BossRoom";

import MainScene from "./scenes/MainScene";
import RoomFour from "./scenes/RoomFour";
import RoomOne from "./scenes/RoomOne";
import RoomThree from "./scenes/RoomThree";
import RoomTwo from "./scenes/RoomTwo";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  width: window.innerHeight * 2,
  physics: {
    default: "arcade", //the physics engine the game will use
    arcade: {
      debug: false,
    },
  },
  height: window.innerHeight,
  scene: [MainScene, RoomOne, GameOver, RoomTwo, RoomThree, RoomFour, BossRoom],
};

export default new Phaser.Game(config);
