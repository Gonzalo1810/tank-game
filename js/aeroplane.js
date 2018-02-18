function NewAeroplane(positionX, width, height)
{
     return {
        type: "aeroplane",
        position: {
            x: positionX ,
            y: 0
        },
        speed: 90.0,
        image:planeImg,
        width : width,
        height: height,
        toDelete:false,
        
        
        getPosY:function(){ return this.position.y;},
        getPosX:function(){ return this.position.x;},
        
        Start:function()
        {
            this.position.y = Math.round(Math.random() * 700);
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
            ctx.drawImage(this.image, posX, posY, this.width, this.height);
            ctx.restore();
        }
    }
}
