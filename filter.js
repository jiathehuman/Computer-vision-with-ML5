function Filter(){
    // var self = this; 
    this.filters = [];
    this.processImage = function(img, filterName){
        var imgOut = createImage(img.width, img.height);
        imgOut.loadPixels();
        img.loadPixels();
    
        for (let x = 0; x < imgOut.width; x++) {
            for (let y = 0; y < imgOut.height; y++) {
    
                var index = (x + y * imgOut.width) * 4;
    
                var r = img.pixels[index + 0];
                var g = img.pixels[index + 1];
                var b = img.pixels[index + 2];
    
                // var processedPixel = greyscaleFilter(r,g,b, filterName);

                var processedPixel = this.applyFilter(r,g,b,filterName)

                imgOut.pixels[index + 0] = processedPixel[0];
                imgOut.pixels[index + 1] = processedPixel[1];
                imgOut.pixels[index + 2] = processedPixel[2];
                imgOut.pixels[index + 3] = 255;

            }
        }
        imgOut.updatePixels(); 
        return imgOut;
    }

    this.applyFilter = function(r,g,b, filterName){
        // if(filterName == 'greyscale') return greyscaleFilter(r,g,b)
        var processedPixel
        if(filterName == 'greyscale') processedPixel = greyscaleFilter(r,g,b);
        if(filterName == 'redChannel') processedPixel = channel(r,g,b, 'red');
        if(filterName == 'blueChannel') processedPixel = channel(r,g,b, 'green');
        if(filterName == 'greenChannel') processedPixel = channel(r,g,b, 'blue');
        if(filterName == 'redChannelSegment') processedPixel = channelSegmentation(r,g,b, 'red');
        if(filterName == 'blueChannelSegment') processedPixel = channelSegmentation(r,g,b, 'green');
        if(filterName == 'greenChannelSegment') processedPixel = channelSegmentation(r,g,b, 'blue');
        if(filterName == 'hsvColour') processedPixel = rgbToHSV(r,g,b);
        if(filterName == 'ycbcrColour') processedPixel = rgbToYCBCR(r,g,b);
        if(filterName == 'threshold') processedPixel = thresholdFilter(r,g,b);

        return processedPixel;
    }

}