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

