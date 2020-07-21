class Settings extends Button{
	constructor( name, changes ){
		super( 0, 0, 30, 10, name, function() {});
		this.changes = changes;
		this.fontSize = 2;
	}

	pressed(){
		startMenu.setGamemode( this.text );

		resetSettings();
		if (this.changes == null){
			return;
		}

		for ( var key in this.changes){
			applyChange( key, this.changes[key]);
		}
	}

	draw( display, xOffset, yOffset){
		super.draw( display, xOffset, yOffset);
	}
}