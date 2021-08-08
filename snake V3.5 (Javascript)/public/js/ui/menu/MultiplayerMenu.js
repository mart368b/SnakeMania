class MultiplayerMenu {

	constructor(){
		this.playerSelectors = [
			new PlayerSelector( 7.5, 12.5, 40, 30, function(){
				startMenu.views[1].addPlayer();
			}, 0, keys1),
			new PlayerSelector( 52.5, 12.5, 40, 30, function(){
				startMenu.views[1].addPlayer();
			}, 1, keys2),
			new PlayerSelector( 7.5, 47.5, 40, 30, function(){
				startMenu.views[1].addPlayer();
			}, 2, keys3),
			new PlayerSelector( 52.5, 47.5, 40, 30, function(){
				startMenu.views[1].addPlayer();
			}, 3, keys4)
		]
		this.playerSelectors[0].active = true;

	}	

	press( x, y){
		for (var i = this.playerSelectors.length - 1; i >= 0; i--) {
			this.playerSelectors[i].press( x, y);
		}
	}

	addPlayer(){
		for (var i = 0; i < this.playerSelectors.length; i++){
			if ( !this.playerSelectors[i].active ){
				this.playerSelectors[i].active = true;
				return;
			}
		}
	}

	removePlayer(){
		for (var i = this.playerSelectors.length - 1; i >= 1; i--) {
			if (this.playerSelectors[i].active) {
				this.playerSelectors[i].active = false;
				return;
			}
		}
	}

	getActivePlayers (){
		var playerInformation = []
		for (var i = 0; i < this.playerSelectors.length; i++) {
			if ( this.playerSelectors[i].active ){
				playerInformation.push( this.playerSelectors[i].getPlayerInformation() );
			}
		}
		return playerInformation;
	}

	draw( display, xOffset, yOffset){
		xOffset += 100;
		display.setFontSize(2);
		display.drawStaticText( 50 + xOffset, 10, "center", "Multiplayer");
		for (var i = this.playerSelectors.length - 1; i >= 0; i--) {
			this.playerSelectors[i].draw( display, xOffset, yOffset);
		}
	}
}