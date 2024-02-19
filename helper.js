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

// end of new code