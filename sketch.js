// https://kylemcdonald.github.io/cv-examples/
// based on https://github.com/mtschirs/js-objectdetect

// PLEASE NOTE: Due to compatibility issues with the face detection library
// this example uses an older version of the P5js library

var imgWidth = 160,
    imgHeight = 120;

var webcam_stream; 
var img;
var greyscaleImg;
var redImg;
var greenImg;
var blueImg;

var segmentationSlider 
var segmentationVal

var detector;
var classifier = objectdetect.frontalface;

var faces;
var imageLoaded = false;

////////////////////////////////////////////////////////////////
function preload(){

}
////////////////////////////////////////////////////////////////
function setup() {
    createCanvas(imgWidth * 3, imgHeight * 5);
    pixelDensity(1); // makes sure it renders correctly on different screens
    webcam_stream = createCapture(VIDEO);
    webcam_stream.hide();
    webcam_stream.size(imgWidth, imgHeight);

    segmentationSlider = createSlider(0, 255, 100);
    segmentationSlider.position(50, imgHeight * 5 + 20)

    

}
///////////////////////////////////////////////////////////////
function draw() {

    background(0);
    // var sumX = 0, sumY = 0, avgX = 0, avgY = 0;
    segmentationVal = segmentationSlider.value()

    if(imageLoaded)
    {
        greyscaleImg = createImage(imgWidth,imgHeight);
        greyscaleImg = greyscaleFilter(img);

        redImg = createImage(imgWidth, imgHeight);
        redImg = channels(img, "red");

        greenImg = createImage(imgWidth, imgHeight);
        greenImg = channels(img, "green");
        blueImg = createImage(imgWidth, imgHeight);
        blueImg = channels(img, "blue");



        image(img, 0, 0);
        image(greyscaleImg, imgWidth, 0);
        image(redImg, 0, imgHeight);
        image(greenImg, imgWidth, imgHeight);
        image(blueImg, imgWidth * 2, imgHeight);

        
        // image(greenImg, imgWidth, imgHeight);
        // image(blueImg, imgWidth * 2, imgHeight);


        // //////////////////
        // var sumX=0, sumY=0, avgX=0, avgY = 0;
        // var matchCount=0;

        // var redTarget = 0;
        // var greenTarget = 0;
        // var blueTarget = 255;
    
        // for (var x = 0; x < img.width; x += 1) {
        //     for (var y = 0; y < img.height; y += 1) {
        //         var index = (x + (y * img.width)) * 4;
        //         var redSource = img.pixels[index + 0];
        //         var greenSource = img.pixels[index + 1];
        //         var blueSource = img.pixels[index + 2];
    
        //         // compare x,y,z with x,y,z in a 3d space
        //         var d = dist(redSource, greenSource, blueSource, redTarget, greenTarget, blueTarget);
    
        //         // if close enough
        //         if (d < segmentationVal) {
        //             sumX += x;
        //             sumY += y;
        //             matchCount++;
    
        //             // if (debug){ // shows matches in fuchsia
        //               redImg.pixels[index + 0] = 255;
        //               redImg.pixels[index + 1] = 255;
        //               redImg.pixels[index + 2] = 255;
        //             // }
        //         }
        //     }
        // }
    
        // if (matchCount>0){
        //     avgX = sumX / matchCount;
        //     avgY = sumY / matchCount;
        // }


        // redImg.updatePixels();
        // image(redImg, 0, imgHeight);
    
        // fill(255);
        // strokeWeight(4);
        // stroke(255,0,0);
        // ellipse(avgX, avgY, 16, 16);
        // strokeWeight(1);
        // noFill();
        // stroke(255);
        // text(threshold, 160, 35);
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

function channels(img, channel){
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

            switch(channel){
                case("red"):
                    redTarget = 255;
                    break;
                case("green"): 
                    greenTarget = 255;
                    break;    
                case("blue"):
                    blueTarget = 255;
                    break;
            }

            var d = dist(r,g,b,redTarget,greenTarget,blueTarget)
            if(d < 200)
            {
                imgOut.pixels[index + 0] = r;
                imgOut.pixels[index + 1] = g;
                imgOut.pixels[index + 2] = b;
            }
            else{
                var grey = (r + g + b) / 3 * 0.2; // make it dark so the difference in colour is more obvious
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