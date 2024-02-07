function channel(r,g,b, channel)
{
    var altR = altG = altB = 0 

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
    return [altR, altG, altB];
}

function channelSegmentation(r,g,b, channel){
    var redTarget = blueTarget = greenTarget = 0
    var altR = altG = altB = 0 
    var threshold = 0;

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

    var d = dist(r,g,b,redTarget,greenTarget,blueTarget)
    if(d < threshold)
    {
        altR = r;
        altG = g;
        altB = b;
    }
    else{
        var grey = (r + g + b) / 3 * 0.1; // make it dark so the difference in colour is more obvious
        altR = altG = altB = grey;
    }

    return[altR, altG, altB]
}
