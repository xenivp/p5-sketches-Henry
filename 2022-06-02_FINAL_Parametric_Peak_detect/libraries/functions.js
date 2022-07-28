/// CCAPTURE 

function startCapture ( duration, capturer, fps ) {


    if (frameCount == 1) {
    
        console.log( " in if loop of startCapture ");
        // start the recording on the first frame
        // this avoids the code freeze which occurs if capturer.start is called
        // in the setup, since v0.9 of p5.js
        capturer.start();
      }
    
      if (startMillis == null ) { // should be null before first call to this
        startMillis = millis();
      }
    
      // compute how far we are through the animation as a value between 0 and 1.
      var elapsed = millis() - startMillis;
      var t = map( elapsed, 0, duration, 0, 1);

      // if we have passed t=1 then end the animation.
      if (t > 1) {
        noLoop();
        console.log('finished recording.');
        capturer.stop();
        capturer.save();
        return;
      }

      
}

function endCapture ( capturer ) {
    // handle saving the frame
  console.log('capturing frame');
  capturer.capture(document.getElementById('defaultCanvas0'));
}


//// CARDIOID LINES /////

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

  //// PARAMETRIC EQUATIONS ///

  // function to change initial x co-ordinate of the line
  function x1(t) {
      return sin(t / 10) * 125 + sin(t / 20) * 125 + sin(t / 30) * 125;
  }

  // function to change initial y co-ordinate of the line
  function y1(t) {
      return cos(t / 10) * 125 + cos(t / 20) * 125 + cos(t / 30) * 125;
  }

  // function to change final x co-ordinate of the line
  function x2(t) {
      return sin(t / 15) * 125 + sin(t / 25) * 125 + sin(t / 35) * 125;
  }

  // function to change final y co-ordinate of the line
  function y2(t) {
      return cos(t / 15) * 125 + cos(t / 25) * 125 + cos(t / 35) * 125;
  }

  function toggleButton() {
      if (!soundFile.isPlaying()) {
          soundFile.play();
          button.html("pause");
      } else {
          soundFile.pause();
          button.html("play");
      }
  }
  