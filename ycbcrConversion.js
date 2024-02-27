/** ----------------------------------------------------------------------------------------
 * YCBR FILTER
 * Takes in a r, g, b
 * Calculates yPrime, Cb and Cr based on algorithm given in sheet.
 * Return the processed r, g, b in an array
 ------------------------------------------------------------------------------------------ */

 // new code
function rgbToYCBCR(r,g,b)
{
        var yPrime, Cb, Cr; // values to be returned
        /** apply algorithm on r, g, b values */
        yPrime = 0.299 * r + 0.587 * g + 0.114 * b;
        Cb = 128 -0.169 * r - 0.331 * g + 0.5 * b;
        Cr = 128 + 0.500 * r - 0.419 * g - 0.081 * b;

        return [yPrime, Cb, Cr, 255] // return the new r,g,b with yPrime, Cb and Cr values
}
// end of new code
