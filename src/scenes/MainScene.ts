import Phaser from 'phaser'

export default class MainScene extends Phaser.Scene
{
	constructor()
	{
		super('hello-world')
	}

	preload()
    {
        this.load.image('background', 'assets/basic_background.png')
        this.load.image('logo', 'http://labs.phaser.io/assets/sprites/phaser3-logo.png')
        this.load.multiatlas('chest', 'assets/chests-assets.json', 'assets')
    }

    create()
    {
        const background = this.add.image(0, 0, 'background');
        background.setScale(5.5, 5)
        // background.displayHeight = this.game.canvas.height;
        // background.displayWidth = this.game.canvas.width;

        const chest = this.physics.add.sprite(500, 500, 'chest', 'chests.jpg');
        chest.setScale(0.5, 0.5);
        chest.body.immovable = true;
        const logo = this.physics.add.image(400, 100, 'logo');
        this.physics.add.collider(chest, logo);


        logo.setVelocity(100, 200)
        logo.setBounce(1, 1)
        logo.setCollideWorldBounds(true)
    }
}
