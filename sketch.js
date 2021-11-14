var sky,plane,fuel,bird;
var skyImg,planeImg,fuelImg,birdImg,plane2Img, gameOverImg;
var fuelCollection=0;
var score=0;
var fuelGroup, birdGroup;
var gameOver;

//Game States
var play=1;
var end=0;
var gameState=play;

function preload(){
    skyImg= loadImage("sky.png");
    planeImg= loadImage("Plane 2.png");
    fuelImg= loadImage("fuel.png");
    birdImg= loadAnimation("Bird1.png", "Bird 2.png");
    endImg= loadAnimation("gameOver.png");
    plane2Img= loadAnimation("plane1.png");
    gameOverImg = loadImage("gameOver.png");

    collidedSound= loadSound("collided.wav");
    fuelSound= loadSound("fuel.mp3");
}

function setup() {
    createCanvas(600,400);

    sky= createSprite(0,200);
    sky.addImage(skyImg);
    sky.velocityX=-4;

    plane= createSprite(100,200,10,10);
    plane.addImage("plane", planeImg);
    plane.addAnimation("fly", plane2Img);
    plane.scale= 0.2;
    plane.velocityY=2;

    fuelGroup= new Group();
    birdGroup= new Group();

    gameOver= createSprite(300,200);
    gameOver.addImage(gameOverImg);
    gameOver.visible = false;

    plane.setCollider("rectangle",0,0,900,300);
    //plane.debug= true;
    
 
}

function draw(){
    background(0);

    if(gameState===play){
        score= score+ Math.round(getFrameRate()/60);
        sky.velocityX= -(6+3*score/100);

        if(keyDown("SPACE")){
            plane.velocityY= -4;
            plane.changeImage("fly", plane2Img);
        }
        if(keyWentUp("SPACE")){
            plane.changeImage("plane", plane2Img);
        }
        plane.velocityY+= 0.3;

        if(sky.x< 0){
            sky.x= width/2;
        }

        spawnBirds();
        spawnFuel();

        if(fuelGroup.isTouching(plane)){
            fuelSound.play();
            fuelGroup.destroyEach();
            fuelCollection+= 1;
        }

        if(birdGroup.isTouching(plane)|| plane.y>400|| plane.y<0){
            collidedSound.play();
            gameState= end;
        }
    }

    else if(gameState === end){
        gameOver.visible= true;

        sky.velocityX= 0;
        birdGroup.setVelocityXEach(0);
        fuelGroup.setVelocityXEach(0);
        plane.velocityY=0;
        birdGroup.destroyEach();

        fuelGroup.setLifetimeEach(-1);

        if(keyDown("SPACE")){
            reset();
        }
    }

    drawSprites();
    textSize(20);
    fill(0);
    text("Fuel: "+fuelCollection,10,30);
    text("Score: "+score,500,30);
}

function spawnBirds(){
    if(frameCount%150===0){
        var bird= createSprite(600, Math.round(random(30,370)), 10,10);
        bird.addAnimation("bird",birdImg);
        bird.scale= 0.2;
        bird.velocityX= -(6+score/100);
        bird.lifetime= 300;
        //bird.debug= true;
        bird.setCollider("rectangle",0,0,250,100)
        birdGroup.add(bird);
    }
}

function spawnFuel(){
    if(frameCount%210===0){
        var fuel= createSprite(600, Math.round(random(30,370)), 10,10);
        fuel.addImage(fuelImg);
        fuel.scale= 0.02;
        fuel.velocityX= -(6+score/100);
        fuel.lifetime= 300;
        //fuel.debug= true;
        fuel.setCollider("rectangle",200,100)
        fuelGroup.add(fuel);
    }
}

function reset(){
    gameState= play;
    gameOver.visible= false;

    fuelGroup.destroyEach();
    birdGroup.destroyEach();

    score=0;
    fuelCollection=0;
    plane.y=200;
}