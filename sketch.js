 var soundFile;
 var amplitude;
 var beatDectected = false;
 var prevLevels = new Array(100);
 var button;

 var cue1 = true;
 var cue2 = false;
 var cue3 = false; // crazy strobe triangles has to be at end 
 var cue4 = false;
 var cue5 = false;
 var cue6 = false;
 
 var beatHoldFrames = 30;
 
 // what amplitude level can trigger a beat?
 var beatThreshold = 0.2; // origianl 0.11
 
 // When we have a beat, beatCutoff will be reset to 1.1*beatThreshold, and then decay
 // Level must be greater than beatThreshold and beatCutoff before the next beat can trigger.
 var beatCutoff = 0; // ORIGINAL 0
 var beatDecayRate = 0.98; // how fast does beat cutoff decay? ORIGIANL0.98
 var framesSinceLastBeat = 0; // once this equals beatHoldFrames, beatCutoff starts to decay.

 function preload() {
  soundFile = loadSound('SKTTRD_WAITING_ROOM.mp3 ');
}

function setup() {
  createCanvas(720, 900);
  createCanvas(windowWidth,windowHeight);

  button = createButton( "press here Henry");
  button.mousePressed( toggleButton);

  amplitude = new p5.Amplitude();
  //soundFile.play();
  amplitude.setInput(soundFile);
  amplitude.smooth(0.9);
  
  var d = soundFile.duration();
  var num_of_cues = 6;
  soundFile.addCue( d/num_of_cues, changeVibe1 ); 
  soundFile.addCue( d/num_of_cues*2, changeVibe2 );
  soundFile.addCue( d/num_of_cues*3, changeVibe3);
  soundFile.addCue( d/num_of_cues*4, changeVibe4);
  soundFile.addCue( d/num_of_cues*5, changeVibe5); 

  // do ques with a counter!!! and one function! 
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

let t = 0;
function draw() {
   background(204,0,0);
   translate(width/2,height/2);
   
   var level = amplitude.getLevel();
   detectBeat(level);

  
   prevLevels.push(level);  // added level might be a beat 
   prevLevels.splice(0,1);

   ////// CUE 2 ////// RED CRAZY SPIRAL 
   if (cue2 && soundFile.isPlaying()) {
     background(210, 0, 0); // red 
     if (beatDectected) {
       strokeWeight(5);
       for (var i = 0; i < prevLevels.length; i++) {
         var y = map(prevLevels[i], 0, 0.5, t + i, 200);
         stroke(y, 0, 0);
         line(x1(t + i), y1(y), x2(t + i) + 20, y2(t + i) + 20);
       }
 } else {
      strokeWeight(2);
      for( var i = 0; i < prevLevels.length; i++){
        var y = map(prevLevels[i], 0, 0.5, t+i, 200);
        stroke(y,0,0);
        line(x1(t+i),y1(y),x2(t+i)+20,y2(t+i)+20);
      }
    } 
   // t +=0.5;
   t += level; // current amplitude // very funky with t += y
  }
  /////// CUE 1 //////// BLACK CRAZY SPIRAL 
  else if ( cue1 && soundFile.isPlaying() ) {
    background(255);
    stroke(0);
    if (beatDectected){
      strokeWeight(4);
      for( var i = 0; i < prevLevels.length; i++){
        var y = map(prevLevels[i], 0, 0.5, t+i, 200);
        line(x1(t+i),y1(y),x2(t+i)+20,y2(t+i)+20);
      }
   } else {
        strokeWeight(2);
        for( var i = 0; i < prevLevels.length; i++){
          var y = map(prevLevels[i], 0, 0.5, t+i, 200);
          line(x1(t+i),y1(y),x2(t+i)+20,y2(t+i)+20);
        }
      } 
     // t +=0.5;
     t += level; // current amplitude
  }
  /////// CUE 4 ///////// // purple pink lines 
  else if ( cue4 && soundFile.isPlaying() ) { 
    background(255);
    if (beatDectected){
      strokeWeight(4);
      for( var i = 0; i < prevLevels.length; i++){
        var y = map(prevLevels[i], 0, 0.5, t+i, 200);
        stroke(y,125,173, 120);
        line(x1(t+i),y1(y),x2(t+i)+20,y2(t+i)+20);
      }
   } else {
        strokeWeight(2);
        for( var i = 0; i < prevLevels.length; i++){
          var y = map(prevLevels[i], 0, 0.5, t+i, 200);
          stroke(y,125,173, 120);
          line(x1(t+i),y1(y),x2(t+i)+20,y2(t+i)+20);
        }
      } 
     // t +=0.5;
     t += level; // current amplitude // very funky with t += y

 }
//////// CUE 5 //////  // YELLOW NORMAL CURVE
 else if ( cue5 && soundFile.isPlaying()){
   var orangeness = 0;
   var alpha = 150;
   if ( beatDectected ) { // when a beat is detected aount of lines increases
  
    for(let i = 0;i<100;i+=0.5){
      stroke(orangeness,orangeness,0 ,alpha);
      line(x1(t+i),y1(t+i),x2(t+i)+20,y2(t+i)+20);
      orangeness+=2;
    }
  } else {
    //loop for adding 100 lines ORIGINAL 
    for(let i = 0;i<100;i++){
      stroke( orangeness,orangeness,0 , alpha);
      line(x1(t+i),y1(t+i),x2(t+i)+20,y2(t+i)+20);
      orangeness+=2;
    }
  }
   t+=0.5;
  }

  //////// CUE 6 ///////// TRIANGLE crazy shape
  else if ( cue6 && soundFile.isPlaying()) {
     background(255);
     stroke(0);
   for(let i = 0;i<prevLevels.length;i++){
     line(x1(prevLevels[i]+ t),y1(prevLevels[i]+ t),x2(prevLevels[i]+i+t)+20,y2(prevLevels[i]+t)+20);
   }
   t += level; // controls speed
  }


  ///////// CUE 3 /////// // crazy strobe triangles t += y fucks up later things! 
  else if( cue3 &&  soundFile.isPlaying()) { 
    background( 255,127,80);
    if (beatDectected){
      strokeWeight(8);
      for( var i = 0; i < prevLevels.length; i++){
        var y = map(prevLevels[i], 0, 0.5, t+i, 200);
        stroke( 10,y,10,120); 
        line(x1(t+i),y1(y),x2(t+i)+20,y2(t+i)+20);
      }
   } else {
        strokeWeight(4);
        background
        for( var i = 0; i < prevLevels.length; i++){
          var y = map(prevLevels[i], 0, 0.5, t+i, 200);
          stroke(10,y,10, 110); // y = 173
          line(x1(t+i),y1(y),x2(t+i)+20,y2(t+i)+20);
        }
      } 
     t += y;
  }
}

function detectBeat(level) {
  if (level  > beatCutoff && level > beatThreshold){
    onBeat();
    beatCutoff = level *1.2;
    framesSinceLastBeat = 0;
  } else{
    if (framesSinceLastBeat <= beatHoldFrames){
      framesSinceLastBeat ++;
    }
    else{
      beatCutoff *= beatDecayRate;
      beatCutoff = Math.max(beatCutoff, beatThreshold);
    }
  }
}

function onBeat() {
  beatDectected = !beatDectected;
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


function changeVibe1() {
  cue1 = false;
  cue2 = true;
}

function changeVibe2() {
  cue1 = false;
  cue2 = false;
  cue4 = true;
}

function changeVibe3() {
  cue1 = false;
  cue2 = false;
  cue4 = false;
  cue5 = true;
}

function changeVibe4() { 
  cue1 = false;
  cue2 = false;
  cue4 = false;
  cue5 = false;
  cue6 = true;
}

function changeVibe5() { 
  cue1 = false;
  cue2 = false;
  cue4 = false;
  cue5 = false;
  cue6 = false;
  cue3 = true;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}
