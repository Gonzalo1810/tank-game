function NewTank(x,y, imageP){


	return {
		type: "player",
		position:{
			x: x,
			y: y
		},
		scale: 1.0,
		width: 0.2,
		height: 0.2,
        health: 100,
        
        lastShotTime: 0,
        cadency: 700,     

		rotation: 0.0,

		speed:0.0,
		maxSpeed:3,
		moving: false,
		scale:1,

		animation:{
			img: null,
			timePerFrame: 1/24,
			currentFrametime: 0,
			frameWidth: 39.71,
			frameHeight: 39,
			actualX: 0,
			actualY: 0,

			Update: function(deltaTime){
				
				this.currentFrametime += deltaTime;
					if(this.currentFrametime >= this.timePerFrame)
					{
							this.actualX+=this.frameWidth;
						if(this.actualX > 278-this.frameWidth){
							this.actualX = 0;
						}
						this.currentFrametime = 0.0;
					}
				
				
			},

			Draw: function(ctx){
				ctx.drawImage(this.img, this.actualX, this.actualY, 
					this.frameWidth, this.frameHeight, 
					-this.frameWidth/2, -this.frameHeight/2,
					this.frameWidth, this.frameHeight);
			}
		},

		physicsInfo: {
			density: 0.5,
			fixedRotation: true,
			friction: 20,			
			linearDamping: 20,
            angularDamping: 50,
			user_data: tank,
			type: b2Body.b2_dynamicBody,
			restitution: 0.0
		},

		body: null,

		Start: function(){
			this.animation.img = imageP;

			this.body = CreateBox(world,
				this.position.x / scale, this.position.y / scale,
				this.width, this.height, this.physicsInfo);
			

			this.body.SetUserData(this);
		},
 
		Update: function(deltaTime){
			
				
			if(this.moving){
				this.animation.Update(deltaTime);
				switch(this.rotation){
					case 0:
						this.ApplyVelocity(new b2Vec2(0,1));
						break;
					case Math.PI:
						this.ApplyVelocity(new b2Vec2(0,-1));
						break;
					case -Math.PI/2:
						this.ApplyVelocity(new b2Vec2(-1,0));
						break;
					case Math.PI/2:
						this.ApplyVelocity(new b2Vec2(1,0));
						break;	
				}
				
			}

			this.position = this.body.GetPosition();
			
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

		ApplyVelocity: function(sp){
			var bodyVel = this.body.GetLinearVelocity();
			bodyVel.Add(sp);

			if(Math.abs(bodyVel.x) > this.maxSpeed){
				bodyVel.x = this.maxSpeed * bodyVel.x /  Math.abs(bodyVel.x);
			}
			if(Math.abs(bodyVel.y) > this.maxSpeed){
				bodyVel.y = this.maxSpeed * bodyVel.y /  Math.abs(bodyVel.y);
			}
			
			this.body.SetLinearVelocity(bodyVel);
		}
	}

	
}

    