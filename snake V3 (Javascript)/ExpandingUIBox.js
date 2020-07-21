class ExpandingUIBox extends UIBox{
	constructor( x, y, width, height, fadeInDuration){
		super( x, y, 0, 0)
		this.lerp = new Lerp( [ 0, 0], [ width, height], fadeInDuration );
		this.ix = x;
		this.iy = y;
		this.iwidth = width;
		this.iheight = height;
		this.xscale = 1;
		this.yscale = 1;
		this.children = [];
	}

	tick(){
		this.lerp.tick();
		this.width = this.lerp.values[0] * this.xscale;
		this.height = this.lerp.values[1] * this.yscale;
		this.x = this.ix - this.width/2;
		this.y = this.iy - this.width/2;
		if ( !this.lerp.isRunning() ){
			this.showChildren = true;
			for (var i = this.children.length - 1; i >= 0; i--) {
				this.children[i].tick();
			}
		}
	}

	add( child ){
		this.children.push( child );
	}

	reset(){
		super.reset();
		this.lerp.reset();
		for (var i = this.children.length - 1; i >= 0; i--) {
			this.children[i].reset();
		}
	}
}