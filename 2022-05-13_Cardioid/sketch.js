
var soundFile, fft, peakDetect, framesPerPeak;
var decayRate = 0.99;

let factor = 0;
var r;
let beatDetected = false;
let changeRotation = 1;

let button;

function preload() {
  soundFile = loadSound('../SKTTRD_WAITING_ROOM.mp3');
}

function setup() {
 // createCanvas(600, 600);
  createCanvas( 600, 600);

  fft = new p5.FFT();
  framesPerPeak = 60 / ( 83/60 ); // fps=60, bpm=83
  peakDetect = new p5.PeakDetect(0,2000,0.1,framesPerPeak); // vol threshold for beat is 0.1 here ( logarithmic)
  
  r = width/2 - 16;

  button = createButton( "Press here" );
  button.mousePressed( toggleButton);
  button.position( width + 10, height/2);
  
}

function draw() {
  //background(204,0,0);
  background(255);
  stroke(0);
  text('click to play/pause', width + 20, height/2);
  fft.analyze();
  peakDetect.update(fft);

  //stroke( map(factor % 255,0,255,50,255), 0, 0, 50);
  //strokeWeight(0.3);

  noFill();

  let total = 100; //int(map( mouseX, 0, width, 0, 200));

  translate( width/2, height/2);
  
  if( peakDetect.isDetected ) {

     beatDetected = true;
     //changeRotation *= -1; // varies between 1 and -1
 
     r = width/2 - 1000;// -1000 is zoomed

  } else {
    r = r * decayRate;
  }


  for (let i = 0; i < total; i++) {

    let a = getVector(i, total, r, changeRotation);
    let b = getVector(i * factor, total, r, changeRotation);

    // strokeWeight(map( i, 0, total, 0, 10));

    // stroke( map(factor % 255, 0, 255 * decayRate, 50, 255) , 0, 0, 70);
    // stroke( map(i, 0, total, 0, 180), map(factor % 255, 0, 255, 50, 255), 0, 50);

    // stroke( map(i, 0, total, 150, 255), map(i, 0, total, 50, 100),  map(i, 0, total, 150, 255), 100);

    // Trippy 
    if (i % 2 == 0) {
      stroke(255);
      strokeWeight(5);
    } else {
      stroke(20,20,20);
      strokeWeight(5);
    }
    // end of trippy

    line(a.x, a.y, b.x, b.y);

   // Triangles ( + 100 makes things stetched)
   // noStroke();
    fill(map(i, 0, total, 10, 50), map(i, 0, total, 10, 50), map(i, 0, total, 10, 90), 90);
    triangle(a.x, a.y, b.x, b.y, a.x + 100, a.y);


  }

  beatDetected = false;

  factor += 0.01;
  
}

function getVector (index, total , radius, changeRot) { // returns vector for any index 
  var angle;
  if( changeRot == 1) {

     angle = map( index % total, 0, total, TWO_PI, 0);
  } else if (changeRot == -1) {

     angle = map( index % total, 0, total, 0, TWO_PI ); // direction of rotation
  }
  let v = p5.Vector.fromAngle(angle + PI );
  v.mult(radius);
  return v ;
}

function toggleButton() {
  if ( !soundFile.isPlaying() ) {
      soundFile.play();
      button.html("pause");
  } else {
    soundFile.pause();
    button.html("play");
  }
}
