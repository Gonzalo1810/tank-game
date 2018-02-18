function NewBullet(posx, posy, disX, disY){


	return {
		type: "proyectil",
		position:{
			x: posx,
			y: posy
		},
		scale: 1.0,
		width: 0.05,
		height: 0.05,
        
        toDelete: false,

		damage: 10,
		displacement:{
			x: disX,
			y: disY
		},

		animation:{
			img: null,
			timePerFrame: 1/24,
			currentFrametime: 0,
			frameWidth: 9,
			frameHeight: 9,
			actualX: 0, 
			actualY: 0,

			Update: function(deltaTime){
				
			},

			Draw: function(ctx){
				ctx.drawImage(this.img, this.actualX, this.actualY, 
					this.frameWidth, this.frameHeight, 
					-this.frameWidth/4, -this.frameHeight/4,
					this.frameWidth, this.frameHeight);
			}
		},


		physicsInfo: {
			density: 10,
			fixedRotation: true,
			linearDamping: 1,
			type: b2Body.b2_kinematicBody
		},

		body: null,
 
		Start: function(){
			this.animation.img = bulletImg;
			this.body = CreateBox(world,
				this.position.x / scale, this.position.y / scale,
				this.width, this.height, this.physicsInfo);
            

			this.body.SetUserData(this);
			this.ApplyVelocity(new b2Vec2(this.displacement.x,this.displacement.y));
			
		},

		Update: function(deltaTime)
        {
			
		},

		Draw:function(ctx){
			var bodyPosition = this.body.GetPosition();
			var posX = bodyPosition.x * scale;
			var posY = Math.abs((bodyPosition.y * scale) - ctx.canvas.height);

			ctx.save();
			ctx.translate(posX, posY);
			ctx.rotate(this.rotation);

			this.animation.Draw(ctx);
			ctx.restore();
		},
		ApplyVelocity: function(vel){
			var bodyVel = this.body.GetLinearVelocity();
			bodyVel.Add(vel);

			//Horizontal Movement
			/*if(Math.abs(bodyVel.x)>this.maxSpeed){
				bodyVel.x = this.maxHorizontalVel * bodyVel.x / Math.abs(bodyVel.x);
			}*/

			this.body.SetLinearVelocity(bodyVel);
		}

	}

	
}

