function detectoFilter(img){
    img.loadPixels();
    var imgOut = createImage(img.width, img.height);
    // imgOut.loadPixels();
    imgOut.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);

    faces = detector.detect(imgOut.canvas);
    imgOut.loadPixels();

    // for (var i=0; i<faces.length; i++){
    //     var face=faces[i];
    //     if (face[4] > 4){
    //         var startX = int(face[0]);
    //         var startY = int(face[1]);
    //         var fwidth = int(face[2]);
    //         var fheight = int(face[3]);

    //         for(var y=startY;y<startY + fheight;y++){
    //             for(var x=startX;x<startX + fwidth;x++){
        
    //                 var pixelIndex = ((imgOut.width * y) + x) *4;
    //                 // var pixelRed = imgOut.pixels[pixelIndex + 0];
    //                 // var pixelGreen = imgOut.pixels[pixelIndex + 1];
    //                 // var pixelBlue = imgOut.pixels[pixelIndex + 2];
        
    //                 //red channel only
    //                 imgOut.pixels[pixelIndex+0] = 255;
    //                 imgOut.pixels[pixelIndex+1] = 255;
    //                 imgOut.pixels[pixelIndex+2] = 0;
    //                 imgOut.pixels[pixelIndex+3] = 255;

    //             }
    //         }
    //     }
    // }

    var index = ((imgOut.width * y) + x) *4;
    for (x = 0; x < imgOut.width; x++) {
        for (y = 0; y < imgOut.height; y++) {
            imgOut.pixels[index + 1] = 255;
            imgOut.pixels[index + 2] = 0;
            imgOut.pixels[index + 3] = 255;
            imgOut.pixels[index + 4] = 255;

        }
    }

    imgOut.updatePixels();
    return imgOut;
}

// function processPixels(startX,startY,dWidth,dHeight, imgOut){

//     // console.log("this is called")
//     for(var y=startY;y<startY+dHeight;y++){
//         for(var x=startX;x<startX+dWidth;x++){

//             var pixelIndex = ((imgOut.width * y) + x) *4;
//             var pixelRed = imgOut.pixels[pixelIndex + 0];
//             var pixelGreen = imgOut.pixels[pixelIndex + 1];
//             var pixelBlue = imgOut.pixels[pixelIndex + 2];

//             //red channel only
//             imgOut.pixels[pixelIndex+0] = pixelRed;
//             imgOut.pixels[pixelIndex+1] = 0;
//             imgOut.pixels[pixelIndex+2] = 0;
//             imgOut.pixels[pixelIndex+3] = 255;
//         }
//     }

//     return imgOut;
// }


function detectFilter(img)
{
    var imgOut = createImage(img.width, img.height);
    imgOut.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
    imgOut.loadPixels();
    img.loadPixels();

    faces = detector.detect(imgOut.canvas);

        for (var i=0; i<faces.length; i++){
        var face=faces[i];
        if (face[4] > 2){
            var startX = int(face[0]);
            var startY = int(face[1]);
            var fwidth = int(face[2]);
            var fheight = int(face[3]);

            fill(255);
            rect(face[0], face[1], face[2], face[3]);

            for(var y = startY; y < startY + fheight; y++){
                for(var x = startX; x <startX + fwidth; x++){
        
                    var pixelIndex = ((imgOut.width * y) + x) *4;
                    // var pixelRed = imgOut.pixels[pixelIndex + 0];
                    // var pixelGreen = imgOut.pixels[pixelIndex + 1];
                    // var pixelBlue = imgOut.pixels[pixelIndex + 2];
        
                    //red channel only
                    imgOut.pixels[pixelIndex+0] = 255;
                    imgOut.pixels[pixelIndex+1] = 255;
                    imgOut.pixels[pixelIndex+2] = 0;
                    imgOut.pixels[pixelIndex+3] = 255;

                }
                console.log("this")
            }


        }
    }

    // for (x = 0; x < imgOut.width; x++) {
    //     for (y = 0; y < imgOut.height; y++) {

    //         var index = (x + y * imgOut.width) * 4;

    //         var r = img.pixels[index + 0];
    //         var g = img.pixels[index + 1];
    //         // var b = img.pixels[index + 2]; 

            

    //         // 16 to 235 for y', 16 ro 240 doe Cb and Cr
    //         imgOut.pixels[index + 0] =r;
    //         imgOut.pixels[index + 1] = g;
    //         imgOut.pixels[index + 2] = 0;
    //         imgOut.pixels[index + 3] = 255;
    //         }
    //     }
    imgOut.updatePixels();
    return imgOut;
}