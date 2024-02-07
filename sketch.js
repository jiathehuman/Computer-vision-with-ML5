// https://kylemcdonald.github.io/cv-examples/
// based on https://github.com/mtschirs/js-objectdetect

/* --------------------------------------------------------------------------
COMMENTARY
Some of the code used are taken from Week 14 - 19 of Coursera videos.
New code will be indicated with appropriate comments.
-------------------------------------------------------------------------- */

let imgWidth = 160, imgHeight = 120;
let filter; // filter object to apply filters
let webcamStream;
let img; // image captured from webcam, used as base for filters

let segmentationRSlider, segmentationGSlider, segmentationBSlider, pixelSlider;
var segmentationRVal,
  segmentationGVal,
  segmentationBVal,
  selectFilterVal,
  pixelSize;

let faceapi;
let detections = []; // populate with pictures later
let pictures = [];

let imageLoaded = false;
let faceX, faceY, faceWidth, faceHeight; // store the coordinates of the detected face
var faceFilterMode = 0;

////////////////////////////////////////////////////////////////
function setup() {
  const canvas = createCanvas(imgWidth * 3, imgHeight * 6);
  pixelDensity(1); // makes sure it renders correctly on different screens

  // new code
  canvas.parent("canvas");
  filter = new Filter(); // create a new filter object which processes images and applies filters
  faceFilter = new FaceFilter(); // create a new faceFilter object to apply filters on a detected face

  // for 5 rows and 3 columns, create a new Picture object and push into pictures array
  for (var i = 0; i < 5; i++) {
    for (var j = 0; j < 3; j++) {
      pictures.push(
        new Picture(imgWidth, imgHeight, j * imgWidth, i * imgHeight)
      );
    }
  }

  webcamStream = createCapture(VIDEO); // captures the video from webcam
  webcamStream.size(imgWidth, imgHeight); // resizes the image
  webcamStream.hide();

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
}
///////////////////////////////////////////////////////////////
function faceLoaded() {
  faceapi.detect(gotFaces);
}

// error handling code
function gotFaces(error, results) {
  if (error) {
    console.log(error);
    return;
  }
  detections = results;
}
///////////////////////////////////////////////////////////////
function draw() {
  background(0);
  // get the values of the sliders
  segmentationRVal = segmentationRSlider.value();
  segmentationGVal = segmentationGSlider.value();
  segmentationBVal = segmentationBSlider.value();
  pixelSize = pixelSlider.value();

  // pass images through the filters
  if (imageLoaded) {
    pictures[6].img = filter.processImage(img, "redChannelSegment");
    pictures[7].img = filter.processImage(img, "blueChannelSegment");
    pictures[8].img = filter.processImage(img, "greenChannelSegment");
    pictures[10].img = filter.processImage(img, "hsvColour");
    pictures[11].img = filter.processImage(img, "ycbcrColour");
    pictures[13].img = filter.processImage(pictures[10].img, "threshold");
    pictures[14].img = filter.processImage(pictures[11].img, "threshold");

    // if more than one face is detected
    if (detections.length > 0) {
      for (var f = 0; f < detections.length; f++) { // for every face, apply a filter
        let { _x, _y, _width, _height } = detections[0].alignedRect._box; // position and height of face
        // apply the filter and display it at pictures[12]
        pictures[12].img = faceFilter.processImage(
          img,
          _x,
          _y,
          _width,
          _height
        );
      }
    }

    // call show on each Picture object in pictures array
    for (let i = 0; i < pictures.length; i++) {
      pictures[i].show(); // displays picture
    }
  }
}

function keyPressed() {
  if (keyCode == 83) {
    // 's' is pressed
    img = createImage(imgWidth, imgHeight);
    console.log("s is pressed");
    img = webcamStream.get();
    imageLoaded = true;
    const faceOptions = {
      withLandMarks: true,
      withExpressions: true,
      withDescriptor: false,
      minConfidence: 0.5,
    };

    // faceDetector = new FaceDetector()
    faceapi = ml5.faceApi(webcamStream, faceOptions, faceLoaded);

    for (let i = 0; i < pictures.length; i++) {
      pictures[i].loadPicture(img);
    }

    pictures[1].img = filter.processImage(img, "greyscale");
    pictures[3].img = filter.processImage(img, "redChannel");
    pictures[4].img = filter.processImage(img, "blueChannel");
    pictures[5].img = filter.processImage(img, "greenChannel");
  }

  if (keyCode == 49) faceFilterMode = 1; // press '1' for greyscale
  if (keyCode == 50) faceFilterMode = 2; // press '2' for blur
  if (keyCode == 51) faceFilterMode = 3;
  if (keyCode == 52) faceFilterMode = 4;
}
