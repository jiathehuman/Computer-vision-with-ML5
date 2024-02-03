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

var segmentationRSlider, segmentationGSlider, segmentationBSlider 

var segmentationRVal, segmentationGVal, segmentationBVal

var detector;
var classifier = objectdetect.frontalface;

var faces;
var imageLoaded = false;

////////////////////////////////////////////////////////////////
function preload(){

}
////////////////////////////////////////////////////////////////
function setup() {
    const canvas = createCanvas(imgWidth * 3, imgHeight * 5);
    canvas.parent("canvas");
    pixelDensity(1); // makes sure it renders correctly on different screens
    webcam_stream = createCapture(VIDEO);
    webcam_stream.hide();
    webcam_stream.size(imgWidth, imgHeight);

    segmentationRSlider = createSlider(0, 255, 100);
    // segmentationRSlider.position(50, imgHeight * 5 + 20)

    segmentationGSlider = createSlider(0, 255, 100);
    // segmentationGSlider.position(50, imgHeight * 5 + 40)

    segmentationBSlider = createSlider(0, 255, 100);
    // segmentationBSlider.position(50, imgHeight * 5 + 60)

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



        image(img, 0, 0);
        image(greyscaleImg, imgWidth, 0);
        image(redImg, 0, imgHeight);
        image(greenImg, imgWidth, imgHeight);
        image(blueImg, imgWidth * 2, imgHeight);


        image(redSegmentImg, 0, imgHeight * 2);
        image(greenSegmentImg, imgWidth, imgHeight * 2);
        image(blueSegmentImg, imgWidth * 2, imgHeight * 2);

    }

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


// Coursera
// faster method for calculating color similarity which does not calculate root.
// Only needed if dist() runs slow
function distSquared(x1, y1, z1, x2, y2, z2){
    var d = (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) + (z2-z1)*(z2-z1);
    return d;
  }