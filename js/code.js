
var canvas;
var ctx;

var pi_2 = Math.PI * 2;

var fixedDeltaTime = 0.01666666; // 60fps: 1 frame each 16.66666ms
var deltaTime = fixedDeltaTime;

var time = 0,
    FPS  = 0,
    frames    = 0,
    acumDelta = 0;

var timer = null;

var paused = false;
var victory = false;
var extraTime = false;

var tankImg, tankImg2, bulletImg, rockImg, floorImg;
var greenBarImg, blueBarImg, healthImg, borderImg;
var circleImg;
var tank, tank2;

var bullets = [];
var bullets2 = [];
var rocks = [];

var pushed = false;

var score = 
{
    player1 : 0,
    player2 : 0
}

var sounds = {
    fire: null,
    hit: null
}

function Init ()
{
    // preparamos la variable para el refresco de la pantalla
    window.requestAnimationFrame = (function (evt) {
        return window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, fixedDeltaTime * 1000);
            };
    }) ();

    canvas = document.getElementById("my_canvas");
    sounds.fire = document.getElementById('sound_fire');
    sounds.hit = document.getElementById('sound_hit');
    
    if (canvas.getContext)
    {
        ctx = canvas.getContext('2d');

        tankImg = new Image();
        tankImg.src = "./media/spritetank.png";
        tankImg2 = new Image();
        tankImg2.src = "./media/spritetank2.png";
        bulletImg = new Image();
        bulletImg.src = "./media/spriteproyectil.png";
        rockImg = new Image();
        rockImg.src = "./media/spriterock.png";

        floorImg = new Image();
        floorImg.src = "./media/floorTexture.jpg";
        
        greenBarImg = new Image();
        greenBarImg.src = "./media/healthGreen.png";
        
        blueBarImg = new Image();
        blueBarImg.src = "./media/healthBlue.png";
        
        healthImg = new Image();
        healthImg.src = "./media/health.png";
        
        borderImg = new Image();
        borderImg.src = "./media/recuadro.png";
        
        circleImg = new Image();
        circleImg.src = "./media/circle.png";

        tankImg.onload = Start();

    }
}

function Start()
{
        // setup keyboard events
        SetupKeyboardEvents();

        // setup mouse events
        SetupMouseEvents();

        PreparePhysics(ctx);

        StartRocks();
        
        RestartGame();
    
        // first call to the game loop
        Loop();
    
        //startTimer(timer, document.querySelector('#time'));
}

function RestartGame()
{
    victory = false;
    
    this.score.player1 = 0;
    this.score.player2 = 0;
    
    restart();
}

function restart()
{
        extraTime = false;
        this.timer = 3;
        
        this.tank = NewTank(230,230, tankImg);
        tank.Start();
        this.tank2 = NewTank(400,400, tankImg2);
        tank2.Start();
    
        this.bullets.splice(0, bullets.length);
        this.bullets2.splice(0, bullets2.length);
}

function Loop ()
{
    requestAnimationFrame(Loop);

    var now = Date.now();
    deltaTime = now - time;
    if (deltaTime > 1000)
    {
        // si el tiempo es mayor a 1 seg: se descarta
        deltaTime = 0;
    }
    time = now;
    

    frames++;
    acumDelta += deltaTime;

    if (acumDelta > 1000)
    {
        if(!paused && !extraTime)
            timer--;
        FPS = frames;
        frames = 0;
        acumDelta -= 1000;
    }
    
    // transform the deltaTime from miliseconds to seconds
    deltaTime /= 1000;

    // Game logic -------------------
    Update();

    // Draw the game ----------------
    Draw();
}

function Update ()
{
    input.update();

    if(!victory)
    {
        // update physics
        world.Step(deltaTime, 8, 3);
        world.ClearForces();

        CheckTime();

        CheckHealth();

        CheckVictory();

        UpdateInput();  

        UpdateBullets();
        
        //-----------------------------------------------------
    
       if(!paused)
           {
               tank.Update(deltaTime);
                tank2.Update(deltaTime);

                for(var i = 0;i<bullets.length;i++){
                    
                    if(bullets[i].toDelete){
                        world.DestroyBody(bullets[i].body);
                        bullets.splice(i,1);
                    }else {
                        bullets[i].Update();
                    }
                }

                for(var i = 0;i<bullets2.length;i++){
                    bullets2[i].Update();
                    if(bullets2[i].toDelete){
                        world.DestroyBody(bullets2[i].body);
                        bullets2.splice(i,1);
                    }else {
                        bullets2[i].Update();
                    }
                }
           }
    }
    else
    {
       if(input.isKeyPressed(KEY_ENTER)){
            world.DestroyBody(this.tank.body);
            world.DestroyBody(this.tank2.body);
           
            for(var i = 0;i< bullets.length;i++)
            {
                world.DestroyBody(bullets[i].body);
                bullets.splice(i,1);
            }
                
            for(var i = 0;i< bullets2.length;i++)
            {
                world.DestroyBody(bullets2[i].body);
                bullets2.splice(i,1);
            }
           
           RestartGame();
       } 
    }
    
}

