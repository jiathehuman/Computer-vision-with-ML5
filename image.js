/** ------------------------------------------------------------------
 * CLASS PICTURE
 * Class takes in a width, height and intended x and y pos.
 * loadPicture creates an image from the base img
 * show places the image at the given position
 ------------------------------------------------------------------- */

// new code
class Picture {
  constructor(imgWidth, imgHeight, posX, posY) {
    this.w = imgWidth;
    this.h = imgHeight;
    this.x = posX;
    this.y = posY;
    this.filter = filter;
    this.loaded = false;
    this.img = createImage(this.w, this.h);
  }

  loadPicture(image) {
    try {
      this.img = image.get();
    } catch (error) {
      console.log("Webcam not ready");
    }
  }

  show() {
    try {
      image(this.img, this.x, this.y);
    } catch (error) {
      console.log("show image failed")
    }
  }
}
// end of new code
