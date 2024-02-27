/** ------------------------------------------------------------------------------------
 * HSV FILTER
 * Takes in a r, g, b
 * Depending on the r,g,b values, calculate hue, saturation and value.
 * Return the processed r, g, b as h, s, v in an array
 ------------------------------------------------------------------------------------- */

// new code
function rgbToHSV(r,g,b)
{
    r /= 255, g/=255, b/=255; // divide all by 255 to normalise

    var rPrime, gPrime, bPrime, hue; // r,g,b prime and hue

    var max = Math.max(r,g,b); // maximum among r,g,b values
    var min = Math.min(r,g,b); // minimum among r,b,b values

    const diff = max - min; 

    var saturation = diff / max; // saturation is the difference over max
    var value = max; // value is max

    /** prime values */
    rPrime = (max - r)/ diff;
    gPrime = (max - g)/ diff;
    bPrime = (max - b)/ diff;

    // calculate the hue
    if(saturation == 0) hue = 0;
    else if(r == max && g == min) hue = 5 + bPrime;
    else if(r==max && g!= min) hue = 1 - gPrime;
    else if(g==max && b == min) hue = rPrime + 1;
    else if(g==max && b != min) hue = 3 - bPrime;
    else if(r == max) hue = 3 + gPrime;
    else hue = 5 - rPrime;

    // hsv values, altered to 0 - 255
    let mhue = ((hue * 60) / 360) * 255; // hue was 0 to 360

    // saturation and value was 0 to 0.1
    saturation = (saturation * 100);
    value = (value * 100);

    // saturation and value was from 0 to 100
    let mSaturation = map(saturation, 0, 100, 0, 255);
    let mValue = map(value,0,100,0,255);

    // modified hsv values have values from 0 to 255
    return[mhue, mSaturation, mValue, 255]
}
// end of new code



