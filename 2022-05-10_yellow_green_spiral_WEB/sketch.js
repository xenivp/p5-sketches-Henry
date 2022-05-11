
function setup() {
  createCanvas(720, 900);
  //createCanvas(windowWidth,windowHeight);  
}

let t = 0;

function draw() {

   background(204,0,0);
   translate(width/2,height/2);
    
// YELLOW NORMAL CURVE
   var orangeness = 0;
   var alpha = 150;
   strokeWeight(2);

    for(let i = 0;i<100;i+=0.5){
      stroke(orangeness,orangeness,0 ,alpha);
      line(x1(t+i),y1(t+i),x2(t+i)+20,y2(t+i)+20);
      orangeness+=2;
    }
  
  t+=0.5;
  }

// function to change initial x co-ordinate of the line
function x1(t){
  return sin(t/10)*125+sin(t/20)*125+sin(t/30)*125;
}

// function to change initial y co-ordinate of the line
function y1(t){
  return cos(t/10)*125+cos(t/20)*125+cos(t/30)*125;
}

// function to change final x co-ordinate of the line
function x2(t){
  return sin(t/15)*125+sin(t/25)*125+sin(t/35)*125;
}

// function to change final y co-ordinate of the line
function y2(t){
  return cos(t/15)*125+cos(t/25)*125+cos(t/35)*125;
}


