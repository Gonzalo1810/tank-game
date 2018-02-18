function NewCloud(positionX, width, height){
    
    return {
        type: "cloud",
        position: {
            x: positionX ,
            y: 50.0
        },
        speed: 20,
        image:null,
        width : width,
        height: height,
        toDelete:false,
        
        
        getPosY:function(){ return this.position.y;},
        getPosX:function(){ return this.position.x;},
        
        Start:function()
        {
            this.position.y = Math.round(Math.random() * 700);
            var randIndex = Math.round(Math.random() * 2 );
            console.log(randIndex);
            this.image = cloudsImg[randIndex];
            console.log("start");
        },
        
        Update:function(deltaTime)
        {
            this.position.x -= this.speed * deltaTime;
            
            if(this.position.x + this.width < 0)
                this.toDelete = true;
            
        },
        
        Draw:function(ctx)
        {
            var posX = this.getPosX();
            var posY = this.getPosY();
            
            ctx.save();
            ctx.drawImage(this.image, posX, posY, 250, 110);
            ctx.restore();
        }
    }
}