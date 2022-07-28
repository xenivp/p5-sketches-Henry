
var song;
var amp;
var button;

let fft, peakDetect, framesPerPeak;
let noiseMax;

// for blobby 
var slider;
var zoff = 0;
var a = 0; // angel which is increased at each draw

function preload() {
  song = loadSound( "../SKTTRD_WAITING_ROOM.mp3 ");
}

function setup() {
  //createCanvas(600, 600);
  createCanvas( 850, 760);
  background(20,20);
  noStroke(); 

  rectMode(CENTER);

  song.setVolume(1);
  button = createButton(" toggle ");
  button.mousePressed( toggleButton ); // in helper.js
  button.position( width + 10, height/2);

  //slider = createSlider( 0, 10, 0, 0.1); // for noise 

  amp = new p5.Amplitude();

  // p5.PeakDetect requires a p5.FFT
  fft = new p5.FFT();
  framesPerPeak = 60 / (83/60); // fps = 60, BPM = 83
  // new p5.PeakDetect([freq1], [freq2], [threshold], [framesPerPeak])
  peakDetect = new p5.PeakDetect(0,2000,0.1,framesPerPeak);
  // threshold set to 0.1 ( default is 0.35)

  // when a beat is detected, call triggerBeat()
 // peakDetect.onPeak(triggerBeat);
  
}

function draw() {
  background(20, 2); // 20 seems to make smokey effect
  // fill(255,10);

  // peakDetect accepts an fft post-analysis
  fft.analyze();
  peakDetect.update(fft); // looks for onsets in some or all of spectrum

  if (peakDetect.isDetected) {
    noiseMax = 6; // 3
  } else {
    noiseMax = noiseMax * 0.95;

  }

  // blobby things 
  ////// PART 1 - BLOBBY CIRCLE
  translate(width / 2, height / 2);

  stroke(255);
  noFill();
  beginShape()

  // let noiseMax = slider.value();

  for (let a = 0; a < TWO_PI; a += 0.01) {

    let xoff = map(cos(a), -1, 1, 0, noiseMax);
    let yoff = map(sin(a), -1, 1, 0, noiseMax);
    // 3D perlin noise space
    let r = map(noise(xoff, yoff, zoff), 0, 1, 0, width - 100);
   //let r = map(noise(xoff, yoff, zoff), 0, 1, 100, 200);

    let x = r * cos(a);
    let y = r * sin(a);

    vertex(x, y); // vertex(x,y) if using translate(width/2, height/2)
  }
  endShape(CLOSE)

  zoff += 0.01;
  // a += 0.01;

}

function toggleButton() {
  if ( !song.isPlaying() ) {
      song.play();
      button.html("pause");
  } else {
    song.pause();
    button.html("play");
  }
}