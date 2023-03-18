export class Health{
    
    currentHealth = 5;
    maxHealth =5;

    loseHealth():void {

        if(this.currentHealth===0){
            return;
        }
        this.currentHealth-=1;
    }
}