class ToggleButton extends Button{
	constructor( x, y, width, height, img, action){
		super( x, y, width, height, "", action );
		this.active = false;
		this.images = [];
		for (var i = img.length - 1; i >= 0; i--) {
			var image = new Image();
			image.src = img[i];
			var container = [image, width, height];
			this.images.push(container);
		}
	}

	pressed (){
		super.pressed();
		this.active = !this.active;
	}

	draw( display, xOffset, yOffset){
		var container = this.images[ this.active ? 0: 1 ];
		display.drawStaticImage( container[0] , this.x + xOffset, this.y + yOffset, container[1], container[2] );
		//display.drawStaticRect( this.x + xOffset, this.y + yOffset, this.width, this.height)
	}
}