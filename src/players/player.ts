import {CursorT, Sprite } from "~/services/type";
export class Player{
    sprite: Sprite = {} as Sprite;
    cursor: CursorT = { }as CursorT;
    constructor(x:number,y:number,game:Phaser.Scene){
        this.sprite=game.physics.add.sprite(x,y,"player");
        this.cursor = game.input.keyboard.createCursorKeys();
        this.sprite.setCollideWorldBounds(true);
    }

    move ():void {

        if(this.cursor.left.isDown){
            this.sprite.setVelocityX(-100);

        }else if(this.cursor.right.isDown){
            this.sprite.setVelocityX(100);

            
        }else if(this.cursor.up.isDown){
            this.sprite.setVelocityY(-100);

            
        }else if(this.cursor.down.isDown){
            this.sprite.setVelocityY(100);
        }
    }

    animation():void{

    }

}