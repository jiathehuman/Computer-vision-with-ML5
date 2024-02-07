// function channel(img, channel)
// {
//         var imgOut = createImage(img.width, img.height);
//         imgOut.loadPixels();
//         img.loadPixels();
    
//         for (x = 0; x < imgOut.width; x++) {
//             for (y = 0; y < imgOut.height; y++) {
    
//                 var index = (x + y * imgOut.width) * 4;
    
//                 var r = img.pixels[index + 0];
//                 var g = img.pixels[index + 1];
//                 var b = img.pixels[index + 2];

//                 var altR = altG = altB = 0 

//                 switch(channel){
//                     case("red"):
//                         altR = r;
//                         break;
//                     case("green"): 
//                         altG = g;
//                         break;    
//                     case("blue"):
//                         altB = b;
//                         break;
//                 }
    
//                 imgOut.pixels[index + 0] = altR;
//                 imgOut.pixels[index + 1] = altG;
//                 imgOut.pixels[index + 2] = altB;
//                 imgOut.pixels[index+3]= 255; 
//             }
//         }
//         imgOut.updatePixels();
//         return imgOut;
// }

// function channelSegmentation(img, channel){
//     var imgOut = createImage(img.width, img.height);
//     imgOut.loadPixels();
//     img.loadPixels();

//     for (x = 0; x < imgOut.width; x++) {
//         for (y = 0; y < imgOut.height; y++) {

//             var index = (x + y * imgOut.width) * 4;

//             var r = img.pixels[index + 0];
//             var g = img.pixels[index + 1];
//             var b = img.pixels[index + 2];

//             var redTarget = blueTarget = greenTarget = 0
//             var threshold = 0;

//             switch(channel){
//                 case("red"):
//                     threshold = segmentationRVal;
//                     redTarget = 255;
//                     break;
//                 case("green"): 
//                     threshold = segmentationGVal;
//                     greenTarget = 255;
//                     break;    
//                 case("blue"):
//                     threshold = segmentationBVal;
//                     blueTarget = 255;
//                     break;
//             }

//             var d = dist(r,g,b,redTarget,greenTarget,blueTarget)
//             if(d < threshold)
//             {
//                 imgOut.pixels[index + 0] = r;
//                 imgOut.pixels[index + 1] = g;
//                 imgOut.pixels[index + 2] = b;
//             }
//             else{
//                 var grey = (r + g + b) / 3 * 0.1; // make it dark so the difference in colour is more obvious
//                 imgOut.pixels[index+0]= imgOut.pixels[index+1] = imgOut.pixels[index+2] = grey;
//             }

//             imgOut.pixels[index+3]= 255;
//         }
//     }
//     imgOut.updatePixels();
//     return imgOut;
// }

function channel(r,g,b, channel)
{
    var altR = altG = altB = 0 

    switch(channel){
        case('red'):
            altR = r;
            break;
        case('green'): 
            altG = g;
            break;    
        case('blue'):
            altB = b;
            break;
        
    }
    return [altR, altG, altB];
}

function channelSegmentation(r,g,b, channel){
    var redTarget = blueTarget = greenTarget = 0
    var altR = altG = altB = 0 
    var threshold = 0;

    switch(channel){
        case('red'):
            threshold = segmentationRVal;
            redTarget = 255;
            break;
        case('green'): 
            threshold = segmentationGVal;
            greenTarget = 255;
            break;    
        case('blue'):
            threshold = segmentationBVal;
            blueTarget = 255;
            break;
    }

    var d = dist(r,g,b,redTarget,greenTarget,blueTarget)
    if(d < threshold)
    {
        altR = r;
        altG = g;
        altB = b;
    }
    else{
        var grey = (r + g + b) / 3 * 0.1; // make it dark so the difference in colour is more obvious
        altR = altG = altB = grey;
    }

    return[altR, altG, altB]
}
