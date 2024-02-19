// https://kylemcdonald.github.io/cv-examples/
// based on https://github.com/mtschirs/js-objectdetect

/** ------------------------------------------------------------------------
GENERAL
Some of the code used are taken from Week 14 - 19 of Coursera videos.
New code will be indicated with appropriate comments.
-------------------------------------------------------------------------- */

let imgWidth = 160, imgHeight = 120; 
let filter; // filter object to apply filters
let webcamStream;
let img; // image captured from webcam, used as base for filters

let pictures = []; // populate with pictures later
let imageLoaded = false; // false until the first image is loaded

/** sliders */ 
let segmentationRSlider, segmentationGSlider, segmentationBSlider, pixelSlider;
/** slider values */ 
var segmentationRVal,
  segmentationGVal,
  segmentationBVal,
  selectFilterVal,
  pixelSize;

/** faceapi variables */ 
let faceapi;
let detections = []; 
let faceX, faceY, faceWidth, faceHeight; // store the coordinates of the detected face
var faceFilterMode = 0; // default is the first greyscale filter


/** ----------------------------------------------------------------------------
 * SETUP
 * Creates canvas, initialises Filter and FaceFilter, captures video
 * Creates sliders
---------------------------------------------------------------------------- */
function setup() {
  const canvas = createCanvas(imgWidth * 3, imgHeight * 6);
  pixelDensity(1); // makes sure it renders correctly on different screens

  // new code
  canvas.parent("canvas");
  filter = new Filter(); // filter object processes images and applies filters
  faceFilter = new FaceFilter(); // faceFilter object applies filters on a detected face

  webcamStream = createCapture(VIDEO); // captures the video from webcam
  webcamStream.size(imgWidth, imgHeight); // resizes the image
  webcamStream.hide();

  // for 5 rows and 3 columns, create a new Picture object and push into pictures array
  for (var i = 0; i < 5; i++) {
    for (var j = 0; j < 3; j++) {
      pictures.push(
        new Picture(imgWidth, imgHeight, j * imgWidth, i * imgHeight)
      );
    }
  }


  // creates the sliders to adjust colour segmentation and pixel size
  segmentationRSlider = createSlider(0, 255, 190);
  segmentationGSlider = createSlider(0, 255, 220);
  segmentationBSlider = createSlider(0, 255, 220);
  pixelSlider = createSlider(2, 10, 5);

  // attach to html element
  segmentationRSlider.parent("redslider");
  segmentationGSlider.parent("greenslider");
  segmentationBSlider.parent("blueslider");
  pixelSlider.parent("pixelslider");
  // end of new code
}
/** ---------------------------------------------------------------------------- */

/** ----------------------------------------------------------------------------
 * DRAW
 * Updates slider values
 * If image is loaded, apply filters that requires updated slider values.
 * If face is detected, apply face filter. 
 * Loop through all the pictures and display on canvas.
----------------------------------------------------------------------------- */
function draw() {
  background(0);

  // new code

  /** get the values of the sliders */ 
  segmentationRVal = segmentationRSlider.value();
  segmentationGVal = segmentationGSlider.value();
  segmentationBVal = segmentationBSlider.value();
  pixelSize = pixelSlider.value();

  /** pass images through the filters */ 
  if (imageLoaded) {
    pictures[6].img = filter.processImage(img, "redChannelSegment");
    pictures[7].img = filter.processImage(img, "blueChannelSegment");
    pictures[8].img = filter.processImage(img, "greenChannelSegment");

    /** if faces are detected */ 
    if (detections.length > 0) {
      for (var f = 0; f < detections.length; f++) { // for every face, apply a filter
        let { _x, _y, _width, _height } = detections[0].alignedRect._box; // position and height of face
        pictures[12].img = faceFilter.processImage(img,_x,_y,_width,_height); // apply the face filter on pictures[12]
      }
    }

    /** call show on each Picture object in pictures array */ 
    for (let i = 0; i < pictures.length; i++) {
        try{
            pictures[i].show(); // displays picture
        }
        catch(err){
            console.log(pictures[i] + " not loaded.")
        }
    }
  }
  // end of new code
}

// new code
function keyPressed() {
  if (keyCode == 83) {
    img = createImage(imgWidth, imgHeight);
    console.log("s is pressed");
    img = webcamStream.get();


    /** Reference for ml5.js face API
    https://www.youtube.com/watch?v=3yqANLRWGLo&list=WL&index=1&t=1228s */ 

    const faceOptions = {
      withLandMarks: true,
      withExpressions: true,
      withDescriptor: false,
      minConfidence: 0.5,
    };

    faceapi = ml5.faceApi(webcamStream, faceOptions, faceLoaded);

    /** loads all the images with the webcam image */
    for (let i = 0; i < pictures.length; i++) {
      pictures[i].loadPicture(img);
    }

    imageLoaded = true; // when imageLoaded is true, the image is drawn in the draw loop

   /** calls a filter on the different images */
    pictures[1].img = filter.processImage(img, "greyscale");
    pictures[3].img = filter.processImage(img, "redChannel");
    pictures[4].img = filter.processImage(img, "blueChannel");
    pictures[5].img = filter.processImage(img, "greenChannel");
    pictures[10].img = filter.processImage(img, "hsvColour");
    pictures[11].img = filter.processImage(img, "ycbcrColour");
    pictures[13].img = filter.processImage(pictures[10].img, "threshold");
    pictures[14].img = filter.processImage(pictures[11].img, "threshold");
  }

  /** apply the filter on the face */
  if (keyCode == 49) faceFilterMode = 1; // press '1' for greyscale
  if (keyCode == 50) faceFilterMode = 2; // press '2' for blur
  if (keyCode == 51) faceFilterMode = 3; // press '3' for colour conversion
  if (keyCode == 52) faceFilterMode = 4; // press '4' for pixelation
}
// end of new code