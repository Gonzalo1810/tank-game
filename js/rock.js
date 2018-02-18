function NewRock(x, y, width, height){

    return {
        type: "rock",
        width: width,
        height: height,
        position: {x : x, y: y},
        img: rockImg,
        imgScale: 1,

        physicsInfo: {
            density: 10,
            fixedRotation:true,
            type: b2Body.b2_kinematicBody
        },

        body: null,

        Start: function(){
            this.body = CreateBox(world, this.position.x/scale, this.position.y / scale,
                this.width, this.height, this.physicsInfo);
            this.body.SetUserData(this);
        },

        Update: function(deltaTime){
            
        },

        Draw: function(ctx){
            var bodyPosition = this.body.GetPosition();
            var posX = bodyPosition.x * scale;
            var posY = Math.abs((bodyPosition.y * scale) - ctx.canvas.height);

            ctx.save();
            ctx.translate(posX, posY);

            ctx.drawImage(this.img,
                -this.width * scale,
                -this.height * scale,
                this.width * scale * 2, this.height * scale * 2);

            ctx.restore();
        }
    }
}