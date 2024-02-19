// reference: https://gist.github.com/avisek/eadfbe7a7a169b1001a2d3affc21052e

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

    let mSaturation = map(saturation, 0, 100, 0, 255);
    let mValue = map(value,0,100,0,255);

    return[hue, mSaturation, mValue]
}
// end of new code



