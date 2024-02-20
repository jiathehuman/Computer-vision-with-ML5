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
  handpose.on("predict", results => {
    predictions = results;
  });
  handpose.predict(img);
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints(img) {
  push();
  translate(imgWidth * 3, imgHeight);
  // scale(4)
  for (let i = 0; i < predictions.length; i += 1) {
    const prediction = predictions[i];
    for (let j = 0; j < prediction.landmarks.length; j += 1) {
      const keypoint = prediction.landmarks[j];
      fill(255, 255, 0);
      noStroke();
      ellipse(keypoint[0], keypoint[1], 5, 5);
    }

    for (let j = 0; j < prediction.annotations.thumb.length; j += 1) {
      const keypoint = prediction.annotations.thumb[j];
      fill(0, 255, 0);
      noStroke();
      ellipse(keypoint[0], keypoint[1], 5, 5);
    }
  }
  pop();
}
// end of new code


