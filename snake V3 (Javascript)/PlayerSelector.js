class PlayerSelector extends Button{

	constructor( x, y, width, height, action, index, keys){
		super( x, y, width, height, "", action );
		this.active = false;
		this.index = index;
		this.colorIndex = 0;

		if (PlayerSelector.leftImg == null){
			var image = new Image();
			image.src = leftShiftUrl;
			PlayerSelector.leftImg = image;
		}
		if (PlayerSelector.rightImg == null){
			var image = new Image();
			image.src = rightShiftUrl;
			PlayerSelector.rightImg = image;
		}
		if (PlayerSelector.closeImg == null){
			var image = new Image();
			image.src = closeUrl;
			PlayerSelector.closeImg = image;
		}
		this.keyboard = new KeyboardDisplay( 10, 16, keys)
	}

	press(x, y){
		var wasActive = this.active;
		super.press( x, y);
		var localy = y - this.y;
		var localx = x - this.x;
		if ( wasActive && this.active ){
			if ( localy > 6 && localy < 14){
				if ( localx > 8 && localx < 15){
					this.decrementColor();
				}
				if ( localx > 25 && localx < 32){
					this.incrementColor();
				}
			}
			if ( localy > 0 && localy < 3){
				if ( localx > 0 && localx < 3){
					startMenu.views[1].removePlayer();
				}
			}
		}
	}

	incrementColor(){
		this.colorIndex += 1;
		if(this.colorIndex == snakeColors.length){
			this.colorIndex = 0;
		}
	}

	decrementColor(){
		this.colorIndex -= 1;
		if (this.colorIndex < 0){
			this.colorIndex = snakeColors.length - 1;
		}
	}

	pressed (){
		if ( !this.active){
			super.pressed();	
		}
	}

	getPlayerInformation(){
		return [snakeColors[this.colorIndex]];	
	}

	draw( display, xOffset, yOffset){
		if ( this.active ){
			display.setFillColor("#EEEEEE")
		}else{
			display.setFillColor("#AAAAAA")
		}
		var x = this.x  + xOffset
		var y = this.y + yOffset
		display.drawStaticFilledRect( this.x  + xOffset, this.y + yOffset, this.width, this.height);
		display.drawStaticRect( this.x + xOffset, this.y + yOffset, this.width, this.height);
		if (this.active){
			display.drawStaticText( x + 20, y + 5, "center", "Player " + (this.index + 1));
			display.setFillColor(snakeColors[this.colorIndex]);
			display.drawStaticFilledRect( x + 16, y + 6, 8, 8 );
			display.drawStaticImage(PlayerSelector.closeImg, x, y, 3, 3);
			display.drawStaticImage(PlayerSelector.leftImg, x + 8, y + 6, 8, 8);
			display.drawStaticImage(PlayerSelector.rightImg, x + 24, y + 6, 8, 8);

			this.keyboard.draw( display, x, y);
		}
		//display.drawStaticFilledRect( this.x + xOffset, this.y + yOffset, this.width, this.height)
	}
}

PlayerSelector.leftImg = null;
PlayerSelector.rightImg = null;
PlayerSelector.closeImg = null;