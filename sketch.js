// https://kylemcdonald.github.io/cv-examples/
// based on https://github.com/mtschirs/js-objectdetect

// PLEASE NOTE: Due to compatibility issues with the face detection library
// this example uses an older version of the P5js library


// Commentary:
/* ////////////////////////////////////////////////////////////////
COMMENTARY
//////////////////////////////////////////////////////////////////
Segmentation for the red channel is a lot more accurate that green and red.
*/

var imgWidth = 160,
    imgHeight = 120;

var webcam_stream; 
var img;
var greyscaleImg;
var redSegmentImg;
var greenSegmentImg;
var blueSegmentImg;
var hsvImg;
var ycbcrImg;

var hsvSegmentedImg;
var ycbcrSegmentedImg;

var segmentationRSlider, segmentationGSlider, segmentationBSlider; 
var segmentationRVal, segmentationGVal, segmentationBVal;

var detector;
var classifier = objectdetect.frontalface;

var faces;
var imageLoaded = false;
var testImg;

////////////////////////////////////////////////////////////////
function preload(){
    img = loadImage("assets/face2.jpg");
}
////////////////////////////////////////////////////////////////
function setup() {
    const canvas = createCanvas(imgWidth * 3, imgHeight * 5);
    pixelDensity(1);
    canvas.parent("canvas");
    pixelDensity(1); // makes sure it renders correctly on different screens

    var scaleFactor = 1
    var classifier = objectdetect.frontalface;
    detector = new objectdetect.detector(width, height, scaleFactor, classifier);

    webcam_stream = createCapture(VIDEO);
    webcam_stream.hide();
    webcam_stream.size(imgWidth, imgHeight);

    segmentationRSlider = createSlider(0, 255, 100);

    segmentationGSlider = createSlider(0, 255, 100);

    segmentationBSlider = createSlider(0, 255, 100);

    segmentationRSlider.parent("redslider");
    segmentationGSlider.parent("greenslider");
    segmentationBSlider.parent("blueslider");

}
///////////////////////////////////////////////////////////////
function draw() {

    background(0);
    // var sumX = 0, sumY = 0, avgX = 0, avgY = 0;
    segmentationRVal = segmentationRSlider.value()
    segmentationGVal = segmentationGSlider.value()
    segmentationBVal = segmentationBSlider.value()



    if(imageLoaded)
    {
        greyscaleImg = createImage(imgWidth,imgHeight);
        greyscaleImg = greyscaleFilter(img);

        redImg = createImage(imgWidth, imgHeight);
        greenImg = createImage(imgWidth, imgHeight);
        blueImg = createImage(imgWidth, imgHeight);

        redImg = channel(img, "red");
        greenImg = channel(img, "green");
        blueImg = channel(img, "blue");


        redSegmentImg = createImage(imgWidth, imgHeight);
        redSegmentImg = channelSegmentation(img, "red");

        greenSegmentImg = createImage(imgWidth, imgHeight);
        greenSegmentImg = channelSegmentation(img, "green");

        blueSegmentImg = createImage(imgWidth, imgHeight); 
        blueSegmentImg = channelSegmentation(img, "blue");

        // colorMode(HSB,255);
        hsvImg = createImage(imgWidth, imgHeight);
        hsvImg = rgbToHSV(img);

        ycbcrImg = createImage(imgWidth, imgHeight);
        ycbcrImg = rgbToYCBCR(img);

        hsvSegmentedImg = createImage(imgWidth, imgHeight);
        hsvSegmentedImg = thresholdFilter(hsvImg);
        ycbcrSegmentedImg = createImage(imgWidth, imgHeight);
        ycbcrSegmentedImg = thresholdFilter(ycbcrImg);

        faceImg = createImage(imgWidth, imgHeight);
        faceImg = detectFilter(img);

        colorMode(RGB)
        image(img, 0, 0);
        image(greyscaleImg, imgWidth, 0);
        // image(redImg, 0, imgHeight);
        // image(greenImg, imgWidth, imgHeight);
        // image(blueImg, imgWidth * 2, imgHeight);
        // image(redSegmentImg, 0, imgHeight * 2);
        // image(greenSegmentImg, imgWidth, imgHeight * 2);
        // image(blueSegmentImg, imgWidth * 2, imgHeight * 2);

        // image(img, 0, imgHeight * 3);
        // image(hsvImg, imgWidth, imgHeight * 3);
        // image(ycbcrImg, imgWidth * 2, imgHeight * 3);

        // image(hsvSegmentedImg, imgWidth, imgHeight * 4);
        // image(ycbcrSegmentedImg, imgWidth * 2, imgHeight * 4);

        // image(hsvImg, imgWidth, imgHeight * 3);
        image(faceImg, 0, imgHeight * 4);

        noLoop();
    }

    // noLoop();
   
}

function keyPressed()
{
    if(key == " ")
    {
        img = createImage(imgWidth, imgHeight); 
        img = webcam_stream.get();
        imageLoaded = true;
    }
}


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

