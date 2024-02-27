/** EXTENSIONS
 * Extension inspired by "Image pixels and transformations" by Parametric online:
 * https://www.youtube.com/watch?v=GZOrpJ-GNiY
 * In his video, he covered how to read pixel data 
 * and perform transformations based on brightness of pixels and vector fields.
 
 * I have expanded on it in the PostalImg filter by using these ideas, 
 * combined with a sepia filter to create a shimmering 'postal sticker' effect.

/** ------------------------------------------------------------------------------------
 * MOSAIC FILTER
 * Takes in an image and the intended x and y position for output.
 * Loops through the pixel array and increment by 4 pixels.
 * Based on brightness of pixel, map it between two colours.
 * Draw a ellipse that has a size between 0 and the increment.
 * Return the processed r, g, b as h, s, v in an array
 ------------------------------------------------------------------------------------- */

function mosaic(imgIn, x, y) {
  push();
  translate(x, y); // draws output at x and y

  imgIn.loadPixels();
  noStroke();

  /** incr dictates how big the ellipse is and how many pixels to skip in a loop */
  var incr = 4; 

  /**  loop through the width and height of the image */
  for (let i = 0; i < imgIn.width; i += incr) {
    for (let j = 0; j < imgIn.height; j += incr) {
      let c = imgIn.get(i, j); // get the colour at i (width) and j (height)
      let b = brightness(c); // get the brightness value (between 0 - 100)
      let v = map(b, 0, 100, 0, 1); // map brightness value to 0 - 1

      /** lerp between black and white, depending on brightness of pixel */
      let c1 = color(0); // black
      let c2 = color(255); // white
      let colour = lerpColor(c1, c2, v); // monochrome
      fill(colour); 

      let r = map(b, 0, 100, 0, incr); // radius depends on brightness

      ellipse(i, j, r, r); // draw ellipse at (i,j)
    }
  }
  pop();
}

/** ------------------------------------------------------------------------------------
 * POSTALIMG FILTER
 * Takes in an image and the intended x and y position for output.
 * Loops through the pixel array and increment by 4 pixels.
 * Based on brightness of pixel, map it between two colours.
 * Draw a ellipse that has a size between 0 and the increment.
 * Return the processed r, g, b as h, s, v in an array
 ------------------------------------------------------------------------------------- */

function postalImg(imgIn, x, y) {
  push();
  translate(x, y); // top left of output
  scale(2); // image output is scaled by 2
  imgIn.loadPixels();
  noStroke();

  var incr = 4;

  /**  loop through the width and height of the image */
  for (let i = 0; i < imgIn.width; i += incr) {
    for (let j = 0; j < imgIn.height; j += incr) {
      push();
      translate(i, j); // draw at (i,j)

      let c = imgIn.get(i, j); // colour at (i,j)

      noiseDetail(5, 0.5); // 5 octaves, 0.5 falloff for each octave

      let n = noise(i, j); // noise depends (i,j)
      let w = lerp(1, incr, n); // width is calculated betwen 1 and increment, interlopated by n
      let v = createVector(mouseX - i, mouseY - j); // get the vector between the mouse and the particular i and j
      rotate(v.heading()); // rotates the rectangle by the 2d angle

    /** sepia reference: https://stackoverflow.com/questions/1061093/how-is-a-sepia-tone-created*/

      let r,g,b, altR, altG, altB // old and new rgb
      r = c[0]
      g = c[1]
      b = c[2]
      
      /** altered r,g,b based on sepia algorithm */
      altR = (r * 0.393) + (g * 0.769) + (b * 0.189)
      altG = (r * 0.349) + (g * 0.686) + (b * 0.168)
      altB = (r * 0.272) + (g * 0.534) + (b * 0.131);


      /** fill by the new colours */
      fill(color(altR, altG, altB));

      /** width and height depends on noise */
      rect(0, 0, w * 3, w * 3, random(0.2, 0.5)); // 'roundness' of rect is random
      pop();
    }
  }
  pop();
}

