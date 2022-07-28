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
let d;
let style1 = true;
let style2 = false;
let style3 = false;

let change_col = true;

let soundFile, fft, peakDetect, framesPerPeak;

let button;

function preload() {
  soundFile = loadSound('../SKTTRD_WAITING_ROOM.mp3');
}

function setup() {
  
  createCanvas( 850, 760);

  fft = new p5.FFT();
  framesPerPeak = 60 / ( 83 / 60); // fps=60, bpm=83
  peakDetect = new p5.PeakDetect(0, 2000, 0.1, framesPerPeak); // vol threshold for beat is 0.1 here ( logarithmic)

  w = width + 16;
  dx = (TWO_PI / period) * xspacing;
  yvalues = new Array(floor(w / xspacing));
  randomAmplitude = new Array(floor(width/xspacing));

  for ( let i = 0; i < randomAmplitude.length; i++ ) { // to make sin wave wonky
    randomAmplitude[i]= random( height*0.125, height*0.22);
  }

  button = createButton( "press here Henry");
  button.mousePressed( toggleButton);
  button.position( width + 20, height/2 );

  d = soundFile.duration();

  setInterval( changeStyle, 40000 );
  setInterval( cue_change_col, 8000);

  soundFile.addCue( 76.6, function() { style3 = true; style1 = false; style2 = false ;} );
  soundFile.addCue( 84, function() { style3 = false; style1 = true; style2 = false ;} );

  soundFile.addCue( 202, function() { style3 = true; style1 = false; style2 = false ;} );
  soundFile.addCue( 214, function() { style3 = false; style1 = true; style2 = false ;} );
  
}

function draw() {

  background(0);
  fft.analyze();
  peakDetect.update(fft);

  if ( style1 && !style2 ) { 
    peakDetectStyle1(); //  calculates increases i_increase_theta 
  } else if ( style2 && !style1 ) {
    peakDetectStyle2(); // thick lines that fade
  } else if ( style3 ) {
    peakDetectStyle3 () ; //makes flashy thing
  }

 

  if (soundFile.isPlaying()) {

    // too many and code is SLOW! 
    // i < 15 works
    for ( let i = 0; i < 20; i++ ) { // lines coming out of main curve
      let i_val = 200 + i * i_increase;
      calcWave( i_val ); // changing cos of theta value which is increasing at each loop
      // i_increase makes the spacing between the lines 
      // i_increase calculated in peakDetectStyle1() and 2
      renderWave( stroke_col );

    }
  }

  if ( change_col ) {
    stroke_col_2_wave = color(255, 0, 190, 160);
  } else {
    stroke_col_2_wave = color(255, 0, 0, 160);
  }
  
 // too manyt and code is slow i < 3 is ok 
  for (let i = 0; i < 7; i++) { // repeats lines in middle main wave
    strokeWeight( 10 );
    let i_val = 200 + 8 * i;
    calcWave( i_val ); // changing cos of theta value which is increasing at each loop
    renderWave( stroke_col_2_wave );

  }

  //noLoop();
}

 
function calcWave( shift ) {
  // Increment theta (try different values for
  // 'angular velocity' here)

  theta += 0.0007;  // theta makes waves change) original == 0.02
  // cool values: 0.7, 

  // on unit circle ( x, y)= (cos, sin) 
  let x = theta;
  for (let i = 0; i < yvalues.length; i++) {
    // + 1 to sin to make positive always 
    yvalues[i] = ( sin(x) + 1) * randomAmplitude[i] + shift; // sin of angle gives you y value 
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
  style2 = !style2;
}

function cue_change_col() {
  change_col = !change_col;
}


function peakDetectStyle1 () { // goes red at beat 

  i_increase_theta += 0.003;
  i_increase = sin( i_increase_theta ) * 40; // * 40 inceases spacing to next line
  // i_increase used in calc_wave() function when soundfile is playing

  strokeWeight( 0.9 );

  if( peakDetect.isDetected ) { // at beat goes to full red then fades
    redval = 255;
    stroke_col = color( redval, 0, 0);
    
  } else {
    redval -= 4; // red value fading 
    stroke_col = color( redval, 0, 0);
  }
}

function peakDetectStyle2 () { // thick lines that fade

  i_increase_theta += 0.003;
  i_increase = sin( i_increase_theta ) * 20; 

  if( peakDetect.isDetected ) { // at Peak goes red then fades until next beat
    redval = 255;
    s = 6;
    strokeWeight(6); // Stroke weight at 6 at each Peak then fades
    stroke_col = color( redval, 0, 0);
    
  } else {
    redval -= 4;
    s -= 0.1;
    strokeWeight(s);
    stroke_col = color( redval, 0, 0);
  }
}

function peakDetectStyle3 () { // flashing thick lines 

  i_increase_theta += 0.003;
  i_increase = sin( i_increase_theta ) * 20; 

  if( peakDetect.isDetected ) { // at Peak goes red then fades until next beat
    redval = 255;
    //s = 5; // this is for fade

    strokeWeight(5); // Stroke weight at 5 at each Peak then fades
    stroke_col = color( redval, random(0, 255), random( 0,255));
    
  } else {
    redval -= 4;
    s -= 0.1;
    strokeWeight(s);
    stroke_col = color( redval, random(0, 255), random( 0,255));
  }
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








