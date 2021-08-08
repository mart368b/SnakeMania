class DynamicLine extends Line{

	constructor( x0, y0, x1, y1, vx, vy, width ){
		super( x0, y0, x1, y1, width );
		this.vx = vx;
		this.vy = vy;
		this.dir = Directions.getDirection( this.vx, this.vy );
		this.previousDirections = [this.dir, this.dir];
	}
	moveTo( x, y){
		this.x0 = x;
		this.y0 = y;
		this.x1 = x;
		this.y1 = y;
	}

	// test if velocity is different from current velocity
	setVelocity( vx, vy ){
		if ( this.vx == 0 && vx != 0){
			this.updateVelocity( vx, vy);
		}else if ( this.vy == 0 && vy != 0 ){
			this.updateVelocity( vx, vy);
		}
	}
	// apply velocity
	updateVelocity( vx, vy ){
		var x = this.getX();
		var y = this.getY();
		this.moveTo( x, y );
		this.vx = vx;
		this.vy = vy;
		this.dir = Directions.getDirection( this.vx, this.vy );
		this.pushDirection( this.dir );
	}
	pushDirection( dir ){
		this.previousDirections[0] = this.previousDirections[1]
		this.previousDirections[1] = dir;
	}
	// move point
	increase( length ){
		if (this.vx > 0){
			this.x1 += this.vx * length;	
		}else{
			this.x0 += this.vx * length;	
		}
		if (this.vy > 0){
			this.y1 += this.vy * length;	
		}else{
			this.y0 += this.vy * length;	
		}
	}

	decrease( length ){
		if (this.vx > 0){
			this.x1 -= this.vx * length;	
		}else{
			this.x0 -= this.vx * length;	
		}
		if (this.vy > 0){
			this.y1 -= this.vy * length;	
		}else{
			this.y0 -= this.vy * length;	
		}
	}

	// return the closes line in lines in fromt of the moving edge
	getClosestCollision( lines ){
		var x = this.getX();
		var y = this.getY();
		var horizontal = Directions.isHorizontal( this.dir );
		var offset = this.getOffset( this.dir );
		var closestLine = null;
		var currentDistance = 100;
		for (var i = 0; i < lines.length - 1; i++) {
			var line = lines[i];
			if (debuger){
				line.resetCheck();
			}
			// check if it can be hit by continuing
			var canHit;
			if ( horizontal ){
				canHit = line.canBeHit( this.dir, x , y - offset, x , y  + offset );
			}else{
				canHit = line.canBeHit( this.dir, x  - offset, y, x  + offset, y );
			}
			if ( !canHit ){
				continue;
			}
			var edge = line.getEdge( this.dir );
			// check if edge is in front of moving edge
			var distance = edge - x
			if ( horizontal){
				var distance = Math.abs(edge - x);	
			}else{
				var distance = Math.abs(edge - y);
			}
			if ( debuger ){
				var color = canHit ? "#FF0000": "#000000";
				line.checkedSide[ this.dir ] = color;
			}
			// check if closer
			if ( distance < currentDistance ) {
				currentDistance = distance;
				closestLine = line;
			}
		}
		// return closest edge and distance
		return [ closestLine, Math.round(currentDistance*1000)/1000 ];
	}
	// get moving edge
	getX(){
		if (this.vx > 0){
			return this.x1;
		}
		return this.x0;
	}
	// get moving edge
	getY(){
		if (this.vy > 0){
			return this.y1;
		}
		return this.y0;
	}
	// of offset based on moving direction
	getOffset( dir ){
		switch( dir ){
			case Directions.Down:
				return -this.width;
			case Directions.Left:
				return this.width;
			case Directions.Up:
				return this.width;
			case Directions.Right:
				return -this.width;
		}
	}

	checkCollision( dynamicLine){
		var ty0 = Math.min(this.y0, this.y1) - this.width
		var ty1 = Math.max(this.y0, this.y1) + this.width
		var tx0 = Math.min(this.x0, this.x1) - this.width
		var tx1 = Math.max(this.x0, this.x1) + this.width

		var dy0 = Math.min(dynamicLine.y0, dynamicLine.y1) - dynamicLine.width
		var dy1 = Math.max(dynamicLine.y0, dynamicLine.y1) + dynamicLine.width
		var dx0 = Math.min(dynamicLine.x0, dynamicLine.x1) - dynamicLine.width
		var dx1 = Math.max(dynamicLine.x0, dynamicLine.x1) + dynamicLine.width

		var colx0 = tx0 < dx1 ? 1: 0;
		var colx1 = tx1 > dx0 ? 1: 0;

		var coly0 = ty0 < dy1 ? 1: 0;
		var coly1 = ty1 > dy0 ? 1: 0;
		var col = (colx0?1:0) + (colx1?1:0) + (coly0?1:0) + (coly1?1:0);
		if ( col != 4){
			return null;
		}
		var overlap;
		switch(this.dir){
			case Directions.Up:
			console.log("up")
				overlap =  dy1 - ty0;
				break;
			case Directions.Right:
			console.log("right")
				overlap = tx1 - dx0;
				break;
			case Directions.Down:
			console.log("down")
				overlap =  ty1 - dy0;
				break;
			case Directions.Left:
			console.log("left")
				overlap = tx0 - dx1;
				break;
		}
		return -Math.abs(overlap)*1.002;
	}
}