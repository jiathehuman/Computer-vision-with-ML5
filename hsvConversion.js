// reference: https://gist.github.com/avisek/eadfbe7a7a169b1001a2d3affc21052e
function rgbToHSV(r,g,b)
{
    // normR = r/255;
    // normG = g/255;
    // normB = b/255
    r /= 255, g/=255, b/=255; // divide all by 255 to normalise

    var rPrime, gPrime, bPrime, hue;

    var max = Math.max(r,g,b);
    var min = Math.min(r,g,b);

    const diff = max - min;

    var saturation = diff / max;
    var value = max;

    rPrime = (max - r)/ diff;
    gPrime = (max - g)/ diff;
    bPrime = (max - b)/ diff;

    // to calculate the hue
    if(saturation == 0) hue = 0;
    else if(r == max && g == min) hue = 5 + bPrime;
    else if(r==max && g!= min) hue = 1 - gPrime;
    else if(g==max && b == min) hue = rPrime + 1;
    else if(g==max && b != min) hue = 3 - bPrime;
    else if(r == max) hue = 3 + gPrime;
    else hue = 5 - rPrime;

    hue = ((hue * 60) / 360) * 255;
    saturation = (saturation * 100);
    value = (value * 100);

    // let mHue = map(hue, 0, 360, 0, 255);
    let mSaturation = map(saturation, 0, 100, 0, 255);
    let mValue = map(value,0,100,0,255);

    return[hue, mSaturation, mValue]
    // return[mHue, mSaturation, mValue];

}


// // reference: https://gist.github.com/avisek/eadfbe7a7a169b1001a2d3affc21052e
// function rgbToHSV(img)
// {
//     // colorMode(HSB);
//     var imgOut = createImage(img.width, img.height);
//     imgOut.loadPixels();
//     img.loadPixels();

//     for (x = 0; x < imgOut.width; x++) {
//         for (y = 0; y < imgOut.height; y++) {

//             var index = (x + y * imgOut.width) * 4;

//             var r = img.pixels[index + 0];
//             var g = img.pixels[index + 1];
//             var b = img.pixels[index + 2]; 

//             r /= 255, g/=255, b/=255; // divide all by 255 to normalise
//             var rPrime, gPrime, bPrime, hue;

//             var max = Math.max(r,g,b);
//             var min = Math.min(r,g,b);
//             const diff = max - min;

//             var saturation = diff / max;
//             var value = max;

//             rPrime = (max - r)/ diff;
//             gPrime = (max - g)/ diff;
//             bPrime = (max - b)/ diff;

//             // to calculate the hue
//             if(saturation == 0) hue = 0;
//             else if(r == max && g == min) hue = 5 + bPrime;
//             else if(r==max && g!= min) hue = 1 - gPrime;
//             else if(g==max && b == min) hue = rPrime + 1;
//             else if(g==max && b != min) hue = 3 - bPrime;
//             else if(r == max) hue = 3 + gPrime;
//             else hue = 5 - rPrime;

//             hue = hue * 60;
//             saturation = saturation * 100;
//             value = value * 100;

//             let mHue = map(hue, 0, 360, 0, 255);
//             let mSaturation = map(saturation, 0, 100, 0, 255);
//             let mValue = map(value,0,100,0,255);

//             // hue is 0 to 360, value and saturation are 0 to 100
//             imgOut.pixels[index + 1] = mHue;
//             imgOut.pixels[index + 2] = mSaturation;
//             imgOut.pixels[index + 3] = mValue;
//             imgOut.pixels[index + 4] = 255;


//             // RMB NOT TO DELETE BELOW, CAN USE FOR EXTENSION - convert back to rgb
//             // convert back to rgb
//             // var hex = hue / 60
//             // var primaryColour = Math.floor(hex);
//             // var secondaryColour = 1 - primaryColour;
 
//             // var a = (1 - saturation) * value;
//             // var b = (1-(saturation * secondaryColour)) * value;
//             // var c = (1-(saturation * (1 - secondaryColour))) * value;

//             // var convertedR, convertedG, convertedB

//             // switch(primaryColour){
//             //     case 0: 
//             //         convertedR = value;
//             //         convertedG = c;
//             //         convertedB = a;
//             //     case 1: 
//             //         convertedR = b;
//             //         convertedG = value;
//             //         convertedB = a;
//             //     case 2: 
//             //         convertedR = a;
//             //         convertedG = value;
//             //         convertedB = c;
//             //     case 3: 
//             //         convertedR = a;
//             //         convertedG = b;
//             //         convertedB = value;
//             //     case 4: 
//             //         convertedR = c;
//             //         convertedG = a;
//             //         convertedB = value;
//             //     case 5: 
//             //         convertedR = value;
//             //         convertedG = a;
//             //         convertedB = b;
                
//             // }

//             // imgOut.pixels[index + 0] = convertedR * 255;
//             // imgOut.pixels[index + 1] = convertedG * 255;
//             // imgOut.pixels[index + 2] = convertedB * 255;
//             // imgOut.pixels[index + 3] = 255;


//             // imgOut.pixels[index + 3] = 100; 

//             // imgOut.pixels[index + 0] = hue;
//             // imgOut.pixels[index + 1] = saturation;
//             // imgOut.pixels[index + 2] = value;
//             // imgOut.pixels[index + 3] = hue;
//             // console.log(convertedR, convertedG, convertedB)
//             }
//         }
//     imgOut.updatePixels();
//     return imgOut;
// }