function StartRocks()
{
    var rock1 = NewRock(150,150, 0.2,0.2);
    rocks.push(rock1);
    var rock2 = NewRock(150,320, 0.2,0.2);
    rocks.push(rock2);
    var rock3 = NewRock(150,490, 0.2,0.2);
    rocks.push(rock3);
    var rock4 = NewRock(320,150, 0.2,0.2);
    rocks.push(rock4);
    var rock5 = NewRock(320,320, 0.2,0.2);
    rocks.push(rock5);
    var rock6 = NewRock(320,490, 0.2,0.2);
    rocks.push(rock6);
    var rock7 = NewRock(490,150, 0.2,0.2);
    rocks.push(rock7);
    var rock8 = NewRock(490,320, 0.2,0.2);
    rocks.push(rock8);
    var rock9 = NewRock(490,490, 0.2,0.2);
    rocks.push(rock9);

    var rock10 = NewRock(0,400, 0.1,8);
    rocks.push(rock10);
    var rock11 = NewRock(400,0,4, 0.1);
    rocks.push(rock11);
    var rock12 = NewRock(640,100,0.1, 8);
    rocks.push(rock12);
    var rock13 = NewRock(400,640, 4, 0.1);
    rocks.push(rock13);

    for(var i=0;i<rocks.length;i++){
        rocks[i].Start();
    }
}

function UpdateInput()
{

    /*
    if(input.isKeyUp(KEY_P)) pushed = false;
    if(input.isKeyPressed(KEY_P) && !pushed) 
        {
            pushed = true;
            paused = !paused;
            console.log("pause "+ paused);
        }
    */
    
    if (input.isKeyPressed(KEY_UP))
    {
        tank.moving = true;
        tank.rotation = 0;
    }
    else if (input.isKeyPressed(KEY_DOWN))
    {
        tank.moving = true;
        tank.rotation = Math.PI;
    }
    else if (input.isKeyPressed(KEY_LEFT))
    {
        tank.moving = true;
        tank.rotation = -Math.PI/2;
    }
    else if (input.isKeyPressed(KEY_RIGHT))
    {
        tank.moving = true;
        tank.rotation = Math.PI/2;
    }
    else{
        tank.moving = false;
    }


     if(input.isKeyPressed(KEY_SPACE))
    {
        Fire(tank2, bullets2);
    }
     if(input.isKeyPressed(KEY_ENTER))
    {
        Fire(tank, bullets);
    }



    if (input.isKeyPressed(KEY_W))
    {
        tank2.moving = true;
        tank2.rotation = 0;
    }
    else if (input.isKeyPressed(KEY_S))
    {
        tank2.moving = true;
        tank2.rotation = Math.PI;
    }
    else if (input.isKeyPressed(KEY_A))
    {
        tank2.moving = true;
        tank2.rotation = -Math.PI/2;
    }
    else if (input.isKeyPressed(KEY_D))
    {
        tank2.moving = true;
        tank2.rotation = Math.PI/2;
    }else
    {
        tank2.moving = false;
    }
}

function CheckTime()
{
    if(timer <= 0)
    {
        if(tank.health != tank2.health)
        {
                tank.health < tank2.health ? 
                    score.player2++ : 
                    score.player1++;
            
                world.DestroyBody(this.tank.body);
                world.DestroyBody(this.tank2.body);

                for(var i = 0;i< bullets.length;i++)
                    bullets[i].toDelete = true;
                for(var i = 0;i< bullets2.length;i++)
                    bullets2[i].toDelete = true;
            
                restart();
        }else
        {
            extraTime = true;
            timer = '-:-';
        }
    }
}

function CheckHealth()
{
    if(tank.health <= 0)
    {
        this.score.player2++;
        world.DestroyBody(this.tank.body);
        world.DestroyBody(this.tank2.body);
        for(var i = 0;i< bullets.length;i++)
            {
                world.DestroyBody(bullets[i].body);
                bullets.splice(i,1);
            }
                
            for(var i = 0;i< bullets2.length;i++)
            {
                world.DestroyBody(bullets2[i].body);
                bullets2.splice(i,1);
            }
        restart();
    }
    if(tank2.health <= 0)
    {
        this.score.player1++;
        world.DestroyBody(this.tank.body);
        world.DestroyBody(this.tank2.body);
        for(var i = 0;i< bullets.length;i++)
            bullets[i].toDelete = true;
        for(var i = 0;i< bullets2.length;i++)
            bullets2[i].toDelete = true;
        restart();
    }
}

function CheckVictory()
{
    if(score.player1 ==3 || score.player2 == 3)
        {
            victory = true;
        }
}

function UpdateBullets()
{
    for(var i = 0; i < bullets.length;i++)
    {
        if(bullets[i].body.GetPosition().x < 0 ||  
           bullets[i].body.GetPosition().x > canvas.width / 100 ||
           bullets[i].body.GetPosition().y < 0 ||
           bullets[i].body.GetPosition().y > canvas.height /100)
            {
                bullets[i].toDelete = true;
            }
    }
    for(var i = 0; i < bullets2.length;i++)
    {
        if(bullets2[i].body.GetPosition().x < 0 ||  
           bullets2[i].body.GetPosition().x > canvas.width / 100 ||
           bullets2[i].body.GetPosition().y < 0 ||
           bullets2[i].body.GetPosition().y > canvas.height / 100)
            {
                bullets2[i].toDelete = true;
            }
    }
}

