class Button extends UIBox{
	constructor( x, y, width, height, text, action ){
		super( x, y, width, height )
		this.text = text;
		this.action = action;
		this.fontSize = 3;
	}

	press( x, y ){
		if ( x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height){
			this.pressed();
		}
	}

	pressed (){
		this.action();
	}

	draw( display, xOffset, yOffset  ){
		super.draw( display, xOffset, yOffset  );
		display.setFontSize( this.fontSize );
		display.drawStaticText( this.x + this.width/2 + xOffset, this.y + (this.height / 3) * 2 + yOffset, "center", this.text);
	}
}