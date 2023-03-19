import { Sprite } from "~/services/type";
import { ProgressBar } from "./progres";
import { Player } from "./player";

export class Fss{
    player: Player= {} as Player;
    sprite:Sprite = {} as Sprite;
    game: Phaser.Scene = {} as Phaser.Scene;
    progress: ProgressBar ={} as ProgressBar;

    constructor(x:number,y:number,game,player){
        console.log("constr")
        this.player=player;
        this.game=game;
        this.sprite=game.physics.add.sprite(x,y,"fss");
        this.sprite.setImmovable(true);

    }
    isNearPlayer():void{

        if((this.player.sprite.body.position.x>this.sprite.body.position.x-100 &&this.player.sprite.body.position.x<this.sprite.body.position.x+100) &&
        (this.player.sprite.body.position.y<this.sprite.body.position.y+100))
        {
            this.giveQuest();
        }
    }

    giveQuest():void {
        console.log("ddz");

    }
}