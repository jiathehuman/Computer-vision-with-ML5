// // code provided by Coursera Week 15

function greyscaleFilter(r,g,b){
    var grey = r * 0.299 + g * 0.587 + b * 0.114; // LUMA ratios 
    // new code
    var altGrey = min(grey , 255);
    let altR = altG = altB = altGrey;
    return [altR, altG, altB];
}
