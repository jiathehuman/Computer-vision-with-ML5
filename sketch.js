/**----------------------------------------------------------------------------------------------------
 *
-------------
INSTRUCTIONS
-------------
Press 's' on keyboard to capture your image and start the image processing.
Refresh browser if necessary.

Give a few seconds for the face-api and hand-pose to load.

-------------
EXTENSION
-------------
1. Cartoon Effect
Cartoon effect is made with a blur filter, and image detection to draw the outlines of objects.

2. Hand Gesture
When hand-pose has loaded (check top right hand corner for status), do a thumbs-up or down gesture.
The third image in the first row of extensions should flicker green or red.

3. Color Lerping
The outline of your silhouette is captured, based on the brightness value of each pixel.

4. Mosaic effect
The effect is created by taking the brightness value of each pixel and drawing circles in its place.

4. Postal sticker effect
This filter takes in the image, distils it down into rectangles and applies a rotation based on mouseX and Y.


Note:
Some of the code used are taken from Week 14 - 19 of Coursera videos.
New code will be indicated with appropriate comments.
------------------------------------------------------------------------------------------------------------ */

let imgWidth = 160,
  imgHeight = 120;

let filter; // filter object to apply filters
let webcamStream; // captured video from webcam
let img; // image gotten from webcamStream, used as base for filters

let pictures = []; // populated with pictures later
let extensions = []; // populated with pictures used for extensions later

let imageLoaded = false; // true when all images are loaded
let loadCount = 0; 

var modelIsLoaded = false; // handpose model

/** text for the pictures */
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
let faceapi; // faceapi object
let detections = []; // faces detected
let faceX, faceY, faceWidth, faceHeight; // store the coordinates of the detected face
var faceFilterMode = 0; // default is the first greyscale filter

let handpose; // handpose api
let predictions = []; // hands detected

let buffer; // created from img, used for still images


/** ----------------------------------------------------------------------------
 * SETUP
 * Creates canvas, initialises Filter and FaceFilter, captures video
 * Creates sliders
 * Instantiate faceapi
---------------------------------------------------------------------------- */
function setup() {
  const canvas = createCanvas(imgWidth * 7 + 10, imgHeight * 8); // canvas to draw on
  canvas.elt.setAttribute("willReadFrequently", "true");
  canvas.parent("canvas"); 

  pixelDensity(1); // makes sure it renders correctly on different screens
  angleMode(DEGREES)

  /** start of new code */
  frameRate(10);
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

  /** extension: 2 rows x 3 columns of Picture objects */ 
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

  /** img continuously created from webcam stream */
  img = createImage(imgWidth, imgHeight);
  /** buffer will contain 1 snapshot from img ^ */
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

  /** options for face detection */
  const faceOptions = {
    withLandMarks: true,
    withDescriptor: true,
    minConfidence: 0.5,
  };

  /** instantiate face api */
  faceapi = ml5.faceApi(webcamStream, faceOptions, faceLoaded);

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

  // start of new code
  background(20, 10, 30);
  img = webcamStream.get();
  image(webcamStream, imgWidth*6 + 10, 0) // places webcamStream at top right

  

  /** Draw the text on canvas */
  fill(255);

  /** Text for required filters */
  textSize(15);
  for (var i = 0; i < picturesText.length; i++) {
    for (var j = 0; j < picturesText[i].length; j++) {
      text(
        picturesText[i][j] + "  ↓ ",
        20 + j * imgWidth,
        40 + i * (imgHeight + 50)
      );
    }
  }

  /** Text for extensions */
  textSize(25);
  text("Extensions", imgWidth * 4, 50);

  textSize(14);
  /** top right text, when string is 'true', user can do thumbs up and down gesture */
  text("* Hand model ready: " + str(modelIsLoaded), imgWidth * 5 - 10, 30);

  textSize(15);
  text("Cartoon Effect" + "  ↓ ", imgWidth * 3 + 30, 80);
  text("Do thumbs up/down when model loaded*.", imgWidth * 4 + 10, 80);
  text("Color Lerping" + "  ↓ ", imgWidth * 4 + 10, imgHeight + 120);

  text("Mosaic effect" + "  ↓ ", imgWidth * 3 + 30, imgHeight * 3 + 50);
  text("Postal sticker effect" + "  ↓ ", imgWidth * 4 + 10, imgHeight * 3 + 50);



  /** if not all images are loaded */
  if (!imageLoaded) {
    return;
  }

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

  if (detections.length > 0) { // if face(s) are detected
    for (var f = 0; f < detections.length; f++) { // for each face
      /** get the top left position, width and height of face */
      let { _x, _y, _width, _height } = detections[0].alignedRect._box; 

      /** apply the face filter on pictures[12]*/
      pictures[12].img = faceFilter.processImage(webcamStream, _x, _y, _width, _height); 
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

  /** if a hand is detected on screen, call function to manipulate canvas */
  if (detections.length > 0) {
    registerHand();
  }

  /** draw the image with cartoon filter */
  image(cartoonImg, extensions[0].x, extensions[0].y)

  /** call the mosaic and postalImg filters, which also draws the filtered image */
  mosaic(buffer, extensions[3].x, extensions[3].y + imgHeight + 50); 
  postalImg(buffer, extensions[4].x, extensions[3].y + imgHeight + 50)

}
// end of new code

// new code
function keyPressed() {
  if (keyCode == 83) {

    /** Reference for ml5.js face API
    https://www.youtube.com/watch?v=3yqANLRWGLo&list=WL&index=1&t=1228s */

    buffer = webcamStream.get(); // buffer is an instance of the webcam stream


    // HANDPOSE
    handpose = ml5.handpose(webcamStream, modelLoaded); // instantiate
    // what to do when hands are detected
    handpose.on("hand", (results) => {
      predictions = results; // predictions populated with hand detected
    });


    /** loads images and increments loadCount */

    /** loads all the images with the buffer */
    for (let i = 0; i < pictures.length; i++) {
      pictures[i].loadPicture(buffer);
      loadCount++;
    }
  
    /** loads all the extension images with the buffer */
    for (let i = 0; i < extensions.length; i++) {
      extensions[i].loadPicture(buffer);
      loadCount++;
    }



    /** calls a filter on the buffer */
    pictures[1].img = filter.processImage(buffer, "greyscale");
    pictures[3].img = filter.processImage(buffer, "redChannel");
    pictures[4].img = filter.processImage(buffer, "greenChannel");
    pictures[5].img = filter.processImage(buffer, "blueChannel");
    pictures[10].img = filter.processImage(buffer, "hsvColour"); // hsv image
    pictures[11].img = filter.processImage(buffer, "ycbcrColour"); // ycbcr image
    pictures[13].img = filter.processImage(pictures[10].img, "threshold"); // threshold on hsv image
    pictures[14].img = filter.processImage(pictures[11].img, "threshold"); // threshold on ycbcr image
    extensions[3].img = filter.processImage(buffer, "popartRed");
    extensions[4].img = filter.processImage(buffer, "popartGreen");
    extensions[5].img = filter.processImage(buffer, "popartBlue");
    /** cartoon image is a mix of greyscale filter and edge detection filter */
    cartoonImg = filter.processImage(pictures[1].img, "edge"); 

    /** checks to see if all pictures are loaded */
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
