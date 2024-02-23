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
}

// function poseLoaded(){
//   console.log('pose net is ready')
// }

// function gotPoses(poses){
//   // console.log(poses);
//   if(poses.length>0){
//     pose = poses[0].pose;
//   }
// }

function modelLoaded(){
  console.log('Model loadeed!')

  // handpose.on("predict", results => {
  //   predictions = results;
  // });
  // handpose.predict(img);
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints(img) {
  push();
  translate(width/2, height/2);
  // scale(4)
  var thumbY;
  var ringFingerY;
  if(predictions.length < 1) return;
  thumbY = predictions[0].annotations.thumb[0][1]
  ringFingerY = predictions[0].annotations.ringFinger[0][1]

  fill(0)
  ellipse(predictions[0].annotations.thumb[0][0], predictions[0].annotations.thumb[0][1], 10, 10)
  ellipse(predictions[0].annotations.ringFinger[0][0], predictions[0].annotations.ringFinger[0][1], 10, 10)


  if(thumbY > ringFingerY){
    console.log("Thumbs down") 
    push()
    fill(255,0,0)
    translate(width/2, height/2)
    rect(0,0,200,700)
    pop()
  } 
  if(thumbY < ringFingerY){

    push()
    console.log("Thumbs up") 
    fill(0,255,0)
    translate(width/2, height/2)
    rect(0,0,200,700)
    pop()
  }

    // for (let i = 0; i < predictions.length; i += 1) {
  //   const prediction = predictions[i];
  //   thumbY = predictions[0].annotations.thumb[0][1]
  //   ringFingerY = predictions[0].annotations.ringFinger[0][1]

    // for (let j = 0; j < prediction.landmarks.length; j += 1) {
    //   const keypoint = prediction.landmarks[j];
    //   fill(255, 255, 0);
    //   noStroke();
    //   ellipse(keypoint[0], keypoint[1], 10, 10);

    // }

    // for (let j = 0; j < prediction.annotations.thumb.length; j += 1) {
    //   const keypoint = prediction.annotations.thumb[j];
    //   fill(0, 255, 0);
    //   noStroke();
    //   ellipse(keypoint[0], keypoint[1], 10, 10);
    // }
  // }

  

  // CODE FOR FACE BELOW
  // for (let i = 0; i < detections.length; i += 1) {
  //   const prediction = detections[i];
  //   for (let j = 0; j < prediction.landmarks.length; j += 1) {
  //     const keypoint = prediction.landmarks[j];
  //     fill(255, 255, 0);
  //     noStroke();
  //     ellipse(keypoint[0], keypoint[1], 5, 5);
  //   }
  //   //  END OF CODE FOR FACE

  //   // for (let j = 0; j < prediction.annotations.thumb.length; j += 1) {
  //   //   const keypoint = prediction.annotations.thumb[j];
  //   //   fill(0, 255, 0);
  //   //   noStroke();
  //   //   ellipse(keypoint[0], keypoint[1], 5, 5);
  //   // }
  // }
  pop();
}
// end of new code

function blur(img, x, y) {
  var matrix = getGaussianKernel(2,5)
  var c = filter.convolution(x, y, matrix, matrix.length, img);
  // return c;
  return[c[0],c[1],c[2],255]
}

function edgeDetectionFilter(img, x, y){
    var matrixX = [    // in javascript format
      [-1, -2, -1],
      [0, 0, 0],
      [1, 2, 1]
  ];
  //vertical edge detection / horizontal lines
  var matrixY = [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1]
  ];
    var cX = filter.convolution(x, y, matrixX,matrixX.length, img);
    var cY = filter.convolution(x, y, matrixY,matrixY.length, img);

    cX = map(abs(cX[0]), 0, 1020, 255, 0);
    cY = map(abs(cY[0]), 0, 1020, 255, 0);
    var combo = cX + cY;

    // var r = g = b =0
    var c

    if(combo < 450){
        // combo = 0;
      c = 0
      alpha = 255
    }
    else(alpha = 0)
    return [c,c,c, alpha]
}

function popFilter(c1,c2,brightness){

  let value = map(brightness, 0, 100, 0, 1)
  let altColour = lerpColor(c1,c2,value)

  return [altColour.levels[0],altColour.levels[1],altColour.levels[2],255]
  // end of new code
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

function loadImages(){

  for (let i = 0; i < pictures.length; i++) {
    pictures[i].loadPicture(img);
    pictures[i].loaded = true;
    loadCount++;
  }

  for (let i = 0; i < extensions.length; i++) {
    extensions[i].loadPicture(img);
    extensions[i].loaded = true;
    loadCount++;
  }
}
