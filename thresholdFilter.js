function thresholdFilter(r,g,b){
    var altR = altG = altB = 0;
    var bright = (r + g + b) / 3; // simple
    var threshold = 100;

    if (bright > threshold) {
        altR = altG = altB = 255;
    } else {
        altR = altG = altB = 0;
    }
    return [altR, altG, altB];

}