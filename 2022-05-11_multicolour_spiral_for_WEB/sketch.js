var soundFile;
var amplitude;
var beatDectected = false;
var prevLevels = new Array(100);
var button;

var beatHoldFrames = 30;

// what amplitude level can trigger a beat?
var beatThreshold = 0.2; // origianl 0.11

// When we have a beat, beatCutoff will be reset to 1.1*beatThreshold, and then decay
// Level must be greater than beatThreshold and beatCutoff before the next beat can trigger.
var beatCutoff = 0; // ORIGINAL 0
var beatDecayRate = 0.98; // how fast does beat cutoff decay? ORIGIANL0.98
var framesSinceLastBeat = 0; // once this equals beatHoldFrames, beatCutoff starts to decay.

var vol_slider;

function preload() {
 soundFile = loadSound('../SKTTRD_WAITING_ROOM.mp3 ');
}

function setup() {
 createCanvas(377, 360);
 vol_slider = createSlider(0, 1, 0.3, 0.01);//min,max,default,steps
 vol_slider.position(width/2 - 50, height - 50);
 vol_slider.style('width','80px');
//  valueDisplayer = createP()
// valueDisplayer.position(width/2 - 50, height - 35);
// valueDisplayer.html('Toggle to change colours ');


 button = createButton( "press to play song");
 button.position(width/2 - 70, height/2);
 button.mousePressed( toggleButton);

 amplitude = new p5.Amplitude();
 amplitude.setInput(soundFile);
 amplitude.smooth(0.9);

 //soundFile.setVolume(0.5);
 
}

let t = 0;

function draw() {

  soundFile.setVolume(vol_slider.value());

  background(204,0,0); // this is when paused...
  translate(width/2,height/2);

  var level = amplitude.getLevel();
  detectBeat(level);

  prevLevels.push(level);  // added level might be a beat 
  prevLevels.splice(0,1);

  /////// CUE 4 ///////// // purple pink lines 
 if ( soundFile.isPlaying() ) { 

    background(255);
    var level_variable = map( level, 0, 0.4, 0, 7 );

    strokeWeight(level_variable);
    if (beatDectected){
    //strokeWeight(4);
      for( var i = 0; i < prevLevels.length; i++){
        strokeWeight( level_variable * 1.3);
        //var y = map(prevLevels[i], 0, 0.5, t+i, 200); //// LOOOKS GOOD!!
        var y = map(prevLevels[i], 0, 0.5, i, 200);
       // stroke(y,y*2,173, 120); // stroke(y,125,173, 120);
       var vol_colour = map( vol_slider.value(),0,1,0,255 );
       stroke(vol_colour,y*2,173, 120); // stroke(y,125,173, 120);
        line(x1(t+i)/2,y1(y)/2,(x2(t+i)+20)/2,(y2(t+i)+20)/2);
      }
  } else {
      //strokeWeight(2);
      for( var i = 0; i < prevLevels.length; i++){
        //var y = map(prevLevels[i], 0, 0.5, t+i, 200);
        var y = map(prevLevels[i], 0, 0.5, i, 200);
        var vol_colour = map( vol_slider.value(),0,1,0,255 );
        stroke(vol_colour,y*2,173, 120);
        line(x1(t+i)/2,y1(y)/2,(x2(t+i)+20)/2,(y2(t+i)+20)/2);
      }
    } 
   t += level; // current amplitude // very funky with t += y

  } else {

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

function toggleButton() {
 if ( !soundFile.isPlaying() ) {
     soundFile.play();
     button.position( width/2 - 20 , height - 20);
     button.html("pause");
 } else {
   soundFile.pause();
   button.position(width/2 - 70,height/2);
   button.html("press to play song");
 }
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


