// reference on poses: https://www.youtube.com/watch?v=OIo-DIOkNVg&t=1s

// new code
/** ------------------------------------------------------------------
 * FACE API - ML5
 ------------------------------------------------------------------- */

/** detect the faces */
function faceLoaded() {
    faceapi.detect(gotFaces);
  }
  
/** recursively detect faces and 'error handling' code */
function gotFaces(error, results) {
  if (error) {
    console.log(error);
    return;
  }
  detections = results; // populate array with results
  console.log("Found a face")
  faceapi.detect(gotFaces)
}

/** ------------------------------------------------------------------
 * HANDPOSE API - ML5
 ------------------------------------------------------------------- */

function modelLoaded(){
  console.log('Model loaded!')
  modelIsLoaded = true;
}


/** when a hand is registered, process the 3rd extension image */
function registerHand() {
  var thumbY; // tip of the thumb
  var ringFingerY; // tip of ring finger

  if(predictions.length < 1) return; // if there are no hands detected, return

  /** store values of tip of thumb and ringfinger */
  thumbY = predictions[0].annotations.thumb[0][1]
  ringFingerY = predictions[0].annotations.ringFinger[0][1]

  /** logic to process thumb and ringfinger positions */

  /** thumbs down */
  if(thumbY > ringFingerY){ // if tip of thumb is lower than tip of ring finger on canvas
    extensions[2].img = filter.processImage(buffer, "redChannel"); 
  } 

  /** thumbs up */
  if(thumbY < ringFingerY){ // if tip of thumb is higher than tip of ring finger on canvas
    extensions[2].img = filter.processImage(buffer, "greenChannel");
  }
}

/** ------------------------------------------------------------------
 * BLUR
 ------------------------------------------------------------------- */

/** function blur creates the Gaussian Kernel and performs convolution on the image */
function blur(img, x, y) {
  var matrix = getGaussianKernel(2,5)
  var c = filter.convolution(x, y, matrix, matrix.length, img); // convolution based on x and y of pixel
  return[c[0],c[1],c[2],255] // return the pixel array
}

// Reference: https://aryamansharda.medium.com/image-filters-gaussian-blur-eb36db6781b1
function getGaussianKernel(size, sigma) {
  let kernel = []; // matrix
  let sum = 0;

  for (let i = 0; i < size; i++) {
    kernel[i] = []; // row
    for (let j = 0; j < size; j++) {
      let x = i - Math.floor(size / 2);
      let y = j - Math.floor(size / 2);
      kernel[i][j] = Math.exp(-(x * x + y * y) / (2 * sigma * sigma)) / (2 * Math.PI * sigma * sigma);
      sum += kernel[i][j];
    }
  }
    // Normalise the kernel
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        kernel[i][j] /= sum; // fraction of all values in kernel
      }
    }
    return kernel; // return the matrix
}

/** ------------------------------------------------------------------
 * Edge detection
 * Reference: Coursera Week 16 (University of London)
 ------------------------------------------------------------------- */
function edgeDetectionFilter(img, x, y){
  // in javascript format, horizontal and vertical line detection
    var matrixX = [    
      [-1, -2, -1],
      [0, 0, 0],
      [1, 2, 1]
  ];
  var matrixY = [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1]
  ];

  /** calculates convolution value using the two matrices */
    var cX = filter.convolution(x, y, matrixX,matrixX.length, img);
    var cY = filter.convolution(x, y, matrixY,matrixY.length, img);

    /** Maps to values between black and white */
    cX = map(abs(cX[0]), 0, 1020, 255, 0);
    cY = map(abs(cY[0]), 0, 1020, 255, 0);
    var combo = cX + cY;

    var line

    // if the values are significant, return a black pixel
    if(combo < 450){ 
      alpha = map(combo, 0, 450, 0, 255)
      line = 0
    }
    else(alpha = 0) 
    return [line,line,line, alpha]  // an alpha value of 0 to 255
}

/** ------------------------------------------------------------------
 * Lerp filter
 * takes in two colours and the brightness value of a single pixel
 * lerp depends on brightness value
 * return an array of the lerped color
 ------------------------------------------------------------------- */
function lerpFilter(c1,c2,brightness){
  let value = map(brightness, 0, 100, 0, 1) // map brightness from (0 to 100) to (0,1)
  // if value is 0, the pixel colour will be c1
  // if value is 1, the pixel colour will be c2
  let altColour = lerpColor(c1,c2,value) 
  return [altColour.levels[0],altColour.levels[1],altColour.levels[2],255] // return the  altered color
}

// end of new code