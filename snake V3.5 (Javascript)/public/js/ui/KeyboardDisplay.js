class KeyboardDisplay{
	constructor( x, y, keys){
		this.keys = [
			new KeyDisplay( 0 + x, 6 + y, keys[0] ),
			new KeyDisplay( 6 + x, 6 + y, keys[1] ),
			new KeyDisplay( 12 + x, 6 + y, keys[2] ),
			new KeyDisplay( 4 + x, 0 + y, keys[3] )
		];
	}

	draw( display, xOffset, yOffset){
		for (var i = this.keys.length - 1; i >= 0; i--) {
			this.keys[i].draw( display, xOffset, yOffset);
		}
	}	
}