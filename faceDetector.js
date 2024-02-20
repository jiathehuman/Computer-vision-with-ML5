class FaceFilter {
  constructor() {}

  processImage = function (img, startX, startY, fwidth, fheight) {
    var imgOut = createImage(img.width, img.height);
    imgOut = img.get();
    imgOut.loadPixels();
    img.loadPixels();

    if (faceFilterMode == 4) {
      let pixelatedSize = pixelSize;
      for (var y = startY; y < startY + fheight; y += pixelatedSize) {
        for (var x = startX; x < startX + fwidth; x += pixelatedSize) {
          var sumRed = 0;
          var sumGreen = 0;
          var sumBlue = 0;

          //get the sum of RGB of that block
          for (var i = 0; i < pixelatedSize; i++) {
            for (var j = 0; j < pixelatedSize; j++) {
              var pixelColour = img.get(x + i, y + j);
              var r = pixelColour[0];
              var g = pixelColour[1];
              var b = pixelColour[2];
              sumRed += r;
              sumGreen += g;
              sumBlue += b;
            }
          }
          //calculate the ave of RGB of that block
          var aveRed = sumRed / (pixelatedSize * pixelatedSize);
          var aveGreen = sumGreen / (pixelatedSize * pixelatedSize);
          var aveBlue = sumBlue / (pixelatedSize * pixelatedSize);
          var avgColour = color(aveRed, aveGreen, aveBlue);
          //paint the block with the ave RGB value
          for (var i = 0; i < pixelatedSize; i++) {
            for (var j = 0; j < pixelatedSize; j++) {
              // var pixelIndex = (img.width * (y + j) + (x + i)) * 4;
              imgOut.set(x + i, y + j, avgColour);
            }
          }
        }
      }
    } else {
      for (let x = 0; x < imgOut.width; x++) {
        for (let y = 0; y < imgOut.height; y++) {
          var index = (x + y * imgOut.width) * 4;

          var r = img.pixels[index + 0];
          var g = img.pixels[index + 1];
          var b = img.pixels[index + 2];

          if (
            x > startX &&
            x < startX + fwidth &&
            y > startY &&
            y < startY + fheight
          ) {
            var processedPixel = this.applyFilter(
              r,
              g,
              b,
              img,
              x,
              y,
              startX,
              startY,
              fwidth,
              fheight
            );
            imgOut.pixels[index + 0] = processedPixel[0];
            imgOut.pixels[index + 1] = processedPixel[1];
            imgOut.pixels[index + 2] = processedPixel[2];
            imgOut.pixels[index + 3] = 255;
          }
        }
      }
    }
    imgOut.updatePixels();
    return imgOut;
  };

  applyFilter = function (r, g, b, img, x, y) {
    var processedPixel;
    if (faceFilterMode == 0 || faceFilterMode == 1)
      processedPixel = greyscaleFilter(r, g, b);
    else if (faceFilterMode == 2) processedPixel = this.blur(img, x, y);
    else if (faceFilterMode == 3) processedPixel = rgbToYCBCR(r, g, b);
    return processedPixel;
  };

  blur(img, x, y) {
    var matrix = [
      [1 / 9, 1 / 9, 1 / 9],
      [1 / 9, 1 / 9, 1 / 9],
      [1 / 9, 1 / 9, 1 / 9],
    ];
    var c = this.convolution(x, y, matrix, matrix.length, img);
    return c;
  }

  convolution(x, y, matrix, matrixSize, img) {
    var totalRed = 0.0;
    var totalGreen = 0.0;
    var totalBlue = 0.0;
    var offset = floor(matrixSize / 2);

    // convolution matrix loop
    for (var i = 0; i < matrixSize; i++) {
      for (var j = 0; j < matrixSize; j++) {
        // Get pixel loc within convolution matrix
        var xloc = x + i - offset;
        var yloc = y + j - offset;
        var index = (xloc + img.width * yloc) * 4;
        // ensure we don't address a pixel that doesn't exist
        index = constrain(index, 0, img.pixels.length - 1);

        // multiply all values with the mask and sum up
        totalRed += img.pixels[index + 0] * matrix[i][j];
        totalGreen += img.pixels[index + 1] * matrix[i][j];
        totalBlue += img.pixels[index + 2] * matrix[i][j];
      }
    }
    // return the new color
    return [totalRed, totalGreen, totalBlue];
  }

  faceLandmarks(detections, x, y) {
    if (detections.length > 0) {
        let points = detections[0].landmarks._positions;
      push();
      translate(x, y);
      for (let i = 0; i < points.length; i++) {
        stroke(255,0,0);
        strokeWeight(1);
        point(points[i]._x, points[i]._y);
      }
      pop();

      push()
      translate(imgWidth * 5, imgHeight);
      for (let i = 0; i < points.length; i++) {
        stroke(255,0,0);
        strokeWeight(1);
        point(points[i]._x, points[i]._y);
      }
      pop();

    }
  }
}
