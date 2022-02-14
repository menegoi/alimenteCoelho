const Engine = Matter.Engine;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Constraint = Matter.Constraint;
const Composites = Matter.Composites;
const Composite = Matter.Composite;
const Render = Matter.Render;

//Variáveis
var engine, world;

var ground;
var rope, rope2, rope3; 
var fruit,rabbit;
var fruitConect, fruitConect2, fruitConect3;
var imgRabbit, imgBg, imgFruit;
var rabbitBlink, rabbitEat, rabbitSad;
var button1, button2, button3;
var bkSong, cutSound, sadSound, eatingSound, airSound;
var buttonBlower, buttonMute;
var isMobile, canvasW, canvasH;

function preload(){
  //Carregar imagens
  imgBg = loadImage("background.png");
  imgFruit = loadImage("melon.png");
  imgRabbit = loadImage("Rabbit-01.png");

  //Carregar animações
  rabbitBlink = loadAnimation("blink_1.png","blink_2.png","blink_2.png");
  rabbitEat = loadAnimation("eat_1.png","eat_2.png","eat_3.png","eat_4.png");
  rabbitSad = loadAnimation("sad_1.png","sad_2.png","sad_3.png");

  //Modo da animação desabilitar/habilitar
  rabbitBlink.playing = true;
  rabbitEat.playing = true;
  rabbitSad.playing = true;
  rabbitEat.looping = false;
  rabbitSad.looping = false;

  //Efeitos Soronos
  bkSong = loadSound("background.mp3");
  cutSound = loadSound("rope_cut.mp3");
  sadSound = loadSound("sad-sound.wav");
  eatingSound = loadSound("eating_sound.mp3");
  airSound = loadSound("air_sound.wav");
}

function setup(){

  //Verificar o tamanho da tela do dispositivo
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if(isMobile){
    canvasW = displayWidth;
    canvasH = displayHeight;
    createCanvas(displayWidth,displayHeight);

  }else{
    canvasW = windowWidth;
    canvasH = windowHeight;
    createCanvas(windowWidth,windowHeight);
  }


  //Configurações Iniciais
  frameRate(80);

  rectMode(CENTER);
  imageMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50);

  
  //Efeito sonoro background
  bkSong.play();
  bkSong.setVolume(0.2);

  //Criar Motor de física e mundo
  engine = Engine.create();
  world = engine.world;
 
  //Criar objetos a partir das classes
  ground = new Ground(canvasW/2,canvasH*0.95,canvasW,canvasH*0.05);

  //Criar cordas
  rope = new Rope(11,{x: 40,y:30});
  rope2 = new Rope(7,{x: 370,y:40});
  rope3 = new Rope(4,{x: 400,y:225});

  //Criar objeto para a fruta
  var fruit_option = {
    density: 0.001
  }
  fruit = Bodies.circle(300,300,15, fruit_option);
  Composite.add(rope.body,fruit);

  //Conexão entre a fruta e a corda
  fruitConect = new Link(rope,fruit);
  fruitConect2 = new Link(rope2,fruit);
  fruitConect3 = new Link(rope3,fruit);

  //Definir velocidade das animações
  rabbitBlink.frameDelay = 20;
  rabbitEat.frameDelay = 20;
  rabbitSad.frameDelay = 20;

  //Criar Sprite do coelho
  rabbit = createSprite(canvasW*0.4,canvasH*0.85,canvasW*0.3,canvasH*0.7); 
  rabbit.addImage(imgRabbit);
  rabbit.scale = 0.2; 
  rabbit.addAnimation("blink",rabbitBlink);
  rabbit.addAnimation("eat",rabbitEat);
  rabbit.addAnimation("sad",rabbitSad);
  
  //Iniciar com a animação do coelho piscando
  rabbit.changeAnimation("blink");

  //Criar botão 1
  button1 = createImg("cut_btn.png");
  button1.position(20,30);
  button1.size(50,50);
  button1.mouseClicked(drop1);

  //Criar botão 2
  button2 = createImg("cut_btn.png");
  button2.position(330,35);
  button2.size(50,50);
  button2.mouseClicked(drop2);

  //Criar botão 3
  button3 = createImg("cut_btn.png");
  button3.position(360,200);
  button3.size(50,50);
  button3.mouseClicked(drop3);
  
  //Criar botão blower
  //buttonBlower = createImg("balloon.png");
  //buttonBlower.position(10,250);
  //buttonBlower.size(150,100);
  //buttonBlower.mouseClicked(airblow);

  //Criar botão mute
  buttonMute = createImg("mute.png");
  buttonMute.position(430,20);
  buttonMute.size(50,50);
  buttonMute.mouseClicked(mute);

}

function draw() 
{
  background(51); 
  image(imgBg,width/2,height/2,canvasW,canvasH); 

  //Atualizar motor de física
  Engine.update(engine);

  //Exibir objetos na tela
  ground.display();
  rope.display();
  rope2.display();
  rope3.display();

  if(fruit != null){
    //Criar forma circular para representar a fruta
    push()
    ellipseMode(RADIUS);
    fill("yellow");
    ellipse(fruit.position.x,fruit.position.y,15,15);
    image(imgFruit,fruit.position.x,fruit.position.y,60,60);
    pop();
  }

  //Identificar colisão entre coelho e fruta
  if(collide(fruit,rabbit)==true){
    rabbit.changeAnimation("eat");

    eatingSound.play();
  }


  if(fruit!=null && fruit.position.y >=550){
    rabbit.changeAnimation("sad");
    fruit= null;

    sadSound.play();
    bkSong.stop();
  }

  //Exinir coelho na tela
  drawSprites();
   
}

function drop1(){
  cutSound.play();
  rope.break();
  fruitConect.detach();
  fruitConect =null;
}
function drop2(){
  cutSound.play();
  rope2.break();
  fruitConect2.detach();
  fruitConect2 =null;
}
function drop3(){
  cutSound.play();
  rope3.break();
  fruitConect3.detach();
  fruitConect3 =null;
}

function collide(body,sprite){
    if(body !=null){

      var d = dist(body.position.x, body.position.y,sprite.position.x,sprite.position.y);
      //console.log(d);
      if(d <=80){
        Composite.remove(world,fruit);
        fruit =null;

        return true;

      }else{

        return false;
        
      }

    }
}
//function airblow(){
//  Matter.Body.applyForce(fruit, {x:0,y:0}, {x:0.01,y:0});
//}
function mute(){

  if(bkSong.isPlaying()){
    bkSong.stop();
  }else{
    bkSong.play();
  }
}
