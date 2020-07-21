class UIBox{
	constructor( x, y, width, height ){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.border = true;
	}

	add( child ){
		this.children.push( child );
	}

	draw( display, xOffset, yOffset ){
		display.setFillColor( "#FFFFFF" );
		display.drawStaticFilledRect( this.x  + xOffset, this.y + yOffset, this.width, this.height);
		if ( this.border ){
			display.drawStaticRect( this.x + xOffset, this.y + yOffset, this.width, this.height);
		}
	}

	reset(){
		this.showChildren = false;
	}
}