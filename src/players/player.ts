import {CursorT, Sprite } from "~/services/type";
export class Player{
    SPEED=100;
    DRAG =200;
    BULLET_SPEED = 300;
    sprite: Sprite = {} as Sprite;
    cursor: CursorT = { }as CursorT;
    game: Phaser.Scene = {} as Phaser.Scene;

    constructor(x:number,y:number,game:Phaser.Scene) {
        this.sprite=game.physics.add.sprite(x,y,"player");
        this.cursor = game.input.keyboard.createCursorKeys();
        this.sprite.setCollideWorldBounds(true);
        this.game = game;
    }

    move ():void {

        if(this.cursor.left.isDown){
            this.sprite.setVelocityX(-this.SPEED);    

        }else{
            this.sprite.setDragX(-this.DRAG);
        }
        
        if(this.cursor.right.isDown){
            this.sprite.setVelocityX(this.SPEED)
        }else{
            this.sprite.setDragX(this.DRAG);
        }

            
         if(this.cursor.up.isDown){
            this.sprite.setVelocityY(-this.SPEED);          
        }else{
            this.sprite.setDragY(-this.DRAG);
        }
        
        if(this.cursor.down.isDown){
            this.sprite.setVelocityY(this.SPEED);
        }else{
            this.sprite.setDragY(this.DRAG);
        }
    }

    shoot(): void {
        if(this.cursor.space.isDown) {
            const bullet = this.game.physics.add.sprite(this.sprite.x, this.sprite.y, 'bullet');
            bullet.displayHeight = 10;
            bullet.displayWidth = 30;

            this.sprite.body.velocity.x < 0 ? bullet.setVelocityX(-this.BULLET_SPEED) : bullet.setVelocityX(this.BULLET_SPEED);
            this.sprite.body.velocity.y < 0 ? bullet.setVelocityY(-this.BULLET_SPEED) : bullet.setVelocityY(this.BULLET_SPEED);
        }
    }

    animation():void{

    }

}