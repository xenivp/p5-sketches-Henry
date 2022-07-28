var soundFile, fft, peakDetect, framesPerPeak;

// Variables for cardioid: 
var decayRate = 0.99;
let factor = 0;
var r;
let changeRotation = 1; // not being used atm

// variables for parametric equations
let amplitude;
let prevLevels = new Array( 100 ); // array filled with previous amplitude levels

let strokeWeightVar = 4;
let nofLines = 100;

let button; // play pause button

/// variables for ccapture 
var startMillis; // null to begin with 
var fps = 60; // frame rate 
///// THIS DOESN'T WORK IDEAL BECAUSE OF A DELAY !! BUT CODE WORKS,BUT t VARIABLE IN CAPTURE FUNCTION 
/// DOESN't REACH 1 BY TIME SONG HAS FINISHED 
var doCapturing = false; // set to false for no capture
// the canvas capturer instance
if ( doCapturing ) {
  var capturer = new CCapture({ format: 'png', framerate: fps });
}

// CUES 
let cue_blackSpiral = true;
let cue_blueGreenSpiral = false;
let cue_crazyTriangle = false;
let cue_redSpiral = false;
let cue_normalSpiral = false;
let cue_cardioid = false;

function preload() {
  soundFile = loadSound('../SKTTRD_WAITING_ROOM.mp3');
}

function setup() {
 // frameRate(fps); // this is optional, but lets to see how the animation will look in browser.  
 createCanvas( 850, 760);
//createCanvas( windowWidth, windowHeight);

  button = createButton( "press here");
  button.position( width + 20, height/2);
  button.mousePressed( toggleButton);

  //for ccapture 
  songDuration = soundFile.duration() * 1000; // in milliseconds 

  // for parametric equation speed
  amplitude = new p5.Amplitude();
  amplitude.setInput(soundFile);
  amplitude.smooth(0.9);

  // for cardioid 
  fft = new p5.FFT();
  framesPerPeak = 60 / ( 83/60); // fps=60, bpm=83
  peakDetect = new p5.PeakDetect(0,2000,0.1,framesPerPeak); // vol threshold for beat is 0.1 here ( logarithmic)
  r = width/2 - 16; // origianl radius before first beak, width/2 - 900;
  
  soundFile.addCue( 76.5, function() { cue_blackSpiral = false; cue_blueGreenSpiral = true; } );
  soundFile.addCue( 137, function() { cue_blueGreenSpiral = false, cue_crazyTriangle = true; });
  soundFile.addCue( 202, function() { cue_crazyTriangle = false; cue_redSpiral = true; });
  soundFile.addCue( 220, function() { cue_redSpiral = false, cue_normalSpiral = true; });
  soundFile.addCue( 280, function() { cue_normalSpiral = false; cue_cardioid = true; })
  
}

