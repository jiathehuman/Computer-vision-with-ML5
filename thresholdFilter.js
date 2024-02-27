/** ----------------------------------------------------------------------------------------
 * THRESHOLD FILTER
 * Takes in a r, g, b
 * Depending on the 'brightness' and 'threshold', force the pixel to be white or black.
 * Return the processed r, g, b in an array
 ------------------------------------------------------------------------------------------ */
// code given by coursera
function thresholdFilter(r,g,b){
    var altR = altG = altB = 0;
    var bright = (r + g + b) / 3; // simple
    var threshold = 100;

    // if the brightness is higher than threshold, force it to be white
    if (bright > threshold) {
        altR = 255;
        altG = 255;
        altB = 255;
    } 
     // if the brightness is lower than threshold, force it to be black
    else {
        altR = 0;
        altG = 0;
        altB = 0;
    }
    return [altR, altG, altB, 255]; return array
}
// end of code given by coursera