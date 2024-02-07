function rgbToYCBCR(r,g,b)
{
        var yPrime, Cb, Cr;

        yPrime = 0.299 * r + 0.587 * g + 0.114 * b;
        Cb = 128 -0.169 * r - 0.331 * g + 0.5 * b;
        Cr = 128 + 0.500 * r - 0.419 * g - 0.081 * b;

        // 16 to 235 for y', 16 ro 240 doe Cb and Cr

        return [yPrime, Cb, Cr]
        // imgOut.pixels[index + 0] = yPrime;
        // imgOut.pixels[index + 1] = Cb;
        // imgOut.pixels[index + 2] = Cr;
        // imgOut.pixels[index + 3] = 255;

}

// function rgbToYCBCR(img)
// {
//     var imgOut = createImage(img.width, img.height);
//     imgOut.loadPixels();
//     img.loadPixels();

//     for (x = 0; x < imgOut.width; x++) {
//         for (y = 0; y < imgOut.height; y++) {

//             var index = (x + y * imgOut.width) * 4;

//             var r = img.pixels[index + 0];
//             var g = img.pixels[index + 1];
//             var b = img.pixels[index + 2]; 

//             // r /= 255, g /=255, b /=255; // divide all by 255 to normalise

//             var yPrime, Cb, Cr;

//             yPrime = 0.299 * r + 0.587 * g + 0.114 * b;
//             Cb = 128 -0.169 * r - 0.331 * g + 0.5 * b;
//             Cr = 128 + 0.500 * r - 0.419 * g - 0.081 * b;

//             // 10.5 ITU.BT-709 HDTV studio production in Y'CbCr

            

//             // 16 to 235 for y', 16 ro 240 doe Cb and Cr
//             imgOut.pixels[index + 0] = yPrime;
//             imgOut.pixels[index + 1] = Cb;
//             imgOut.pixels[index + 2] = Cr;
//             imgOut.pixels[index + 3] = 255;
//             }
//         }
//     imgOut.updatePixels();
//     return imgOut;
// }