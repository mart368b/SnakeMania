class KeyDisplay{
	constructor( x, y, key){
		this.x = x;
		this.y = y;
		this.key = key;
		var image = new Image();
		image.src = keyUrl;
		this.keyImage = image;
	}

	draw( display, xOffset, yOffset){
		display.drawStaticImage(this.keyImage, this.x + xOffset, this.y + yOffset, 6, 6);
		display.drawStaticText( this.x + xOffset + 3, this.y + yOffset + 2.5, "right", this.key);
	}
}
