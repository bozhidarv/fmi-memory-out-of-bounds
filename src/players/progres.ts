import{ Sprite } from "~/services/type";

export class ProgressBar {

    game:Phaser.Scene = {} as Phaser.Scene;
    lastPart: number[] = [1,2,3,4]
    sprite:Sprite = {} as Sprite
    //maxProgress=4;
    
    constructor(game) {
        
        //this.game.physics.add.image(40,30,"empty-bar");
        //this.game=game;
        //const bar= game.physics.add.sprite(window.innerWidth+10+20,window.innerHeight-40,"bar");
    }

    upgradeProgress():boolean{
    
        const index=Math.round(Math.random()*this.lastPart.length);
        const el = this.lastPart.splice(index,1);
        this.game.physics.add.sprite(
            window.innerWidth+20+20*el[0],
            window.innerHeight-40,
            `bar-${el}`);

       return this.isComplete();
    }

    isComplete():boolean{
        return (this.lastPart.length===0);
    }
}