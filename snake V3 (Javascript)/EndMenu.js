class EndMenu extends ExpandingUIBox{
	constructor(){
		super( 50, 50, 40, 40, endExpandSpeed );
		
		this.hidder = new ToggleButton( 0, 0, 3, 3, [ hideIconUrl, unHideIconUrl], function(){
			snakeDisplay.lerp.toggle();
		});

		this.restartButton = new Button( -15, 5, 30, 5, "Restart", function(){
			reset();
		});
		this.mainMenuButton = new Button( -15, 12, 30, 5, "Main Menu", function(){
			showStartMenu = true;
		});
		this.hide = false;
		this.timePassed = "";
		this.points = [];
		this.pointColors = [];
	}

	draw( snakeDisplay, xOffset, yOffset ){
		if ( this.hide ){
			this.hidder.draw( snakeDisplay, xOffset, yOffset );	
			return;
		}
		super.draw( snakeDisplay, xOffset, yOffset );
		if ( this.showChildren){
			snakeDisplay.setFontSize( 4 );
			snakeDisplay.drawStaticText( this.x + this.width/2 + xOffset, 35 , "center", "Game Over");
			this.hidder.draw( snakeDisplay, this.x + xOffset, this.y + yOffset );

			for (var i = this.points.length - 1; i >= 0; i--) {
				snakeDisplay.setFontSize( 3 );
				snakeDisplay.setFillColor(this.pointColors[i]);
				snakeDisplay.drawStaticText( this.x + this.width/2 + xOffset, 39 + 3 * i , "center", "Point " + (i + 1) + ": " + this.points[i]);
			}
			snakeDisplay.setFontSize( 3 );
			snakeDisplay.drawStaticText( this.x + this.width/2 + xOffset, 52.5 , "center", "Time: " + this.timePassed);

			this.restartButton.draw( snakeDisplay, xOffset + this.ix, yOffset + this.iy);
			this.mainMenuButton.draw( snakeDisplay, xOffset + this.ix, yOffset + this.iy);
		}
	}

	setTimePassed( elapsedTime ){
		elapsedTime /= 1000;
		var day     = Math.floor(elapsedTime / 86400);
		var hours   = Math.floor(elapsedTime / 3600 % 24);
		var minutes = Math.floor(elapsedTime / 60 % 60);
		var seconds = Math.floor(elapsedTime % 60);
		this.timePassed = "";
		var used = false;
		if ( day > 0 ){
			used = true;
			this.timePassed += day + "d ";
		}
		if ( used || hours > 0){
			used = true;
			this.timePassed += hours + "h ";
		}
		if ( used || minutes > 0){
			used = true;
			this.timePassed += minutes + "m ";
		}
		if ( used || seconds > 0){
			this.timePassed += seconds + "s ";
		}
	}

	calculatePoints( snakes ){
		this.points = [];
		this.pointColors = [];
		for (var i = snakes.length - 1; i >= 0; i--) {
			var snake = snakes[i];
			var points = this.getPoints(snake);
			for (var k = snake.tails.length - 1; k >= 0; k--) {
				points += this.getPoints( snake.tails[k] );
			}
			this.pointColors.push(snake.color);
			this.points.push( Math.round((points - snake.speed) * 100) / 100 );
		}
	}

	getPoints( line ){
		var distance = 0;
		if ( line.vx == 0 ) {
			distance += Math.abs(line.y0 - line.y1);
		}else{
			distance += Math.abs(line.x0 - line.x1);
		}
		return distance * line.width * 2;
	}

	press( x, y){
		if ( this.hide ){
			this.hidder.press( x, y);
		}else{
			this.hidder.press( x - this.x, y - this.y );
			this.restartButton.press( x - this.ix, y - this.iy );
			this.mainMenuButton.press( x - this.ix, y - this.iy );
		}
		
		if ( this.hidder.active != this.hide){
			this.lerp.toggle();
			this.showChildren = false;
			this.hide = this.hidder.active;	
		}
	}
}