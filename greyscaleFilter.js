 /** ------------------------------------------------------------------------------------
 * GREYSCALE filter
 * Takes in a r, g, b
 * Depending on the r,g,b values, calculate hue, saturation and value.
 * Return the processed r, g, b as h, s, v in an array
 * based on code provided on Coursera Week 15 (University of London)
 ------------------------------------------------------------------------------------- */

function greyscaleFilter(r,g,b){
    var grey = r * 0.299 + g * 0.587 + b * 0.114; // LUMA ratios 
    // new code
    var altGrey = min(grey , 255);
    let altR = altG = altB = altGrey;
    return [altR, altG, altB, 255];
    // end of new code
}
