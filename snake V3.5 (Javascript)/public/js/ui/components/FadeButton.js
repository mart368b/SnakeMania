class FadeButton extends Button{
	constructor( x, y, width, height, text, action, fadeTime ){
		super( x - width/2, y, width, height, text, action );
		this.lerp = new Lerp( [ y + height/2, 0.], [ y, 1. ], fadeTime);
		this.visible = false;
	}

	tick(){
		if ( this.lerp.isRunning() ){
			this.lerp.tick();
			this.y = this.lerp.values[ 0 ];
			this.opacity = this.lerp.values[ 1 ];
			this.visible = this.opacity > 0;
		}
	}

	draw( display, xOffset, yOffset ){
		if ( !this.visible ){
			return;
		}
		display.setOpacity( this.opacity );
		super.draw( display, xOffset, yOffset);
		display.setOpacity( 1 );
	}
}