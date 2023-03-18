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
        this.load.image('boco','assets/slavii.jpg')
    }

    create()
    {
        const background = this.add.image(0, 0, 'background')
        background.displayHeight = window.innerHeight*2;
        background.displayWidth = window.innerHeight*4;

        const logo = this.physics.add.image(400, 100, 'logo')

        //player
        const player= this.physics.add.sprite(50,200,'boco');
        player.setCollideWorldBounds(true);
        player.setGravity(0);

        const cursor = this.input.keyboard.createCursorKeys();

        if(cursor.left.isDown){
            player.setVelocityX(-200);
        }else if(cursor.right.isDown){
            player.setVelocityX(200);
        }else if(cursor.up.isDown){
            player.setVelocity(200);
        }else if(cursor.down.isDown){
            player.setVelocity(-200);

        }



        logo.setVelocity(100, 200)
        logo.setBounce(1, 1)
        logo.setCollideWorldBounds(true)

    }

    // update (time: number, delta: number)
    // {
    //
    // }
}
