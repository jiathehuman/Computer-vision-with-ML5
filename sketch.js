// https://kylemcdonald.github.io/cv-examples/
// based on https://github.com/mtschirs/js-objectdetect

/** ------------------------------------------------------------------------
GENERAL
Some of the code used are taken from Week 14 - 19 of Coursera videos.
New code will be indicated with appropriate comments.
-------------------------------------------------------------------------- */

let imgWidth = 160,
  imgHeight = 120;
let filter; // filter object to apply filters
let webcamStream;
let img; // image captured from webcam, used as base for filters

let pictures = []; // populate with pictures later
let extensions = [];
let imageLoaded = false;
let loadCount = 0;
var modelIsLoaded = false;

let picturesText = [
  ["Regular", "Greyscale", "Regular"],
  ["Red Channel", "Green Channel", "Blue Channel"],
  ["R Segmentation", "G Segmentation", "B Segmentation"],
  ["Regular", "HSV Color Space", "Ycbcr Color Space"],
  ["Face Filters", "Threshold HSV", "Threshold Ycbcr"],
];

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

let handpose;
let predictions = [];

var buffer;
var cartoonImg

let gui;
let colorPicker1, colorPicker2;

let poseNet, pose;

// var overlay;
// var faceImg

/** ----------------------------------------------------------------------------
 * SETUP
 * Creates canvas, initialises Filter and FaceFilter, captures video
 * Creates sliders
---------------------------------------------------------------------------- */
function setup() {
  const canvas = createCanvas(imgWidth * 7 + 10, imgHeight * 8);
  canvas.elt.setAttribute("willReadFrequently", "true");
  canvas.parent("canvas");

  pixelDensity(1); // makes sure it renders correctly on different screens

  /** start of new code */
  frameRate(20);
  filter = new Filter(); // initialises filter object 
  faceFilter = new FaceFilter(); // initialises faceFilter object

  webcamStream = createCapture(VIDEO); // captures video from webcam
  webcamStream.size(imgWidth, imgHeight); // resizes image
  webcamStream.hide();

  /** create 5 rows x 3 columns of Picture objects */ 
  for (var i = 0; i < 5; i++) {
    for (var j = 0; j < 3; j++) {
      pictures.push(
        new Picture(
          imgWidth,
          imgHeight,
          j * imgWidth,
          50 + i * (imgHeight + 50)
        ) // passing in x and y coordinates
      );
    }
  }

  /** extension: 2 rows x 3 columns */ 
  for (var i = 0; i < 2; i++) {
    for (var j = 0; j < 3; j++) {
      var start_x = imgWidth * 3;
      extensions.push(
        new Picture(
          imgWidth,
          imgHeight,
          start_x + j * imgWidth,
          90 + i * (imgHeight + 50)
        )
      );
    }
  }

  /** buffer will contain 1 frame (snapshot) of webcam stream */
  buffer = createImage(imgWidth, imgHeight);

  /** creates the sliders to adjust colour segmentation and pixel size */ 
  segmentationRSlider = createSlider(0, 255, 190);
  segmentationGSlider = createSlider(0, 255, 220);
  segmentationBSlider = createSlider(0, 255, 220);
  pixelSlider = createSlider(2, 10, 5);

  /** attach to html element*/ 
  segmentationRSlider.parent("redslider");
  segmentationGSlider.parent("greenslider");
  segmentationBSlider.parent("blueslider");
  pixelSlider.parent("pixelslider");

  /** end of new code */ 
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
  background(20, 10, 30);
  img = createImage(imgWidth, imgHeight);
  img = webcamStream.get();
  image(webcamStream, imgWidth*6 + 10, 0)

  fill(255);
  textSize(25);
  text("Extensions", imgWidth * 4, 50);

  textSize(14);
  text("* Hand model ready: " + str(modelIsLoaded), imgWidth * 5 - 10, 30);

  textSize(15);
  text("Cartoon Effect" + "  ↓ ", imgWidth * 3 + 30, 80);
  text("Do thumbs up/down when model loaded*.", imgWidth * 4 + 10, 80);
  text("Color Lerping" + "  ↓ ", imgWidth * 4 + 10, imgHeight + 120);

  for (var i = 0; i < picturesText.length; i++) {
    for (var j = 0; j < picturesText[i].length; j++) {
      text(
        picturesText[i][j] + "  ↓ ",
        30 + j * imgWidth,
        40 + i * (imgHeight + 50)
      );
    }
  }

  // new code
  if (!imageLoaded) {
    return;
  }
  // image(webcamStream, imgWidth * 3, imgHeight * 5);

  /** get the values of the sliders */
  segmentationRVal = segmentationRSlider.value();
  segmentationGVal = segmentationGSlider.value();
  segmentationBVal = segmentationBSlider.value();

  pixelSize = pixelSlider.value();

  /** pass images through the filters */
  pictures[6].img = filter.processImage(buffer, "redChannelSegment");
  pictures[7].img = filter.processImage(buffer, "greenChannelSegment");
  pictures[8].img = filter.processImage(buffer, "blueChannelSegment");

  /** if faces are detected */
  if (detections.length > 0) {
    for (var f = 0; f < detections.length; f++) {
      // for every face, apply a filter
      let { _x, _y, _width, _height } = detections[0].alignedRect._box; // position and height of face
      pictures[12].img = faceFilter.processImage(buffer, _x, _y, _width, _height); // apply the face filter on pictures[12]
    }
  }

  /** call show on each Picture and Extension object to display the image */
  try {
    for (let i = 0; i < pictures.length; i++) {
      pictures[i].show();
    }
    for (let i = 0; i < extensions.length; i++) {
      extensions[i].show();
    }
  } catch (error) {
    console.log(error);
    return;
  }

  // image(buffer, extensions[0].x, extensions[0].y);
  image(cartoonImg, extensions[0].x, extensions[0].y)
  faceFilter.faceLandmarks(img, detections, extensions[3].x, extensions[3].y);

  if (detections.length > 0) {
    drawKeypoints(img);
  }
}
// end of new code

