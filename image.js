/** ------------------------------------------------------------------
 * CLASS PICTURE
 * Class takes in a width, height and intended x and y pos.
 * loadPicture creates an image from the base img
 * show places the image at the given position
 * picture objects are constructed in setup
 ------------------------------------------------------------------- */

// new code
class Picture {
  constructor(imgWidth, imgHeight, posX, posY) {
    this.w = imgWidth;
    this.h = imgHeight;
    this.x = posX; // picture's x position on canvas
    this.y = posY; // picture's y position on canvas
    this.img = createImage(this.w, this.h); // created in setup
  }

  /** loads the image into the image of this picture object */
  loadPicture(image) {
    try {
      this.img = image.get(); 
    } catch (error) {
      console.log("Webcam not ready");
    }
  }

  /** displays the image at the (this.x, this.y) coordinates */
  show() {
    try {
      image(this.img, this.x, this.y);
    } catch (error) {
      console.log("Load image again")
    }
  }
}
// end of new code
