function Filter() {
  this.processImage = function (img, filterName) {
    var imgOut = createImage(img.width, img.height);
    imgOut.loadPixels();
    img.loadPixels();

    for (let x = 0; x < imgOut.width; x++) {
      for (let y = 0; y < imgOut.height; y++) {
        var index = (x + y * imgOut.width) * 4;

        var r = img.pixels[index + 0];
        var g = img.pixels[index + 1];
        var b = img.pixels[index + 2];

        var processedPixel = this.applyFilter(r, g, b, filterName, x, y);

        imgOut.pixels[index + 0] = processedPixel[0];
        imgOut.pixels[index + 1] = processedPixel[1];
        imgOut.pixels[index + 2] = processedPixel[2];
        imgOut.pixels[index + 3] = processedPixel[3];
      }
    }
    imgOut.updatePixels();
    return imgOut;
  };

  this.applyFilter = function (r, g, b, filterName, x, y) {
    var processedPixel;
    if (filterName == "greyscale") processedPixel = greyscaleFilter(r, g, b);
    if (filterName == "redChannel") processedPixel = channel(r, g, b, "red");
    if (filterName == "blueChannel") processedPixel = channel(r, g, b, "green");
    if (filterName == "greenChannel") processedPixel = channel(r, g, b, "blue");
    if (filterName == "redChannelSegment")
      processedPixel = channelSegmentation(r, g, b, "red");
    if (filterName == "blueChannelSegment")
      processedPixel = channelSegmentation(r, g, b, "green");
    if (filterName == "greenChannelSegment")
      processedPixel = channelSegmentation(r, g, b, "blue");
    if (filterName == "hsvColour") processedPixel = rgbToHSV(r, g, b);
    if (filterName == "ycbcrColour") processedPixel = rgbToYCBCR(r, g, b);
    if (filterName == "threshold") processedPixel = thresholdFilter(r, g, b);
    if (filterName == "blur") processedPixel = blur(img, x, y)
    if (filterName == "edge") processedPixel = edgeDetectionFilter(img, x, y)
    return processedPixel;
  };

  this.convolution = function (x, y, matrix, matrixSize, img) {
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
}
