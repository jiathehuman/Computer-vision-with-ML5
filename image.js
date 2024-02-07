class Picture{
    constructor(imgWidth, imgHeight, posX, posY){
        this.w = imgWidth;
        this.h = imgHeight;
        this.x = posX;
        this.y = posY;
        this.filter = filter;

        this.img = createImage(this.w, this.h)
    }

    loadPicture(image){
        this.img = image.get();
    }

    show(){
        image(this.img, this.x, this.y);
    }

    update(){

    }
}