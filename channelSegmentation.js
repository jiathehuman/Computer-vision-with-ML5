/** CHANNEL FUNCTION
 *  Takes in r, g, b value and a string.
 *  Suppresses r, g, b according to string.
 *  Returns an array with only 1 channel with value > 0.
 */
function channel(r,g,b, channel)
{
    var altR = altG = altB = 0 // returned r,g,b is 0 by default

    // based on channel, decide which color to not suppress.
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
    return [altR, altG, altB, 255]; // return altered r,g,b
}

/** CHANNEL FUNCTION
 *  Perform threshold on an image with one segment.
 */
function channelSegmentation(r,g,b, channel){

    // by default, all targets are 0
    var redTarget = 0
    var blueTarget = 0
    var greenTarget = 0

    // by default, all returned r,g,b are 0
    var altR = altG = altB = 0 
    var threshold = 0;

    // depending on the channel, get the threshold from slider values
    // target for that particular color becomes 255
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

    // calculates difference between two colors
    var d = dist(r,g,b,redTarget,greenTarget,blueTarget)

    // if the color is close enough to target, return all original colours.
    if(d < threshold)
    {
        altR = r;
        altG = g;
        altB = b;
    }
    else{ // otherwise if color is far from target
        var dark = (r + g + b) / 3 * 0.1; // make it dark so the difference in colour is more obvious
        altR = altG = altB = dark;
    }

    return[altR, altG, altB, 255] // return altered r,g,b
}
