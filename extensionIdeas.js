// function popart(imgIn){
//     var imgOut = createImage(img.width, img.height);
//     imgOut = img.get();
//     imgOut.loadPixels();
//     imgIn.loadPixels();
//     for(let i = 0; i < imgIn.width; i += 10){
//         for(let j = 0; j < imgIn.height; j += 10){
//             let c1 = (255,0,0)
//             let c2 = (0,255,0)
//             let c = img.get(i,j)
//             let b = brightness(c)
//             let val = map(b, 0, 100, 0, 1)
//             let colour = lerpColor(c1,c2,val)
//             rect(0,0,10,10)
//         }
//     }
//     imgOut.updatePixels();
//     return imgOut;
// }


// RMB NOT TO DELETE BELOW, CAN USE FOR EXTENSION - convert back to rgb
            // convert back to rgb
            // var hex = hue / 60
            // var primaryColour = Math.floor(hex);
            // var secondaryColour = 1 - primaryColour;
 
            // var a = (1 - saturation) * value;
            // var b = (1-(saturation * secondaryColour)) * value;
            // var c = (1-(saturation * (1 - secondaryColour))) * value;

            // var convertedR, convertedG, convertedB

            // switch(primaryColour){
            //     case 0: 
            //         convertedR = value;
            //         convertedG = c;
            //         convertedB = a;
            //     case 1: 
            //         convertedR = b;
            //         convertedG = value;
            //         convertedB = a;
            //     case 2: 
            //         convertedR = a;
            //         convertedG = value;
            //         convertedB = c;
            //     case 3: 
            //         convertedR = a;
            //         convertedG = b;
            //         convertedB = value;
            //     case 4: 
            //         convertedR = c;
            //         convertedG = a;
            //         convertedB = value;
            //     case 5: 
            //         convertedR = value;
            //         convertedG = a;
            //         convertedB = b;
                
            // }

            // imgOut.pixels[index + 0] = convertedR * 255;
            // imgOut.pixels[index + 1] = convertedG * 255;
            // imgOut.pixels[index + 2] = convertedB * 255;
            // imgOut.pixels[index + 3] = 255;


            // imgOut.pixels[index + 3] = 100; 

            // imgOut.pixels[index + 0] = hue;
            // imgOut.pixels[index + 1] = saturation;
            // imgOut.pixels[index + 2] = value;
            // imgOut.pixels[index + 3] = hue;
            // console.log(convertedR, convertedG, convertedB)