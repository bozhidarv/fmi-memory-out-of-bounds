

const player= this.physics.add.sprite(50,200,'boco');
player.setCollideWorldBounds(true);

//this.load.spritesheet('boco',"",{ frameWidth: 32, frameHeight: 48 })

this.anims.create({
    key: "left"

});
this.anims.create({
    key: "right"

});
this.anims.create({
    key: "up"

});
this.anims.create({
    key: "down"

});