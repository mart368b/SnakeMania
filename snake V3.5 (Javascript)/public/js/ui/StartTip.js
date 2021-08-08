class StartTip{
	constructor(){
		this.x = 50;
		this.y = 50;
		this.lineLength = 10;
		this.lerp = new Lerp( [ 1 ], [ 0 ], 0.5 );
		this.upImg = new Image();
		this.upImg.src = upArrowUrl;

		this.rightImg = new Image();
		this.rightImg.src = rightArrowUrl;

		this.downImg = new Image();
		this.downImg.src = downArrowUrl;

		this.leftImg = new Image();
		this.leftImg.src = leftArrowUrl;

	}

	tick(){
		this.lerp.tick();
	}
	
	reset(){
		this.lerp.reset();
	}

	isActive(){
		return this.lerp.values[0] > 0;
	}

	draw( display, xOffset, yOffset, locked){
		var hw = snake.width*2;
		var iw = snake.width*4;

		var x0 = -hw;
		var y0 = -hw;
		var x1 = hw;
		var y1 = hw;

		display.setOpacity( this.lerp.values[0] )
		display.drawStaticImage( this.rightImg, x1 + xOffset, y0 + yOffset, iw, iw );
		display.drawStaticImage( this.upImg, x0 + xOffset, y0 - iw + yOffset, iw, iw );
		display.drawStaticImage( this.leftImg, x0 - iw + xOffset, y0 + yOffset, iw, iw );
		display.drawStaticImage( this.downImg, x0 + xOffset, y1 + yOffset, iw, iw );
		display.setOpacity(1)
		//display.drawLine( this.x, this.y, this.x + this.lineLength, this.y );
	}

}