function channel(img, channel)
{
        var imgOut = createImage(img.width, img.height);
        imgOut.loadPixels();
        img.loadPixels();
    
        for (x = 0; x < imgOut.width; x++) {
            for (y = 0; y < imgOut.height; y++) {
    
                var index = (x + y * imgOut.width) * 4;
    
                var r = img.pixels[index + 0];
                var g = img.pixels[index + 1];
                var b = img.pixels[index + 2];

                var altR, altG, altB

                switch(channel){
                    case("red"):
                        altR = r;
                        altG = 0;
                        altB = 0;
                        break;
                    case("green"): 
                        altR = 0;
                        altG = g;
                        altB = 0;
                        break;    
                    case("blue"):
                        altR = 0;
                        altG = 0;
                        altB = b;
                        break;
                }
    
                imgOut.pixels[index + 0] = altR;
                imgOut.pixels[index + 1] = altG;
                imgOut.pixels[index + 2] = altB;
                imgOut.pixels[index+3]= 255; 
            }
        }
        imgOut.updatePixels();
        return imgOut;
}

function channelSegmentation(img, channel){
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

            var redTarget = blueTarget = greenTarget = 0
            var threshold = 0;

            switch(channel){
                case("red"):
                    threshold = segmentationRVal;
                    redTarget = 255;
                    break;
                case("green"): 
                    threshold = segmentationGVal;
                    greenTarget = 255;
                    break;    
                case("blue"):
                    threshold = segmentationBVal;
                    blueTarget = 255;
                    break;
            }

            var d = dist(r,g,b,redTarget,greenTarget,blueTarget)
            if(d < threshold)
            {
                imgOut.pixels[index + 0] = r;
                imgOut.pixels[index + 1] = g;
                imgOut.pixels[index + 2] = b;
            }
            else{
                var grey = (r + g + b) / 3 * 0.1; // make it dark so the difference in colour is more obvious
                imgOut.pixels[index+0]= imgOut.pixels[index+1] = imgOut.pixels[index+2] = grey;
            }

            imgOut.pixels[index+3]= 255;
        }
    }
    imgOut.updatePixels();
    return imgOut;
}

// // reference: https://gist.github.com/avisek/eadfbe7a7a169b1001a2d3affc21052e
// function rgbToHSV(img)
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

//             r /= 255, g/=255, b/=255; // divide all by 255 to normalise
//             var rPrime, gPrime, bPrime, hue;

//             var max = Math.max(r,g,b);
//             var min = Math.min(r,g,b);
//             const diff = max - min;

//             var saturation = diff / max;
//             var value = max;

//             rPrime = (max - r)/ diff;
//             gPrime = (max - g)/ diff;
//             bPrime = (max - b)/ diff;

//             if(saturation == 0) hue = 0;
//             else if(r == max && g == min) hue = 5 + bPrime;
//             else if(r==max && g!= min) hue = 1 - gPrime;
//             else if(g==max && b == min) hue = rPrime + 1;
//             else if(g==max && b != min) hue = 3 - bPrime;
//             else if(r == max) hue = 3 + gPrime;
//             else hue = 5 - rPrime;

//             hue = hue * 60;

//             // convert back to rgb
//             var hex = hue / 60
//             var primaryColour = Math.floor(hex);
//             var secondaryColour = 1 - primaryColour;

//             var a = (1 - saturation) * value;
//             var b = (1-(saturation * secondaryColour)) * value;
//             var c = (1-(saturation * (1 - secondaryColour))) * value;

//             var convertedR, convertedG, convertedB

//             switch(primaryColour){
//                 case 0: 
//                     convertedR = value;
//                     convertedG = c;
//                     convertedB = a;
//                 case 1: 
//                     convertedR = b;
//                     convertedG = value;
//                     convertedB = a;
//                 case 2: 
//                     convertedR = a;
//                     convertedG = value;
//                     convertedB = c;
//                 case 3: 
//                     convertedR = a;
//                     convertedG = b;
//                     convertedB = value;
//                 case 4: 
//                     convertedR = c;
//                     convertedG = a;
//                     convertedB = value;
//                 case 5: 
//                     convertedR = value;
//                     convertedG = a;
//                     convertedB = b;
                
//             }

//             imgOut.pixels[index + 0] = convertedR * 255;
//             imgOut.pixels[index + 1] = convertedG * 255;
//             imgOut.pixels[index + 2] = convertedB * 255;
//             imgOut.pixels[index + 3] = 255;

//             // imgOut.pixels[index + 0] = hue;
//             // imgOut.pixels[index + 1] = saturation;
//             // imgOut.pixels[index + 2] = value;
//             // imgOut.pixels[index + 3] = 200;
//             console.log(convertedR, convertedG, convertedB)
//             }
//         }
//     imgOut.updatePixels();
//     return imgOut;
// }


// Coursera
// faster method for calculating color similarity which does not calculate root.
// Only needed if dist() runs slow
function distSquared(x1, y1, z1, x2, y2, z2){
    var d = (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) + (z2-z1)*(z2-z1);
    return d;
  }