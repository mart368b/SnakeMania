class Snake extends DynamicLine{
	constructor( x, y , width, speed, index, playerInformation){
		super( x, y, x, y, 1, 0, width );
		this.tails = [];
		this.distanceTraveled = 0;
		this.distanceSinceLastTurn = this.width*3;
		this.closestLine = [null];
		this.activeAlignment = true;
		this.debugLine = new Line( 0, 0, 0, 0, 0)
		this.running = false;
		this.lengthExtender = 0;
		this.ix = x;
		this.iy = y;
		this.initialSpeed = speed;
		this.speed = speed;
		this.initalWidth = width;
		this.index = index;
		this.alive = true;
		this.color = playerInformation[0];
	}

	reset(){
		this.x0 = this.ix;
		this.y0 = this.iy;
		this.x1 = this.ix;
		this.y1 = this.iy;
		this.width = this.initalWidth;
		this.speed = this.initialSpeed;
		this.tails = [];
		this.distanceTraveled = 0;
		this.distanceSinceLastTurn = this.width*3;
		this.closestLine[0] = null;
		this.activeAlignment = false;
		this.running = false;
		this.lengthExtender = 0;
		this.alive = true;
		this.vx = 0;
		this.vy = 0;
	}

	tick(){
		if ( !this.alive ){
			return;
		}
		// move snake
		super.increase( this.speed );
		if ( !this.running && this.distanceTraveled >= initialLength){
			this.running = true;
			this.moveLastTail( this.distanceTraveled - initialLength );
		}else{
			this.distanceTraveled += Math.abs(this.vx * this.speed);
			this.distanceTraveled += Math.abs(this.vy * this.speed);	
		}
		
		this.checkBoundaries();

		this.distanceSinceLastTurn += Math.abs(this.vx * this.speed);
		this.distanceSinceLastTurn += Math.abs(this.vy * this.speed);

		this.checkClosestCollision();
		if ( this.running){
			this.moveLastTail( this.speed )
		}
		for (var i = snakes.length - 1; i >= 0; i--) {
			if ( i == this.index){
				continue;
			}
			var col = this.checkCollision(snakes[i]);
			if (col != null){
				this.increase(col);
				gameOver( this.getX(), this.getY(), this.width, this);
			}
		}
	}

	feed( length, size, speed ){
		this.createTail();
		this.moveTo( this.getX(), this.getY());
		this.lengthExtender += length;
		this.width += size
		this.speed += speed;
	}

	moveLastTail( length ){
		if (this.lengthExtender > 0){
			this.lengthExtender -= length;
			if (this.lengthExtender < 0){
				length = -this.lengthExtender;
				this.moveLastTail( -this.lengthExtender );
				this.lengthExtender = 0;
			}
		}else{
			if ( this.tails.length == 0 ){
				this.decrease( length );
			}else{
				var lastTail = this.tails[0]
				lastTail.decrease( length );
				if ( lastTail.excess > 0 ){
					lastTail = this.tails.shift();
					this.moveLastTail( lastTail.excess )
				}
			}
		}
	}

	decrease( length ){
		if (this.vx > 0){
			this.x0 += this.vx * length;	
		}else{
			this.x1 += this.vx * length;	
		}
		if (this.vy > 0){
			this.y0 += this.vy * length;	
		}else{
			this.y1 += this.vy * length;	
		}
	}

	draw(display){
		super.draw(display);
		display.setFillColor(this.color);
		super.drawHitBox(display);
		for (var i = this.tails.length - 1; i >= 0; i--) {
			display.setFillColor(this.color);
			this.tails[i].draw(display);
		}
		if (debuger && this.activeAlignment ){
			if ( this.debugLine != null){
				display.setColor("#0000FF");
				this.debugLine.drawLine( display );	
			}
		}
	}
	// check if snake is inside screen
	checkBoundaries(){
		var x = this.getX();
		var y = this.getY();
		if ( x < 0){
			this.createTail();
			this.distanceSinceLastTurn = this.width*3;
			this.moveTo( 100, y);
		}else if ( x > 100 ){
			this.createTail();
			this.distanceSinceLastTurn = this.width*3;
			this.moveTo( 0, y);
		}else if ( y < 0){
			this.createTail();
			this.distanceSinceLastTurn = this.width*3;
			this.moveTo( x, 100);
		}else if ( y > 100){
			this.createTail();
			this.distanceSinceLastTurn = this.width*3;
			this.moveTo( x, 0);
		}
	}
	// check for snake collision with tail
	checkClosestCollision(){
		this.closestLine = super.getClosestCollision(this.tails);
		if ( snakes.length > 1){
			for (var i = 0; i < snakes.length; i++) {
				if ( i != this.index ){
					var closestLine = super.getClosestCollision( snakes[i].tails )
					if ( closestLine[0] != null && closestLine[1] < this.closestLine[1] ){
						this.closestLine = closestLine;
					}
				}
			}
		}
		if ( this.closestLine[0] != null){
			var distance = this.closestLine[1];
			if ( distance < this.width ){
				gameOver( this.getX(), this.getY(), this.width, this);
			}
		}
	}
	// override parent method when turning
	updateVelocity( vx, vy ){
		var dif = this.distanceSinceLastTurn - (this.width*2);
		this.activeAlignment = false;
		var peformedAlignment = false;
		if ( dif < 0 ){
			if (this.previousDirections[0] != Directions.getDirection( vx, vy)){
				if (-dif > snapThreshhold*2){
					if (this.vx != 0){
						gameOver( this.x1 - this.width, this.y0 + this.width * this.vy, this.distanceSinceLastTurn, this );
					}else{
						gameOver( this.x1 + this.width * this.vx, this.y1  - this.width, this.distanceSinceLastTurn, this );
					}
					return;
				}
				peformedAlignment = true;
				this.activeAlignment = true;	
				if (this.vx != 0){
					if (this.vx > 0){
						this.x1 -= this.vx * dif;	
						if ( debuger){
							this.debugLine.setPosition( this.x1 - this.width, 0, this.x1 - this.width, 100);
						}
					}else{
						this.x0 -= this.vx * dif;	
						if ( debuger){
							this.debugLine.setPosition( this.x1 - this.width, 0, this.x1 - this.width, 100);
						}
					}	
				}else{
					if (this.vy > 0){
						this.y1 -= this.vy * dif;
						if ( debuger){
							this.debugLine.setPosition( 0, this.y1 - this.width, 100, this.y1 - this.width);
						}	
					}else{
						this.y0 -= this.vy * dif;	
						if ( debuger){
							this.debugLine.setPosition( 0, this.y1 - this.width, 100, this.y1 - this.width);
						}
					}
				}
				this.moveLastTail( -dif );
			}
		}
		this.distanceSinceLastTurn = 0;
		this.createTail( this.x, this.y, this.lx, this.ly );
		var lDir = this.dir;
		super.updateVelocity( vx, vy );
		this.closestLine = super.getClosestCollision(this.tails);
		if ( !peformedAlignment && this.closestLine[0] != null ){
			this.tryAllignEdge( this.closestLine[0], lDir );
		}
	}
	
	canTurn(){
		return this.distanceSinceLastTurn >= this.width*2;
	}

	tryAllignEdge( line, lDir ){
		var line = this.closestLine[0];

		var dir1 = Directions.rotateCounterClockwise( this.dir );
		var dir2 = Directions.rotateClockwise( this.dir );
		
		var lineEdge1 = line.getEdge( dir1 );
		var lineEdge2 = line.getEdge( dir2 );

		var edge1 = this.getEdge( dir1 );
		var edge2 = this.getEdge( dir2 );

		var distance1 = lineEdge1 - edge2;
		var distance2 = lineEdge2 - edge1;
		
		var offset = 0;
		var usedEdge;
		if ( Math.abs(distance1) <= snapThreshhold){
			offset = distance1;
			usedEdge = lineEdge1;
		}else if (Math.abs(distance2) <= snapThreshhold){
			offset = distance2;
			usedEdge = lineEdge2
		}else{
			return;
		}

		this.activeAlignment = true;
		if ( Directions.isHorizontal( this.dir) ){
			this.y0 += offset;
			this.y1 += offset;
			if (debuger){
				this.debugLine.setPosition( 0, usedEdge, 100, usedEdge);
			}
		}else{
			this.x0 += offset;
			this.x1 += offset;
			if (debuger){
				this.debugLine.setPosition( usedEdge, 0, usedEdge, 100);
			}
		}

		var newTail = this.tails[ this.tails.length - 1 ];
		switch( lDir ){
			case Directions.Down:
				newTail.y1 += offset;
				break;
			case Directions.Left:
				newTail.x0 += offset;
				break;
			case Directions.Up:
				newTail.y0 += offset;
				break;
			case Directions.Right:
				newTail.x1 += offset;
				break;
		}
		this.moveLastTail( offset );

	}

	createTail(){
		this.tails.push(new Tail( this.x0, this.y0, this.x1, this.y1, -this.vx, -this.vy, this.width));
	}

}