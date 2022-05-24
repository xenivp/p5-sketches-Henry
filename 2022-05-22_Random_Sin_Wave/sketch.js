let xspacing = 16; // Distance between each horizontal location
let w; // Width of entire wave
let theta = 0.0; // Start angle at 0
let amplitude = 75.0; // Height of wave
let period = 500.0; // How many pixels before the wave repeats
let dx; // Value for incrementing x
let yvalues; // Using an array to store height values for the wave
let randomAmplitude;
let yshift;
let newBeat = 1;
let i_increase_theta = 0;
let i_increase = 0;

let stroke_col; 
let redval;
let s; // for stroke weight
let stroke_col_2_wave; // for colour of  second wave
let style1 = true;
let change_col = true;

let soundFile, fft, peakDetect, framesPerPeak;

let button;

function preload() {
  soundFile = loadSound('../SKTTRD_WAITING_ROOM.mp3');
}

function setup() {
  createCanvas(710, 710);

  fft = new p5.FFT();
  framesPerPeak = 60 / ( 83/60); // fps=60, bpm=83
  peakDetect = new p5.PeakDetect(0,2000,0.1,framesPerPeak); // vol threshold for beat is 0.1 here ( logarithmic)

  w = width + 16;
  dx = (TWO_PI / period) * xspacing;
  yvalues = new Array(floor(w / xspacing));
  randomAmplitude = new Array(floor(width/xspacing));

  for ( let i = 0; i < randomAmplitude.length; i++ ) {
    randomAmplitude[i]= random( height*0.125, height*0.22);
  }

  button = createButton( "press here Henry");
  button.mousePressed( toggleButton);

  let d = soundFile.duration();

  setInterval( changeStyle, 40000 );
  setInterval( cue_change_col, 8000);
  //setInterval( changeWaveCol( color(150,200,200)), 3000);
  
}

function draw() {

  background(0);
  fft.analyze();
  peakDetect.update(fft);

  if ( style1 ) { 

    peakDetectStyle1(); // invreases i_increase_theta 
    console.log( "Style 1");

  } else {

    peakDetectStyle2();
  }

  // i_increase_theta += 0.003; // done in function
  // i_increase = sin( i_increase_theta ) * 20; // done in function 

  if (soundFile.isPlaying()) {

    for (let i = 0; i < 100; i++) {

      calcWave(200 + i * i_increase); // changing cos of theta value which is increasing at each loop
      renderWave(stroke_col);

    }
  }

  if ( change_col ) {
    stroke_col_2_wave = color(255, 0, 190);
  } else {
    stroke_col_2_wave = color(255, 0, 0);
  }
  
  strokeWeight(0.3);

  for (let i = 0; i < 100; i++) {

    calcWave(200 + i); // changing cos of theta value which is increasing at each loop
    renderWave( stroke_col_2_wave );

  }

  //noLoop();
}

 
function calcWave( shift ) {
  // Increment theta (try different values for
  // 'angular velocity' here)

  theta += 0.00004;  // theta makes waves change) original == 0.02
  // cool values: 0.7, 

  // on unit circle ( x, y)= (cos, sin) 
  let x = theta;
  for (let i = 0; i < yvalues.length; i++) {
    // + 1 to sin to make positive always 
    yvalues[i] = (sin(x) + 1) * randomAmplitude[i] + shift; // sin of angle gives you y value 
    x += dx;
  }
  
}

function renderWave( stroke_col ) {
 
 let x = 0;
 let y = yvalues[0] ; // start points 

 beginShape();
 stroke( stroke_col);
 noFill();

 curveVertex( x, y);
 curveVertex( x, y);
 for ( let i = 0; i < yvalues.length - 2; i++) {

   y = yvalues[i];
  curveVertex( i * xspacing, y);

 }
 curveVertex( width, yvalues[ yvalues.length -2 ] );
 curveVertex( width, yvalues[ yvalues.length -2 ] );

endShape();

}

function changeStyle () {
  style1 = !style1;
}

function cue_change_col() {
  change_col = !change_col;
}

function peakDetectStyle2 () {

  i_increase_theta += 0.003;
  i_increase = sin( i_increase_theta ) * 20;

  if( peakDetect.isDetected ) {
    redval = 255;
    s = 5
    strokeWeight(5);
    stroke_col = color( redval, 0, 0);
    
  } else {
    redval -= 4;
    s -= 0.1;
    strokeWeight(s);
    stroke_col = color( redval, 0, 0);
  }
}

function peakDetectStyle1 ( theta ) {

  i_increase_theta += 0.003;
  i_increase = sin( i_increase_theta ) * 30;

  strokeWeight(0.5);

  if( peakDetect.isDetected ) {
    redval = 255;
    stroke_col = color( redval, 0, 0);
    
  } else {
    redval -= 4;
    stroke_col = color( redval, 0, 0);
  }
}

function peakDetectStyle3 ( theta ) {

  i_increase_theta += 0.0003;
  i_increase = sin( i_increase_theta ) * 20;

  strokeWeight(0.5);

  if( peakDetect.isDetected ) {
    redval = 255;
    stroke_col = color( redval, 0, 0);
    
  } else {
    redval -= 4;
    stroke_col = color( redval, 0, 0);
  }
}

function change2ndWave () {
 if ( stroke_col_2_wave == color( 255,0,))
  stroke_col_2_wave = color( 255,0,0);
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




