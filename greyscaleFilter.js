// code provided by Coursera Week 15
function greyscaleFilter(img){
    // console.log("this is called")
    var imgOut = createImage(img.width, img.height);
    imgOut.loadPixels();
    img.loadPixels();

    for (x = 0; x < imgOut.width; x++) {
        for (y = 0; y < imgOut.height; y++) {

            var index = (x + y * imgOut.width) * 4;

            var r = img.pixels[index + 0];
            var g = img.pixels[index + 1];
            var b = img.pixels[index + 2];

            var grey = (r + g + b) / 3; 
            var grey = r * 0.299 + g * 0.587 + b * 0.114; // LUMA ratios 

            // new code
            var alt_grey = min(grey * 1.2, 255);

            imgOut.pixels[index+0]= imgOut.pixels[index+1] = imgOut.pixels[index+2] = alt_grey;
            imgOut.pixels[index+3]= 255;
        }
    }
    imgOut.updatePixels();
    return imgOut;
}