// new code
function keyPressed() {
  if (keyCode == 83) {
    // img = createImage(imgWidth, imgHeight);
    // img = webcamStream.get();

    /** Reference for ml5.js face API
    https://www.youtube.com/watch?v=3yqANLRWGLo&list=WL&index=1&t=1228s */

    buffer = img.get();
    const faceOptions = {

      withLandMarks: true,
      withDescriptor: true,
      minConfidence: 0.5,
    };

    faceapi = ml5.faceApi(webcamStream, faceOptions, faceLoaded);

    // HANDPOSE
    handpose = ml5.handpose(webcamStream, modelLoaded);
    handpose.on("hand", (results) => {
      predictions = results;
    });

    /** loads all the images with the webcam image */
    loadImages();

    /** calls a filter on the different images */
    pictures[1].img = filter.processImage(img, "greyscale");
    pictures[3].img = filter.processImage(img, "redChannel");
    pictures[4].img = filter.processImage(img, "greenChannel");
    pictures[5].img = filter.processImage(img, "blueChannel");
    pictures[10].img = filter.processImage(img, "hsvColour");
    pictures[11].img = filter.processImage(img, "ycbcrColour");
    // pictures[12].img = buffer;
    pictures[13].img = filter.processImage(pictures[10].img, "threshold");
    pictures[14].img = filter.processImage(pictures[11].img, "threshold");

    extensions[3].img = filter.processImage(img, "popartRed");
    extensions[4].img = filter.processImage(img, "popartGreen");
    extensions[5].img = filter.processImage(img, "popartBlue");

    cartoonImg = filter.processImage(pictures[1].img, "edge");

    if (loadCount == pictures.length + extensions.length) {
      imageLoaded = true; // when imageLoaded is true, the image is drawn in the draw loop
    }
  }

  /** apply the filter on the face */
  if (keyCode == 49) faceFilterMode = 1; // press '1' for greyscale
  if (keyCode == 50) faceFilterMode = 2; // press '2' for blur
  if (keyCode == 51) faceFilterMode = 3; // press '3' for colour conversion
  if (keyCode == 52) faceFilterMode = 4; // press '4' for pixelation
}
// end of new code
