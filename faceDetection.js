function detectFilter(img) {
  img.loadPixels();
  var imgOut = createImage(img.width, img.height);
  imgOut.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
  imgOut.loadPixels();
  // img.loadPixels();

  faces = detector.detect(imgOut.canvas);
//   console.log("detect filter is called");

  console.log(faces.length);

  for (var i = 0; i < faces.length; i++) {
    var face = faces[i];
    if (face[4] > 4) {
      var startX = int(face[0]);
      var startY = int(face[1]);
      var fwidth = int(face[2]);
      var fheight = int(face[3]);

      fill(255);
      rect(face[0], face[1], face[2], face[3]);

      for (var y = startY; y < startY + fheight; y++) {
        for (var x = startX; x < startX + fwidth; x++) {
          var pixelIndex = (imgOut.width * y + x) * 4;

          // white box over face
          imgOut.pixels[pixelIndex + 0] = 255;
          imgOut.pixels[pixelIndex + 1] = 255;
          imgOut.pixels[pixelIndex + 2] = 0;
          imgOut.pixels[pixelIndex + 3] = 255;
        }
        // console.log("this");
      }
    }
  }

  imgOut.updatePixels();
  return imgOut;
}
