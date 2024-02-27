/** ----------------------------------------------------------------------------------------
 * FILTER CLASS
 * 
 * processImage() takes in an image and a filtername. It will apply the filter on the image and 
 * return the altered image.
 * 
 * applyFilter() applies a filter on a single pixel, based on filterName.
 * 
 * convolution() applies convolution.
 ------------------------------------------------------------------------------------------ */

function Filter() {
  /** takes in image and apply the filter */
  this.processImage = function (img, filterName) {
    let imgOut = createImage(imgWidth, imgHeight);
    imgOut.loadPixels();
    img.loadPixels();

    // for each pixel, loop through the x and y coordinates
    for (let x = 0; x < imgOut.width; x++) {
      for (let y = 0; y < imgOut.height; y++) {
        let index = (x + y * imgOut.width) * 4;
        // get original r, g, b values
        let r = img.pixels[index + 0];
        let g = img.pixels[index + 1];
        let b = img.pixels[index + 2];

        let pixelColour = color(r, g, b); // create a p5 color object for the r,g,b values
        let brightnessVal = brightness(pixelColour); // calculate brightness of that pixel

        /** apply the filter on that pixel */
        let processedPixel = this.applyFilter(
          r,
          g,
          b,
          filterName,
          x,
          y,
          brightnessVal
        );

        /** replace the original pixel with the altered pixel */
        imgOut.pixels[index + 0] = processedPixel[0];
        imgOut.pixels[index + 1] = processedPixel[1];
        imgOut.pixels[index + 2] = processedPixel[2];
        imgOut.pixels[index + 3] = processedPixel[3];
      }
    }
    imgOut.updatePixels(); // update the altered image
    return imgOut; // return the processed image
  };

  /** for each pixel, apply the appropriate filter and return new pixel */
  this.applyFilter = function (r, g, b, filterName, x, y, brightness) {
    let processedPixel; // to hold processed pixel values array

    /** depending on the name of filter, apply the appropriate function on that pixel */
    if (filterName == "greyscale") processedPixel = greyscaleFilter(r, g, b); // greyscale filter

    if (filterName == "redChannel") processedPixel = channel(r, g, b, "red"); 
    if (filterName == "blueChannel") processedPixel = channel(r, g, b, "blue");
    if (filterName == "greenChannel")
      processedPixel = channel(r, g, b, "green");

    if (filterName == "redChannelSegment")
      processedPixel = channelSegmentation(r, g, b, "red");

    if (filterName == "greenChannelSegment")
      processedPixel = channelSegmentation(r, g, b, "green");

    if (filterName == "blueChannelSegment")
      processedPixel = channelSegmentation(r, g, b, "blue");

    if (filterName == "hsvColour") processedPixel = rgbToHSV(r, g, b);
    if (filterName == "ycbcrColour") processedPixel = rgbToYCBCR(r, g, b);
    if (filterName == "threshold") processedPixel = thresholdFilter(r, g, b);
    if (filterName == "blur") processedPixel = blur(img, x, y);

    /** extension */
    if (filterName == "edge") processedPixel = edgeDetectionFilter(img, x, y); // cartoon image

    /** pop art effect uses lerpFilter function */
    if (filterName == "popartRed")
      processedPixel = lerpFilter(
        color(0, 0, 255),
        color(255, 0, 0),
        brightness
      );
    if (filterName == "popartGreen")
      processedPixel = lerpFilter(
        color(0, 255, 0),
        color(0, 0, 255),
        brightness
      );
    if (filterName == "popartBlue")
      processedPixel = lerpFilter(
        color(0, 255, 255),
        color(255, 0, 0),
        brightness
      );

    return processedPixel; // return the pixel array with the altered r,g,b values
  };

  /** convolution function */
  this.convolution = function (x, y, matrix, matrixSize, img) {
    let totalRed = 0.0;
    let totalGreen = 0.0;
    let totalBlue = 0.0;
    let offset = floor(matrixSize / 2);

    // convolution matrix loop
    for (let i = 0; i < matrixSize; i++) {
      for (let j = 0; j < matrixSize; j++) {
        // Get pixel loc within convolution matrix
        let xloc = x + i - offset;
        let yloc = y + j - offset;
        let index = (xloc + img.width * yloc) * 4;
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
  };
}
