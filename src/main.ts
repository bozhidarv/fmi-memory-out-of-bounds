import Phaser from 'phaser'

import MainScene from './scenes/MainScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.CANVAS,
	width: window.innerHeight*2,
	physics: {
		default: 'arcade', //the physics engine the game will use
		arcade: {
			debug: false
		}
	},
	height: window.innerHeight,
	scene: [MainScene],
}

export default new Phaser.Game(config)
