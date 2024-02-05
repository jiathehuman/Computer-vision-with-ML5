// function detectFilter(img) {
//   img.loadPixels();
//   var imgOut = createImage(img.width, img.height);
//   imgOut.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
//   imgOut.loadPixels();

//   faces = detector.detect(imgOut.canvas);
//   for (var i = 0; i < faces.length; i++) {
//     var face = faces[i];
//     if (face[4] > 5) {
//       var firstX = int(face[0]);
//       var firstY = int(face[1]);
//       var fwidth = int(face[2]);
//       var fheight = int(face[3]);

//       fill(255);
//       // rect(face[0], face[1], face[2], face[3]);

//       // ellipse(face[0],20,20)
//       // ellipse(face[1],20,20)

//       for(var y = firstY; y < (firstY + fheight); y++)
//       {
//         for(var x = firstX; x < (firstX + fwidth); x++)
//         {
//           var index = (x + y * imgOut.width) * 4;
//           ellipse(face[0],20,20)
//           ellipse(face[1],20,20)
//         }
//       }
//       // ellipse(face[2],20,20)
//       // ellipse(face[3],20,20)

//       // for (var y = startY; y < startY + fheight; y++) { 
//       //   for (var x = startX; x < startX + fwidth; x++) {
//       //     var pixelIndex = (imgOut.width * y + x) * 4;

//       //     // white box over face
//       //     // imgOut.pixels[pixelIndex + 0] = 255;
//       //     // imgOut.pixels[pixelIndex + 1] = 255;
//       //     // imgOut.pixels[pixelIndex + 2] = 0; 
//       //     // imgOut.pixels[pixelIndex + 3] = 255;

//       //     imgOut.pixels[pixelIndex + 0] = img.pixels[pixelIndex + 0];
//       //     imgOut.pixels[pixelIndex + 1] = img.pixels[pixelIndex + 1];
//       //     imgOut.pixels[pixelIndex + 2] = img.pixels[pixelIndex + 2];       
//       //     imgOut.pixels[pixelIndex + 3] = img.pixels[pixelIndex + 3];
//       //   }
//       //   // console.log("this");
//       // }
//     }
//   }

//   imgOut.updatePixels();
//   return imgOut;
// }

function detectFaceFilter(img,faceX, faceY, faceWidth, faceHeight){
    // console.log("this is called")
    var imgOut = createImage(img.width, img.height);
    imgOut.loadPixels();
    img.loadPixels();

    // console.log(faceX, faceY, faceWidth, faceHeight)

    var startX = int(faceX);
    var startY = int(faceY)
    var fwidth = int(faceWidth);
    var fheight = int(faceHeight);

    console.log(startX, startY, fwidth, fheight);


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
                if(selectFilterVal == "greyscale"){
                    imgOut.pixels[index+0]= imgOut.pixels[index+1] = imgOut.pixels[index+2] = grey * 0.8; // making it slightly darker

                }
                else if(selectFilterVal == "blur"){
                    imgOut.pixels[index+0]= imgOut.pixels[index+1] = imgOut.pixels[index+2] = 255; // making it slightly darker
   
                }
                else if(selectFilterVal == "color converted"){
                    imgOut.pixels[index+0]= imgOut.pixels[index+1] = imgOut.pixels[index+2] = 105; // making it slightly darker

                }
                else if(selectFilterVal == "pixelate"){
                    imgOut.pixels[index+0]= imgOut.pixels[index+1] = imgOut.pixels[index+2] = 0; // making it slightly darker

                }
            }

        }
    }
    imgOut.updatePixels();
    return imgOut;
}

