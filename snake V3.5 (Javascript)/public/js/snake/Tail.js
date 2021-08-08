class Tail extends DynamicLine{
	constructor( x0, y0, x1, y1, vx, vy, width ){
		super(x0, y0, x1, y1, vx, vy, width);
		this.excess = 0;
	}

	draw(display){
		super.draw(display);
	}

	decrease( length ){
		super.decrease( length );
		if ( this.vy == 0){
			if ( this.x0 >= this.x1 ){
				this.excess = this.x0 - this.x1;
			}
		}else{
			if ( this.y0 >= this.y1 ){
				this.excess = this.y0 - this.y1;
			}
		}
	}
}