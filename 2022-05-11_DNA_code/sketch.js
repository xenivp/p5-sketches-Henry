var CircleNum 
var Diameter = 4;

function setup() { 
  createCanvas(400, 377);
  CircleNum = 100;

} 
function draw() { 

  background(15,15,30,50);
  
  for ( i = 0; i < CircleNum; i++) {
    var g = map(524, 0, 640,100, 255); // can change to mouseX 
  	var b = map(524, 0, 640, 255, 0);  // can change to mouseX 

  	var x = i*(width)/(CircleNum);
    fill(random(150,255), 0, 100, 200); // PINK
    noStroke();
    ellipse(x,height/3.5+30*sin(50*i+frameCount/100),Diameter,Diameter);
    
  	var x2 = i*(width)/(CircleNum);
	
    fill(random(150,255), 0, 100, 200);
    noStroke();
    ellipse(x2,height/3.5+20*cos(PI*(3/4)+50*i+frameCount/100),Diameter,Diameter);
    
    strokeWeight(0.1);
    stroke(255,0, 200);
    line(x,height/3.5+30*sin(50*i+frameCount/100),
      x2,height/3.5+20*cos(PI*(3/4)+50*i+frameCount/100))
      
		var x3 = i*(width)/(CircleNum);
		fill(random (0,255),g,b,20);
		noStroke();
		ellipse(x3,height/3.5+30*tan(50*i+frameCount/100),Diameter,Diameter);
  	
  }
  
  
}

