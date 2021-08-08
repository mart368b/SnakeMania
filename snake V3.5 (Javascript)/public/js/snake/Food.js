class Food	{
	constructor( x, y, width, increaseLength, increaseSize, increaseSpeed, dangerous, moving ){
		this.x = x;
		this.y = y;
		this.width = width;
		this.used = false;
		this.increaseLength = increaseLength;
		this.increaseSize = increaseSize;
		this.increaseSpeed = increaseSpeed;
		this.dangerous = dangerous;
		this.moving = moving
		if ( this.moving ){
			var angle = Math.random() * Math.PI * 2;
			this.vx = Math.sin( angle ) * foodSpeed;
			this.vy = Math.cos( angle ) * foodSpeed;
		}
	}

	checkCollision( snake ){
		for (var i = snakes.length - 1; i >= 0; i--) {
			snake = snakes[i];
			var x = snake.getX();
			var y = snake.getY();
			if ( Math.abs(this.x - x) <= this.width + snake.width && Math.abs(this.y - y) <= this.width + snake.width){
				if ( this.dangerous ){
					gameOver( this.x, this.y, this.width, snake);
				}else{
					this.used = true;
					snake.feed( this.increaseLength, this.increaseSize, this.increaseSpeed );	
				}
			}
		}
	}

	tick(){
		if ( this.moving ){
			this.x += this.vx;
			this.y += this.vy;
			this.checkBoundaries();
		}
	}

	checkBoundaries(){
		if ( this.x < -this.width){
			this.x = 100 + this.width
		}else if ( this.x > 100 + this.width){
			this.x = this.width;
		}else if ( this.y < -this.width){
			this.y = 100 + this.width;
		}else if ( this.y > 100 + this.width){
			this.y = -this.width;
		}
	}

	draw( display ){
		if ( this.dangerous ){
			display.setFillColor( "#FF0000" );	
		}else{
			display.setFillColor( "#00FF00" );
		}
		
		if ( debuger ){
			display.drawRect( this.x - this.width, this.y - this.width, this.x + this.width, this.y + this.width )
			display.drawRect( this.x - this.width - snakeWidth, this.y - this.width - snakeWidth, this.x + this.width + snakeWidth, this.y + this.width + snakeWidth )
		}else{
			display.drawFilledRect( this.x - this.width, this.y - this.width, this.x + this.width, this.y + this.width )	
		}
		
	}
}