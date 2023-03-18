import Phaser from 'phaser'

import MainScene from './scenes/MainScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: window.innerHeight*2,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	},
	height: window.innerHeight,
	scene: [MainScene],
}

export default new Phaser.Game(config)
