import{ Sprite } from "~/services/type";

export class ProgressBar {

    game:Phaser.Scene = {} as Phaser.Scene;
    lastPart: number[] = [0,1,2,3]
    sprite:Sprite = {} as Sprite
    //maxProgress=4;
    
    constructor(game) {
        this.game = game;
        this.game.physics.add.image(window.innerWidth/2-80,30,"empty-bar");
        //const bar= game.physics.add.sprite(window.innerWidth+10+20,window.innerHeight-40,"bar");
    }

    upgradeProgress():void{
    
        const index=Math.round(Math.random()*(this.lastPart.length-1));
        const el = this.lastPart.splice(index,1);
        //console.log(`mt-bar-hex-${el[0]}`)
        this.game.physics.add.sprite(
            window.innerWidth/2-150+60*el[0],
            30,
            `mt-bar-hex-${el[0]+1}`);
        
        
        return;

       //return this.isComplete();
    }

    isComplete():boolean{
        return (this.lastPart.length===0);
    }
}