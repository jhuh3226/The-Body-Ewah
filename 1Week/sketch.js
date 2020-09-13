// The Body Everywhere and Here Class 1: Example 1 — Frame Difference
// https://github.com/lisajamhoury/The-Body-Everywhere-And-Here/

// This example uses the webcam in p5.js to detect movement by
// finding the difference between a current webcam image
// and the previous frame.

// variable for my webcam video
let myVideo;

// variable for my music
let music;

// variable for checking how active the user is
let activeTracker;

// initialize pastPixels to an empty array with []
// this is important so that we can copy into it later
let pastPixels = [];

// threshold slider
let threshSlider;

// setup() is a p5 function
// see this example if this is new to you
// https://p5js.org/examples/structure-setup-and-draw.html

function loaded() {
  music.play();
}

function setup() {
  // create a p5 canvas at the dimensions of my webcam
  createCanvas(640, 480);

  // create a p5 webcam, then hide it
  myVideo = createCapture(VIDEO);
  myVideo.size(width, height); // see p5 documentation for width, height
  myVideo.hide(); // hide the webcam which appears below the canvas by default

  // set threshold range to 0-255
  // 255 is the maximum range for the r,g,b channels of any pixels
  threshSlider = createSlider(0, 255, 100);

  //play music
  music = createAudio('assets/catMusic.mp3', loaded);

  //
  activeTracker = 0;
}

// draw() is a p5 function
// see this example if this is new to you
// https://p5js.org/examples/structure-setup-and-draw.html
function draw() {
  //
  console.log("activeTracker: " + activeTracker);

  // load pixels tells p5 to make the videos pixel array available at .pixels
  // see p5 documentation https://p5js.org/reference/#/p5/loadPixels
  // see Coding Train video on pixel array https://www.youtube.com/watch?v=nMUMZ5YRxHI
  myVideo.loadPixels();

  // get the current pixels from pixel array (documentation above)
  const currentPixels = myVideo.pixels;

  // get the threshold value from the slider
  // all webcams will have some natural noise that looks like "movement"
  // the threshold tells the program what level of change we consider  movement
  //let threshValue = threshSlider.value();
  let threshValue = 40;
  // console.log("threshValue: " + threshValue);

  // go through every pixel of the video
  // y moves down from row to row
  // x moves across the row
  // think of it like a typewriter — x is typing across, y is the return to new line
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // get the current position (index) in the array
      // if this is new to you watch the coding train video referenced above
      const i = (y * width + x) * 4;

      // get the difference between the new last frame and the current frame
      // for each channel of the image: r, g, b, channels
      const rDiff = abs(currentPixels[i + 0] - pastPixels[i + 0]);
      const gDiff = abs(currentPixels[i + 1] - pastPixels[i + 1]);
      const bDiff = abs(currentPixels[i + 2] - pastPixels[i + 2]);

      // set past pixels to current pixels 
      // do this before we alter the current pixels in the coming lines of code
      pastPixels[i + 0] = currentPixels[i + 0];
      pastPixels[i + 1] = currentPixels[i + 1];
      pastPixels[i + 2] = currentPixels[i + 2];
      pastPixels[i + 3] = currentPixels[i + 3];

      // get the average difference for the pixel from the 3 color channels
      const avgDiff = (rDiff + gDiff + bDiff) / 3; // 0-255

      // if the difference between frames is less than the threshold value
      
      if (avgDiff < threshValue) {
        // turn the current pixel black
        currentPixels[i + 0] = 0;
        currentPixels[i + 1] = 0;
        currentPixels[i + 2] = 0;
        currentPixels[i + 3] = 50;

        activeTracker = activeTracker - 0.0003;
        if(activeTracker < -3000)
        {
          activeTracker = -3000;
        }
      } 
      // else if (avgDiff < 50)
      // {
      //   music.volumeDown();
      // }

       else if(avgDiff > 30 && avgDiff <50)
      {
        //console.log("between 30 and 50");
        activeTracker = activeTracker + 0.005;
      }

      else if(avgDiff > 50 && avgDiff <80)
      {
        // otherwise, turn it a soft red
        currentPixels[i + 0] = 255; // to show the natural video color
        currentPixels[i + 1] = 0; // comment out
        currentPixels[i + 2] = 0; // these three lines
        // an alpha of 100, which creates some nice smoothing
        currentPixels[i + 3] = 255;

        activeTracker = activeTracker + 0.01;

        //console.log("between 50 and 80");
      }

      else if(avgDiff > 80 && avgDiff < 90)
      {
        // otherwise, turn it a soft red
        currentPixels[i + 0] = 0; // to show the natural video color
        currentPixels[i + 1] = 200; // comment out
        currentPixels[i + 2] = 0; // these three lines
        currentPixels[i + 3] = 255;
      }

      else if(avgDiff > 90 && avgDiff < 110)
      {
        // otherwise, turn it a soft red
        currentPixels[i + 0] = 0; // to show the natural video color
        currentPixels[i + 1] = 0; // comment out
        currentPixels[i + 2] = 255; // these three lines
        currentPixels[i + 3] = 255;

        // for some whild, if there was alot of movement, volumUp
        activeTracker = activeTracker + 0.03;
      }

      if(activeTracker > 10000)
        {
          activeTracker = 10000;
        }
    }
  }

  if(activeTracker > 2000)
  {
    music.volume(1.0);
    console.log("music volum up");
  }

  else
  {
    volumeDown();
  }

  // update pixels
  // if this is not familiar watch the coding train video referenced above
  myVideo.updatePixels();

  // flip the video image to be a mirror image of the user
  // translate to the right corner of the canvas
  translate(width, 0);
  // flip the horizontal access with -1 scale
  scale(-1, 1);

  // draw the updated video to the canvas
  image(myVideo, 0, 0, width, height);
}

function volumeDown()
{
  music.volume(0.1);
}

function volumeUp()
{
  music.volume(0.9);
}


