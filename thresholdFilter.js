function thresholdFilter(img){
    var imgOut = createImage(img.width, img.height);
    imgOut.loadPixels();
    img.loadPixels();

    for (x = 0; x < imgOut.width; x++) {
        for (y = 0; y < imgOut.height; y++) {

            var index = (x + y * imgOut.width) * 4;

            var r = img.pixels[index + 0];
            var g = img.pixels[index + 1];
            var b = img.pixels[index + 2];

            var bright = (r + g + b) / 3; // simple
            // var bright = 0.3 * r + 0.59 * g + 0.11 * b; // LUMA ratios

            var threshold = 120;
            if (bright > threshold) {
                imgOut.pixels[index + 0] = 255;
                imgOut.pixels[index + 1] = 255;
                imgOut.pixels[index + 2] = 255;
                imgOut.pixels[index + 3] = 255;
            } else {
                imgOut.pixels[index + 0] = 0;
                imgOut.pixels[index + 1] = 0;
                imgOut.pixels[index + 2] = 0;
                imgOut.pixels[index + 3] = 255;
            }
        }
    }
    imgOut.updatePixels();
    return imgOut;
}