let t = 0; 
function draw() {

  // for ccapture:
  if ( doCapturing ) {
       startCapture( songDuration );    
    }

  background(204,0,0);
  translate( width/2, height/2);
  
  fft.analyze();// computes amplitude values along the frequency domain
  peakDetect.update(fft);

 // for parametric equations, fill in array of amplitude
  let level = amplitude.getLevel();
  prevLevels.push( level);
  prevLevels.splice(0,1);
  
  /////// CUE 1 //////// BLACK CRAZY SPIRAL 
  if (cue_blackSpiral && soundFile.isPlaying()) {
    background(255);
    stroke(0);

    if (peakDetect.isDetected) {
      strokeWeightVar = 4;
      strokeWeight(strokeWeightVar);

      for (var i = 0; i < prevLevels.length; i++) {
        var y = map(prevLevels[i], 0, 0.5, t + i, 200);
        line(x1(t + i), y1(y), x2(t + i) + 20, y2(t + i) + 20);
      }

    } else {
      strokeWeightVar = strokeWeightVar * 0.94;
      strokeWeight(strokeWeightVar);

      for (var i = 0; i < prevLevels.length; i++) {
        var y = map(prevLevels[i], 0, 0.5, t + i, 200);
        line(x1(t + i), y1(y), x2(t + i) + 20, y2(t + i) + 20);
      }

    }

    t += level; // current amplitude
  
 ///////// CUE 2 //////// BLUE GREEN SPIRAL 
  } else if (cue_blueGreenSpiral && soundFile.isPlaying()) {


    background(255);
    var level_variable = map(level, 0, 0.4, 0, 7);
    strokeWeight(level_variable);

    if (peakDetect.isDetected) {

      for (var i = 0; i < prevLevels.length; i++) {
        strokeWeight(level_variable * 1.3);
        // var y = map(prevLevels[i], 0, 0.5, t+i, 200); //// LOOOKS GOOD!!
        var y = map(prevLevels[i], 0, 0.5, i, 200);
        stroke(y, y * 2, 173, 120);
        line(x1(t + i), y1(y), x2(t + i) + 20, y2(t + i) + 20);
      }
    } else {

      for (var i = 0; i < prevLevels.length; i++) {
        //var y = map(prevLevels[i], 0, 0.5, t+i, 200);
        var y = map(prevLevels[i], 0, 0.5, i, 200);
        stroke(y, y * 2, 173, 120);
        line(x1(t + i), y1(y), x2(t + i) + 20, y2(t + i) + 20);
      }
    }
    t += level; // current amplitude // very funky with t += y

//////// CUE 3 ////// CRAZY TRIANGLE
  } else if ( cue_crazyTriangle && soundFile.isPlaying()) {

    background(255);
    var yellowness = 0;
    var alpha = 150;
   
    if (peakDetect.isDetected) {

      strokeWeightVar = 10;
      strokeWeight(strokeWeightVar);

    } else {

      strokeWeightVar = strokeWeightVar * 0.95;
      strokeWeight(strokeWeightVar);

    }

    for (let i = 0; i < prevLevels.length; i++) {
      stroke(150, yellowness, 0, alpha);
      line(x1(prevLevels[i] + t), y1(prevLevels[i] + t), x2(prevLevels[i] + i + t) + 20, y2(prevLevels[i] + t) + 20);
      yellowness += 3;
    }
    
    t += map(level, 0, 1, 0.1, 0.4); // speed control 

/////// CUE 4 ///// RED SPIRAL 
  } else if (cue_redSpiral && soundFile.isPlaying()) {

    background(210, 0, 0); // red 

    if (peakDetect.isDetected) {

      strokeWeightVar = 6;
      strokeWeight(strokeWeightVar);

    } else {
      strokeWeightVar = strokeWeightVar * 0.97;
      strokeWeight(strokeWeightVar);

    }

    for (var i = 0; i < prevLevels.length; i++) {
      var y = map(prevLevels[i], 0, 0.5, t + i, 200);
      stroke(y, 0, 0);
      line(x1(t + i), y1(y), x2(t + i) + 20, y2(t + i) + 20);
    }

    t += level; // current amplitude 

  ////// CUE 5 ////// YELLOW NORAML CURVE

  } else if (cue_normalSpiral && soundFile.isPlaying()) {

    var orangeness = 0;
    var alpha = 200;

    if (peakDetect.isDetected) { // when a beat is detected aount of lines increases

      nofLines = 150;
      strokeWeightVar = 3;
      strokeWeight(strokeWeightVar);

    } else {

      // nofLines = nofLines * 0.99;
      nofLines -= 1;
      strokeWeightVar = strokeWeightVar * 0.97;
      strokeWeight(strokeWeightVar);

    }

    for (let i = 0; i < nofLines; i++) {
      stroke(orangeness, orangeness, 0, alpha);
      line(x1(t + i), y1(t + i), x2(t + i) + 20, y2(t + i) + 20);
      orangeness += 3;
    }

    t += 0.3;

 ////// CUE 6 ////  CARDIOID 

  } else if ( cue_cardioid && soundFile.isPlaying() ) {

      noFill();
      let total = 100;

      if ( peakDetect.isDetected ) {
         r = width/2 - 1500; // -1000 is zoomed

      }  else {

        r = r * 0.99; // decay rate 
      }

      for (let i = 0; i < total; i++) {

        let a = getVector(i, total, r, changeRotation);
        let b = getVector(i * factor, total, r, changeRotation);
    
        
        if (i % 2 == 0) {
          stroke(204,255,204);
          strokeWeight(5);
        } else {
          stroke(20,20,20);
          strokeWeight(5);
        }
        
        line(a.x, a.y, b.x, b.y);
    
       // Triangles ( + 100 makes things stetched)
        noStroke();
        fill(map(i, 0, total, 10, 50), map(i, 0, total, 10, 50), map(i, 0, total, 10, 90), 90);
        triangle(a.x, a.y, b.x, b.y, a.x + 100, a.y);
    
      }
  
      factor += 0.01;

  }
 
}

function startCapture( captureDuration ) {

    if (startMillis == null && soundFile.isPlaying() ) { // and if song is playing? 

      capturer.start(); // starts once music is playing

      startMillis = millis();
    }
  
    // duration in milliseconds
    // var duration = captureDuration;

    // compute how far we are through the animation as a value between 0 and 1. 
    var elapsed = millis() - startMillis; // how much has played

    var t = map( elapsed, 0, captureDuration, 0, 1);

    //console.log( "duration = ", duration);
    // console.log( "startMillis = ", startMillis);
    // console.log( "elapsed = ", elapsed );
   // console.log( t );

    // if we have passed t=1 then end the animation.
    if (t > 1) {
      noLoop();
      console.log('finished recording.');
      capturer.stop();
      capturer.save();
      return;
    }

    // handle saving the frame
    if ( soundFile.isPlaying() ) {
    console.log('capturing frame');
    capturer.capture(document.getElementById('defaultCanvas0'));
    }
    
    
}


