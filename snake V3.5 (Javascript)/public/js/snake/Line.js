class Line{
	constructor( x0, y0, x1, y1, width ){
		this.x0 = x0;
		this.y0 = y0;	
		this.x1 = x1;
		this.y1 = y1;

		this.checked = false;
		this.checkedSide = [ "#000000", "#000000", "#000000", "#000000" ];
		this.width = width;
	}

	resetCheck(){
		for (var i = this.checkedSide.length - 1; i >= 0; i--) {
			this.checkedSide[i] = "#000000";
		}
	}

	// draw line from last turn position to point
	draw( display ){
		this.drawHitBox( display );
	}
	// check if a given edge could hit this one
	canBeHit( dir , x0, y0, x1, y1 ){
		if ( Directions.isHorizontal(dir)){
			return this.y0 - this.width < y0 && this.y1 + this.width > y0 || this.y0 - this.width < y1 && this.y1 + this.width > y1;
		}else{
			return this.x0 - this.width < x0 && this.x1 + this.width > x0 || this.x0 - this.width < x1 && this.x1 + this.width > x1;
		}
	}

	// get opposit edge if direction
	getEdge( dir ){
		switch( dir ){
			case Directions.Down:
				return this.y0 - this.width;
			case Directions.Left:
				return this.x1 + this.width;
			case Directions.Up:
				return this.y1 + this.width;
			case Directions.Right:
				return this.x0 - this.width;
		}
	}

	setPosition(  x0, y0, x1, y1 ){
		this.x0 = x0;
		this.y0 = y0;	
		this.x1 = x1;
		this.y1 = y1;
	}

	// draw line from last turn position to point
	drawHitBox( display){
		if (debuger){
			display.setColor("#0000FF")
			display.drawLine( this.x0, this.y0, this.x1, this.y1 );

			var x0 = this.x0 - this.width;
			var y0 = this.y0 - this.width;
			var x1 = this.x1 + this.width;
			var y1 = this.y1 + this.width;
			// top
			display.setColor( this.checkedSide[ Directions.Down ]);
			display.drawLine( x0, y0, x1, y0);
			//right
			display.setColor( this.checkedSide[ Directions.Left ]);
			display.drawLine( x1, y0, x1, y1);
			//bottom
			display.setColor( this.checkedSide[ Directions.Up ]);
			display.drawLine( x1, y1, x0, y1);
			//left
			display.setColor( this.checkedSide[ Directions.Right ]);
			display.drawLine( x0, y1, x0, y0);
		}else{
			display.drawFilledRect( this.x0 - this.width, this.y0 - this.width, this.x1 + this.width, this.y1 + this.width );
		}
	}

	drawLine( display ){
		display.drawLine( this.x0, this.y0, this.x1, this.y1);

	}
}