function Draw ()
{
    // clean the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    // draw the world
    DrawWorld(world);

    // draw the background
    DrawBackground();



    for(var i=0;i<rocks.length;i++){
        rocks[i].Draw(ctx);
    }

    for(var i = 0;i<bullets.length;i++){
        if(!bullets[i].toDelete)
            bullets[i].Draw(ctx);
    }
    for(var i = 0;i<bullets2.length;i++){
        if(!bullets2[i].toDelete)
            bullets2[i].Draw(ctx);
    }


    tank.Draw(ctx);
    tank2.Draw(ctx);
    
    DrawHealthBars();
    DrawCircles();
    DrawTime();
    
    if(victory)
        DrawVictory();
    
    
    // draw the FPS
    ctx.fillStyle = "white";
    ctx.fillText('FPS: ' + FPS, 12, 20);
    ctx.fillText('deltaTime: ' + Math.round(1 / deltaTime), 12, 30);
    ctx.fillText('total bodys: ' + world.GetBodyCount(), 12, 40);

}

function DrawBackground ()
{
    ctx.save();
    ctx.translate(0.0, 0.0);
    ctx.scale(1.0, 1.0);
    ctx.drawImage(floorImg, 0,0, 700, 700);
    ctx.restore();
}

function DrawHealthBars()
{
    ctx.save();
    ctx.scale(-1,1);
    ctx.drawImage(greenBarImg, -280,570, 
                  250 * tank.health / 100, 
                  30);
    ctx.drawImage(borderImg, -284,570, 
                  260, 
                  30);
    ctx.restore();
    
    ctx.save();
    ctx.drawImage(blueBarImg, 360,570,
                  250 * tank2.health / 100, 
                  30);
    
    ctx.drawImage(borderImg, 356,570, 
                  260,
                  30);
    ctx.restore();
}

function DrawCircles()
{
    if(score.player1 == 1)
        {
            ctx.save();
            ctx.drawImage(circleImg, 250,605, 
                  20, 20 );
            ctx.restore();
        }
    else if(score.player1 == 2)
        {
            ctx.save();
            ctx.drawImage(circleImg, 250,605, 
                  20, 20 );
            ctx.restore();
            ctx.save();
            ctx.drawImage(circleImg, 220,605, 
                  20, 20 );
            ctx.restore();
        }
    
    //-----------------------------------------------------------
    
    if(score.player2 == 1)
        {
            ctx.save();
            ctx.drawImage(circleImg, 250,605, 
                  20, 20 );
            ctx.restore();
        }
    else if(score.player2 == 2)
        {
            ctx.save();
            ctx.drawImage(circleImg, 370,605, 
                  20, 20 );
            ctx.restore();
            ctx.save();
            ctx.drawImage(circleImg, 400,605, 
                  20, 20 );
            ctx.restore();
        }
}

function DrawWorld (world)
{
    // Transform the canvas coordinates to cartesias coordinates
    ctx.save();
    ctx.translate(0, canvas.height);
    ctx.scale(1, -1);
    world.DrawDebugData();
    ctx.restore();
}

function DrawTime()
{
    ctx.save();
    ctx.fillStyle = "white";
    ctx.font = "30px Verdana";
    ctx.fillText("" + timer, 300, 595);
    ctx.restore();
}

function DrawVictory()
{
    var color = score.player1 ==3? 'verde' : 'azul';
    
    ctx.save();
    ctx.fillStyle = "white";
    ctx.font = "40px Verdana";
    ctx.fillText('¡Gana el jugador ' + color + '!', 80,80);
    
    ctx.fillStyle = "white";
    ctx.font = "20px Verdana";
    ctx.fillText('Pulsa ENTER para reiniciar', 180,110);
    ctx.restore();
}

function Fire(vehicle, bulletArray)
{
    if((Date.now() - vehicle.lastShotTime) > vehicle.cadency)
    {
        var disX,disY;
        var posx, posY;
        switch(vehicle.rotation){
                        case 0:
                            disX =0;
                            disY = 3;
                            posX = 0;
                            posY = 30;
                            break;
                        case Math.PI:
                            disX =0;
                            disY = -3;
                            posX = 0; 
                            posY = -30;
                            break;
                        case -Math.PI/2:
                            disX =-3;
                            disY = 0;
                            posX = -30;
                            posY = 0;  
                            break;
                        case Math.PI/2:
                            disX =3;
                            disY = 0;
                            posX = 30;
                            posY = 0;
                            break;  
                    }

        var shot = NewBullet(vehicle.position.x*100 + posX,
                            vehicle.position.y*100 + posY,
                            disX,disY);
        shot.Start();

        bulletArray.push(shot);
        
        vehicle.lastShotTime = Date.now();
        
        sounds.fire.currentTime = 0;
        sounds.fire.play();

    }
    
    
}
