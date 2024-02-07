// https://kylemcdonald.github.io/cv-examples/
// based on https://github.com/mtschirs/js-objectdetect

/* --------------------------------------------------------------------------
COMMENTARY
Some of the code used are taken from Week 14 - 19 of Coursera videos.
New code will be indicated with appropriate comments.
-------------------------------------------------------------------------- */

let imgWidth = 160, imgHeight = 120;
let filter; // filter object to apply filters
let webcamStream; 
let img;

var greyscaleImg,redSegmentImg,greenSegmentImg,blueSegmentImg,hsvImg,ycbcrImg,hsvSegmentedImg,ycbcrSegmentedImg;
let images = [greyscaleImg,redSegmentImg,greenSegmentImg,blueSegmentImg,hsvImg,ycbcrImg,hsvSegmentedImg,ycbcrSegmentedImg];

let segmentationRSlider, segmentationGSlider, segmentationBSlider, pixelSlider; 
var segmentationRVal, segmentationGVal, segmentationBVal, selectFilterVal, pixelSize

let faceapi;
let detections = []; // populate with pictures later

let imageLoaded = false;
let faceX, faceY, faceWidth, faceHeight; // store the coordinates of the detected face
var faceFilterMode = 0;

// new
let pictures = []

////////////////////////////////////////////////////////////////
function preload(){
}
////////////////////////////////////////////////////////////////
function setup() {
    const canvas = createCanvas(imgWidth * 3, imgHeight * 6);
    pixelDensity(1); // makes sure it renders correctly on different screens

    // new code
    canvas.parent("canvas");
    filter = new Filter();
    for(var i = 0; i < 5; i++){
        for(var j = 0; j < 3; j++){
            pictures.push(new Picture(imgWidth, imgHeight, j * imgWidth, i * imgHeight));
        }
    }
    
    webcamStream = createCapture(VIDEO); // capture the video from webcam
    webcamStream.size(imgWidth, imgHeight);
    webcamStream.hide();

    segmentationRSlider = createSlider(0, 255, 190);
    segmentationGSlider = createSlider(0, 255, 220);
    segmentationBSlider = createSlider(0, 255, 220);
    pixelSlider = createSlider(2, 10, 5);

    segmentationRSlider.parent("redslider");
    segmentationGSlider.parent("greenslider");
    segmentationBSlider.parent("blueslider");
    pixelSlider.parent("pixelslider")

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
        detections = results;
}

///////////////////////////////////////////////////////////////
function draw() {
    background(0);
    // get the values of the sliders
    segmentationRVal = segmentationRSlider.value();
    segmentationGVal = segmentationGSlider.value();
    segmentationBVal = segmentationBSlider.value();
    pixelSize = pixelSlider.value();

    // create images and pass them through the filters
    if(imageLoaded)
    {
        for(let i = 0; i < pictures.length; i++){
            pictures[i].show();
        }
    }
}

function keyPressed()
{
    if(keyCode == 83) // 's' is pressed
    {
        img = createImage(imgWidth, imgHeight); 
        console.log("s is pressed")
        img = webcamStream.get();
        imageLoaded = true;
        const faceOptions = {
            withLandMarks: true,
            withExpressions: true, 
            withDescriptor: false, 
            minConfidence: 0.5
        }
        faceapi = ml5.faceApi(webcamStream, faceOptions, faceLoaded);


        for(let i = 0; i < pictures.length; i++){
            pictures[i].loadPicture(img);
        }
       
        // pictures[1].img =  processPicture(img, filter.processPixel(img, 'greyscale'))
        pictures[1].img = filter.processImage(img, 'greyscale');
        pictures[3].img = filter.processImage(img, 'redChannel');
        pictures[4].img = filter.processImage(img, 'blueChannel');
        pictures[5].img = filter.processImage(img, 'greenChannel');
        pictures[6].img = filter.processImage(img, 'redChannelSegment');
        pictures[7].img = filter.processImage(img, 'blueChannelSegment');
        pictures[8].img = filter.processImage(img, 'greenChannelSegment');
        // pictures[2].img = filter.processImage(img, 'redChannel') 


        ///////////////// BACKUP /////////////////////////
        // pictures[2].img = greyscaleFilter(img)
        // pictures[3].img = channel(img, 'red')
        // pictures[4].img = channel(img, 'green')
        // pictures[5].img = channel(img, 'blue')
        // pictures[6].img = channelSegmentation(img, 'red')
        // pictures[7].img = channelSegmentation(img, 'green')
        // pictures[8].img = channelSegmentation(img, 'blue')
        // pictures[9].img = rgbToHSV(img)   
        // pictures[10].img = rgbToYCBCR(img)
        // pictures[11].img = thresholdFilter(rgbToHSV(img))
        // pictures[12].img = thresholdFilter(rgbToYCBCR(img))
        // pictures[14].img = greyscaleFilter(img)
    }

        if(detections.length > 0){
            for(var f = 0; f < detections.length; f++){
                let {_x,_y,_width,_height} = detections[0].alignedRect._box;
                pictures[13].img = detectFaceFilter(img, _x, _y, _width, _height); // pass the co-ordinates of the faces
            }
        }
    if(keyCode == 49) faceFilterMode = 1;
    if(keyCode == 50) faceFilterMode = 2;
    if(keyCode == 51) faceFilterMode = 3;
    if(keyCode == 52) faceFilterMode = 4;
}

