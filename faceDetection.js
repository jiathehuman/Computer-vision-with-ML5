function detectFaceFilter(img,faceX, faceY, faceWidth, faceHeight){
    var inBox = false;
    // console.log("this is called")
    var imgOut = createImage(img.width, img.height);
    var index = (x + y * imgOut.width) * 4;
    imgOut.loadPixels();
    img.loadPixels();

    // console.log(faceX, faceY, faceWidth, faceHeight)

    var startX = int(faceX);
    var startY = int(faceY)
    var fwidth = int(faceWidth);
    var fheight = int(faceHeight);


    for (x = 0; x < imgOut.width; x++) {

        for (y = 0; y < imgOut.height; y++) {
            var index = (x + y * imgOut.width) * 4;
            var r = img.pixels[index + 0];
            var g = img.pixels[index + 1];
            var b = img.pixels[index + 2];

            // push()
            // translate(0,imgHeight*4)
            var grey = r * 0.299 + g * 0.587 + b * 0.114; // LUMA ratios 

            imgOut.pixels[index + 0] = r;
            imgOut.pixels[index + 1] = g;
            imgOut.pixels[index + 2] = b;
            imgOut.pixels[index + 3] = 255;

            if((x > startX) && (x < startX + fwidth) && (y > startY) && (y < startY + fheight))
            {
                inBox = true;
                if(faceFilterMode == 1){
                    imgOut.pixels[index+0]= imgOut.pixels[index+1] = imgOut.pixels[index+2] = grey * 0.8; // making it slightly darker

                }
                if(faceFilterMode == 2){

                    var matrix = [
                        [1/9, 1/9, 1/9],
                        [1/9, 1/9, 1/9],
                        [1/9, 1/9, 1/9]
                    ];
                    var c = convolution(x,y,matrix, matrix.length, img);
                    imgOut.pixels[index + 0] = c[0];
                    imgOut.pixels[index + 1] = c[1];
                    imgOut.pixels[index + 2] = c[2];
                    imgOut.pixels[index + 3] = 255;

   
                }
                else if(faceFilterMode == 3){
                    var yPrime, Cb, Cr;

                    yPrime = 0.299 * r + 0.587 * g + 0.114 * b;
                    Cb = 128 -0.169 * r - 0.331 * g + 0.5 * b;
                    Cr = 128 + 0.500 * r - 0.419 * g - 0.081 * b;
        
                    // 10.5 ITU.BT-709 HDTV studio production in Y'CbCr
                    imgOut.pixels[index + 0] = yPrime;
                    imgOut.pixels[index + 1] = Cb;
                    imgOut.pixels[index + 2] = Cr;
                    imgOut.pixels[index + 3] = 255;

                }
            }
            else{
                inBox = false;
            }
            // if(selectFilterVal == "pixelate" && inBox == true) y += 5;
        }
        // if(selectFilterVal == "pixelate"&& inBox == true) x += 5;
    }

    if(faceFilterMode == 4){
        let pixelatedSize = pixelSize;
        for(var y = startY; y < startY + fheight ;y += pixelatedSize){
            for(var x=startX; x< startX + fwidth ;x += pixelatedSize){
    
                var sumRed = 0;
                var sumGreen = 0;
                var sumBlue = 0;
                
                //get the sum of RGB of that block
                for(var i=0;i<pixelatedSize;i++){
                    for(var j=0;j<pixelatedSize;j++){
                        var pixelColour = img.get((x+i),(y+j))
                        var r = pixelColour[0]
                        var g = pixelColour[1]
                        var b = pixelColour[2]
                        sumRed   += r;
                        sumGreen += g;
                        sumBlue  += b;
                    }
                }
                //calculate the ave of RGB of that block
                var aveRed = sumRed/(pixelatedSize*pixelatedSize);
                var aveGreen = sumGreen/(pixelatedSize*pixelatedSize);
                var aveBlue = sumBlue/(pixelatedSize*pixelatedSize);
                var avgColour = color(aveRed,aveGreen,aveBlue)
                //paint the block with the ave RGB value
                for(var i=0;i<pixelatedSize;i++){
                    for(var j=0;j<pixelatedSize;j++){
                        var pixelIndex = ((img.width * (y+j)) + (x+i)) *4;
                        imgOut.set((x+i),(y+j),avgColour)
                    }
                }
            }
        }
    }

    imgOut.updatePixels();
    return imgOut;
}

function convolution(x, y, matrix, matrixSize, img) {
    var totalRed = 0.0;
    var totalGreen = 0.0;
    var totalBlue = 0.0;
    var offset = floor(matrixSize / 2);

    // convolution matrix loop
    for (var i = 0; i < matrixSize; i++) {
        for (var j = 0; j < matrixSize; j++) {
            // Get pixel loc within convolution matrix
            var xloc = x + i - offset;
            var yloc = y + j - offset;
            var index = (xloc + img.width * yloc) * 4;
            // ensure we don't address a pixel that doesn't exist
            index = constrain(index, 0, img.pixels.length - 1);

            // multiply all values with the mask and sum up
            totalRed += img.pixels[index + 0] * matrix[i][j];
            totalGreen += img.pixels[index + 1] * matrix[i][j];
            totalBlue += img.pixels[index + 2] * matrix[i][j];
        }
    }
    // return the new color
    return [totalRed, totalGreen, totalBlue];
}

function pixelate(faceX, faceY, faceWidth, faceHeight){
    var pixelatedSize = 5;
    for(var y = startY; y < startY + fheight ;y += pixelatedSize){
        for(var x=startX; x< startX + fwidth ;x += pixelatedSize){

            var sumRed = 0;
            var sumGreen = 0;
            var sumBlue = 0;
            
            //get the sum of RGB of that block
            for(var i=0;i<pixelatedSize;i++){
                for(var j=0;j<pixelatedSize;j++){
                    var pixelIndex = ((img.width * (y+j)) + (x+i))*4;
                    var pixelRed = img.pixels[pixelIndex + 0];
                    var pixelGreen = img.pixels[pixelIndex + 1];
                    var pixelBlue = img.pixels[pixelIndex + 2];
                    sumRed+=pixelRed;
                    sumGreen+=pixelGreen;
                    sumBlue+=pixelBlue;
                }
            }
            //calcualte the ave of RGB of that block
            var aveRed = sumRed/(pixelatedSize*pixelatedSize);
            var aveGreen = sumGreen/(pixelatedSize*pixelatedSize);
            var aveBlue = sumBlue/(pixelatedSize*pixelatedSize);
            
            //paint the block with the ave RGB value
            for(var i=0;i<pixelatedSize;i++){
                for(var j=0;j<pixelatedSize;j++){
                    var pixelIndex = ((img.width * (y+j)) + (x+i)) *4;
                    imgOut.pixels[pixelIndex + 0] = aveRed;
                    imgOut.pixels[pixelIndex + 1] = aveGreen;
                    imgOut.pixels[pixelIndex + 2] = aveBlue;
                }
            }
        }
    }
}