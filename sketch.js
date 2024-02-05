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
var segmentationRVal, segmentationGVal, segmentationBVal, selectFilterVal

var detector;
var classifier = objectdetect.frontalface;

var faceapi;
let detections = [];

var imageLoaded = false;
var testImg;

var faceX, faceY, faceWidth, faceHeight;

////////////////////////////////////////////////////////////////
function preload(){
    var scaleFactor = 1.2;
    var classifier = objectdetect.frontalface;
    detector = new objectdetect.detector(width, height, scaleFactor, classifier);
}
////////////////////////////////////////////////////////////////
function setup() {
    const canvas = createCanvas(imgWidth * 3, imgHeight * 5);
    pixelDensity(1);
    canvas.parent("canvas");
    pixelDensity(1); // makes sure it renders correctly on different screens


    webcam_stream = createCapture(VIDEO);
    webcam_stream.size(imgWidth, imgHeight);
    webcam_stream.hide();

    // img = createImage(imgWidth, imgHeight); 
    // img.copy(webcam_stream, 0, 0, img.width, img.height, 0, 0, img.width, img.height);


    segmentationRSlider = createSlider(0, 255, 100);
    segmentationGSlider = createSlider(0, 255, 100);
    segmentationBSlider = createSlider(0, 255, 100);

    segmentationRSlider.parent("redslider");
    segmentationGSlider.parent("greenslider");
    segmentationBSlider.parent("blueslider");

    faceFilterSel = createSelect();
    faceFilterSel.position(imgWidth * 3 + 20, imgHeight);
    faceFilterSel.option('greyscale');
    faceFilterSel.option('blur');
    faceFilterSel.option('color converted');
    faceFilterSel.option('pixelate');

    // const faceOptions = {
    //     withLandMarks: true,
    //     withExpressions: true, 
    //     withDescriptor: false, 
    //     minConfidence: 0.5
    // }

    // faceapi = ml5.faceApi(webcam_stream, faceOptions, faceLoaded);
}
///////////////////////////////////////////////////////////////
function faceLoaded(){
    faceapi.detect(gotFaces)
}

// error handling code
function gotFaces(error, results){
    if(error){
        console.log(error);
        return;
    }
    console.log("got faces is called");
        detections = results;
        // faceapi.detect(gotFaces); // continuously obtain RT data
}

///////////////////////////////////////////////////////////////
function draw() {

    var count;
    background(0);


    // get the values of the sliders
    segmentationRVal = segmentationRSlider.value();
    segmentationGVal = segmentationGSlider.value();
    segmentationBVal = segmentationBSlider.value();
    selectFilterVal = faceFilterSel.value();



    // create images and pass them through the filters
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
        // faceImg = detectFilter(img);

        colorMode(RGB)
        image(img, 0, 0);
        image(greyscaleImg, imgWidth, 0);

        // IMPT STUFF, ONLY COMMENTING OUT TO SPEED THINGS UP --------------------------------
        image(redImg, 0, imgHeight);
        image(greenImg, imgWidth, imgHeight);
        image(blueImg, imgWidth * 2, imgHeight);
        image(redSegmentImg, 0, imgHeight * 2);
        image(greenSegmentImg, imgWidth, imgHeight * 2);
        image(blueSegmentImg, imgWidth * 2, imgHeight * 2);

        image(img, 0, imgHeight * 3);
        image(hsvImg, imgWidth, imgHeight * 3);
        image(ycbcrImg, imgWidth * 2, imgHeight * 3);

        image(hsvSegmentedImg, imgWidth, imgHeight * 4);
        image(ycbcrSegmentedImg, imgWidth * 2, imgHeight * 4);

        image(hsvImg, imgWidth, imgHeight * 3);

        // RMB NOT TO DELETE ----------------------------------------------------------------

        // image(faceImg, 0, imgHeight * 4);

        // push()
        // translate(0,imgHeight*4)
        if(detections.length > 0){
            for(var f = 0; f < detections.length; f++){
                let x = detections[0].alignedRect._box._x;
                let y = detections[0].alignedRect._box._y;
                let rectWidth = detections[0].alignedRect._box.width;
                let rectHeight = detections[0].alignedRect._box.height;

                let {_x,_y,_width,_height} = detections[0].alignedRect._box;
    
                // stroke(255,0,0)
                // strokeWeight(2)
                // noFill()

                // faceimg = detectFaceFilter(img);
                
                // rect(_x,_y,_width,_height);
                faceX = detections[0].alignedRect._box._x;
                faceY = detections[0].alignedRect._box._y;
                faceWidth = detections[0].alignedRect._box.width;
                faceHeight = detections[0].alignedRect._box.height;
                faceImg = detectFaceFilter(img, faceX, faceY, faceWidth, faceHeight);
                image(faceImg, 0, imgHeight*4)
            }
        }
        // pop()

        // faceImg = detectFaceFilter(img, faceX, faceY, faceWidth, faceHeight);
        // image(faceImg, 0, imgHeight*3)

        // if(count > 2)
        // {
        //     noLoop(); // make sure it does not crash
        // }
    }
   
}

function keyPressed()
{
    if(key == " ")
    {
        img = createImage(imgWidth, imgHeight); 
        // img.copy(webcam_stream, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
        img = webcam_stream.get();
        imageLoaded = true;
        const faceOptions = {
            withLandMarks: true,
            withExpressions: true, 
            withDescriptor: false, 
            minConfidence: 0.5
        }
    
        faceapi = ml5.faceApi(webcam_stream, faceOptions, faceLoaded);
        // faceapi = ml5.faceApi(img, faceOptions, faceLoaded);
        // webcam_stream.remove();
    }
}

// Coursera
// faster method for calculating color similarity which does not calculate root.
// Only needed if dist() runs slow
function distSquared(x1, y1, z1, x2, y2, z2){
    var d = (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) + (z2-z1)*(z2-z1);
    return d;
  }