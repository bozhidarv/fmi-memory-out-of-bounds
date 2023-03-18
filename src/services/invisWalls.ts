import { Sprite } from "./type";

export class invWall{
    sprite: Sprite = {} as Sprite;
    game: Phaser.Scene = {} as Phaser.Scene;

    constructor(x:number,y:number,game:Phaser.Scene){
        this.sprite = game.physics.add.sprite(x, y, "invis");
        this.sprite.setVisible(false);
        this.sprite.setImmovable(true);
    }

    sizeSet(x:number,y:number):void{
        this.sprite.setSize(x,y);
    }

}