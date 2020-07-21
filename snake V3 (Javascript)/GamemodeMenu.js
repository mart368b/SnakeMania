class GamemodeMenu {

	constructor(){
		this.currentGamemode = " Classic";
		for (var i = settings.length - 1; i >= 0; i--) {
			var setting = settings[i]
			setting.x = (i%3) * setting.width + 3*(i%3) + 1.5;
			setting.y = Math.floor(i/3) * setting.height + 3*(Math.floor(i/3)) + 20;
		}
	}	

	press( x, y){
		for (var i = settings.length - 1; i >= 0; i--) {
			settings[i].press( x, y);
		}

	}

	draw( display, xOffset, yOffset){
		xOffset += 100;
		for (var i = settings.length - 1; i >= 0; i--) {
			settings[i].draw( display, xOffset, 0);
		}
		display.drawStaticText( 50 + xOffset, 10, "center", "Gamemodes");
		display.drawStaticText( 50 + xOffset, 15, "center", "Current: " + this.currentGamemode);
	}
}