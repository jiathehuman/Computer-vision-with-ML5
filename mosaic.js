function mosaic(imgIn, x, y) {
  push();
  translate(x, y);
  imgIn.loadPixels();
  noStroke();
  var incr = 4;

  /**  loop through the width and height of the image */
  for (let i = 0; i < imgIn.width; i += incr) {
    for (let j = 0; j < imgIn.height; j += incr) {
      let c = imgIn.get(i, j);
      let b = brightness(c);
      let v = map(b, 0, 100, 0, 1);
      // fill(0)
      let c1 = color(0);
      let c2 = color(255);
      let r = map(b, 0, 100, 0, incr);
      let colour = lerpColor(c1, c2, v);
      fill(colour);
      ellipse(i, j, r, r);
    }
  }
  pop();
}

function rectangleInt(imgIn, x, y) {
  push();
  translate(x, y);
  scale(2);
  imgIn.loadPixels();
  noStroke();
  var incr = 4;
  for (let i = 0; i < imgIn.width; i += incr) {
    for (let j = 0; j < imgIn.height; j += incr) {
      push();
      translate(i, j);

      let c = imgIn.get(i, j);

      noiseDetail(5, 0.5);
      let n = noise(i, j);
      let w = lerp(1, incr, n);
      let v = createVector(mouseX - i, mouseY - j);
      rotate(v.heading());

    // apply sepia filter
      let r,g,b, altR, altG, altB
      r = c[0]
      g = c[1]
      b = c[2]
      altR = (r * 0.393) + (g * 0.769) + (b * 0.189)
      altG = (r * 0.349) + (g * 0.686) + (b * 0.168)
      altB = (r * 0.272) + (g * 0.534) + (b * 0.131);


      fill(color(altR, altG, altB));
      rect(0, 0, w * 3, w * 3, random(0.2, 0.5));
      pop();
    }
  }
  pop();
}

