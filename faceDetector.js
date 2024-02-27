/** ----------------------------------------------------------------------------------------
 * FACE FILTER CLASS
 * processImage() takes in: 
 *    1. an image 
 *    2. the top left coordinates of the detected face (startX and startY)
 *    3. the width and height of detected face
 *     and outputs an image with a face filter over the face
 * 
 * applyFilter() applies greyscale, blur and ycbcr filter on face.
 * pixelFilter() applies a pixelFilter on imgOut
 ------------------------------------------------------------------------------------------ */

class FaceFilter {
  constructor() {}

  processImage = function (img, startX, startY, fwidth, fheight) {
    var imgOut = createImage(img.width, img.height); // creates returned image
    imgOut = img.get(); // imgOut is a replica of image
    imgOut.loadPixels();
    img.loadPixels();

    /** process the pixels that are within the detected face rectangle */
    if (faceFilterMode == 4) {
      this.pixelFilter(startX, startY, fwidth, fheight, imgOut); // pixelated filter increments x and y loop by pixelSize
    } 
    // other filters increments x and y loops by 1, processing one pixel at a time
    else {
      for (let x = 0; x < imgOut.width; x++) {
        for (let y = 0; y < imgOut.height; y++) {

          var index = (x + y * imgOut.width) * 4; // index of that particular pixel

          /** get original pixels */
          var r = img.pixels[index + 0];
          var g = img.pixels[index + 1];
          var b = img.pixels[index + 2];

          // if the pixel in current loop is within the detected face's rectangle, process the pixel
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

            // the new pixel has the filter applied
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

  /** apply the filter on a single pixel */
  applyFilter = function (r, g, b, img, x, y) {
    var processedPixel;
    if (faceFilterMode == 0 || faceFilterMode == 1)
      processedPixel = greyscaleFilter(r, g, b); // if user clicks 0 or 1, greyscale filter is applied
    else if (faceFilterMode == 2) processedPixel = blur(img, x, y); // if user clicks 2, blur filer is applied
    else if (faceFilterMode == 3) processedPixel = rgbToYCBCR(r, g, b); // if user clicks 3, ycbcr filter is applied
    return processedPixel;
  };

  /** apply the pixelated filter and return the altered image */
  pixelFilter = function (startX, startY, fwidth, fheight, imgOut) {
    let pixelatedSize = pixelSize; // pixelSize given by user through slider

    /** if user selects "pixelated filter", the x and y are incremented by the pixelatedSize */
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
        var avgColour = color(aveRed, aveGreen, aveBlue); // the average colour of that block
        //paint the block with the ave RGB value
        for (var i = 0; i < pixelatedSize; i++) {
          for (var j = 0; j < pixelatedSize; j++) {
            // var pixelIndex = (img.width * (y + j) + (x + i)) * 4;
            imgOut.set(x + i, y + j, avgColour);
          }
        }
      }
    }
  };
}
