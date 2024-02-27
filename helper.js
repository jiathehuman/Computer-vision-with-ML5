// reference on poses: https://www.youtube.com/watch?v=OIo-DIOkNVg&t=1s
// new code
function faceLoaded() {
    faceapi.detect(gotFaces);
  }
  
/** 'error handling' code */
function gotFaces(error, results) {
  if (error) {
    console.log(error);
    return;
  }
  detections = results;
  console.log("Found a face")
  faceapi.detect(gotFaces)
}

function modelLoaded(){
  console.log('Model loaded!')
  modelIsLoaded = true;
}

// A function to draw ellipses over the detected keypoints
function registerHand(img) {
  push();
  // translate(extensions[1].x, extensions[1].y)
  var thumbY;
  var ringFingerY;
  if(predictions.length < 1) return;
  thumbY = predictions[0].annotations.thumb[0][1]
  ringFingerY = predictions[0].annotations.ringFinger[0][1]

  if(thumbY > ringFingerY){
    extensions[2].img = filter.processImage(buffer, "redChannel");
  } 
  if(thumbY < ringFingerY){
    extensions[2].img = filter.processImage(buffer, "greenChannel");
  }
  pop();
}

function blur(img, x, y) {
  var matrix = getGaussianKernel(2,5)
  var c = filter.convolution(x, y, matrix, matrix.length, img);
  return[c[0],c[1],c[2],255]
}

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

  /** Calculates convolution value using the two matrices */
    var cX = filter.convolution(x, y, matrixX,matrixX.length, img);
    var cY = filter.convolution(x, y, matrixY,matrixY.length, img);

    /** Maps to values between black and white */
    cX = map(abs(cX[0]), 0, 1020, 255, 0);
    cY = map(abs(cY[0]), 0, 1020, 255, 0);
    var combo = cX + cY;

    var line

    if(combo < 450){
      alpha = map(combo, 0, 450, 0, 255)
      line = 0
    }
    else(alpha = 0)
    return [line,line,line, alpha]
}

function lerpFilter(c1,c2,brightness){
  let value = map(brightness, 0, 100, 0, 1)
  let altColour = lerpColor(c1,c2,value)
  return [altColour.levels[0],altColour.levels[1],altColour.levels[2],255]
}


//https://aryamansharda.medium.com/image-filters-gaussian-blur-eb36db6781b1
function getGaussianKernel(size, sigma) {
  let kernel = [];
  let sum = 0;

  for (let i = 0; i < size; i++) {
    kernel[i] = [];
    for (let j = 0; j < size; j++) {
      let x = i - Math.floor(size / 2);
      let y = j - Math.floor(size / 2);
      kernel[i][j] = Math.exp(-(x * x + y * y) / (2 * sigma * sigma)) / (2 * Math.PI * sigma * sigma);
      sum += kernel[i][j];
    }
  }
    // Normalize the kernel
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        kernel[i][j] /= sum;
      }
    }
  
    return kernel;
}

// function loadImages(){
//   for (let i = 0; i < pictures.length; i++) {
//     pictures[i].loadPicture(buffer);
//     pictures[i].loaded = true;
//     loadCount++;
//   }

//   for (let i = 0; i < extensions.length; i++) {
//     extensions[i].loadPicture(buffer);
//     extensions[i].loaded = true;
//     loadCount++;
//   }
// }
