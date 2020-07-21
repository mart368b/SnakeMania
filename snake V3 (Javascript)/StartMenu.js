var firstTime = true;

class StartMenu extends UIBox{
	constructor(){
		super( 0, 0, 100, 100);
		this.border = false;
		
		this.startButton = new FadeButton( 50, 50, 30, 8, "Start Game", function(){ 
			showStartMenu = false;
			startGame();
		}, startFadeSpeed);
		
		this.levelsButton = new FadeButton( 50, 60, 30, 8, "Gamemodes", function(){
			startMenu.changeView( 0 );
		}, startFadeSpeed);
		
		this.multiplayerButton = new FadeButton( 50, 70, 30, 8, "Multiplayer", function(){
			startMenu.changeView( 1 );
		}, startFadeSpeed);

		this.aboutButton = new FadeButton( 50, 80, 30, 8, "About", function(){
			console.log("hello3");
		}, startFadeSpeed);

		this.backButton = new Button( 35, 80 , 30, 8, "Back", function(){
			startMenu.lerp.toggle();
		});

		var image = new Image();
		image.src = logoUrl;
		this.logo = image;
		
		this.xOffset = 0;
		this.lerp = new Lerp( [ 0 ], [ -100 ], menuSwapSpeed);
		this.lerp.toggle();

		this.views = [
			new GamemodeMenu(),
			new MultiplayerMenu()
		]
		this.sideMenu = this.views[0];
		
	}

	press( x, y){
		if ( firstTime ){
			return;
		}
		if ( this.xOffset == 0){
			this.startButton.press( x, y);
			this.levelsButton.press( x, y);	
			this.multiplayerButton.press( x, y);	
			this.aboutButton.press( x, y);	
		}else{
			this.backButton.press( x, y);
			this.sideMenu.press( x, y);
		}
		
	}

	changeView( viewId ){
		this.lerp.toggle();
		this.sideMenu = this.views[ viewId ];
	}

	tick(){
		if ( this.lerp.isRunning() ){
			this.lerp.tick();
			this.xOffset = this.lerp.values[ 0 ];
		}
		if ( firstTime ){
			this.playStartAnimation();
		}
	}

	playStartAnimation(){
		this.startButton.tick();
		if ( !this.startButton.lerp.isRunning() ){
			this.levelsButton.tick();
			if ( !this.levelsButton.lerp.isRunning() ){
				this.multiplayerButton.tick();
				if ( !this.multiplayerButton.lerp.isRunning() ){
					this.aboutButton.tick();
					if ( !this.aboutButton.lerp.isRunning() ){
						this.endStartAnimation();
					}
				}
			}
		}
	}

	setGamemode( name ){
		this.views[0].currentGamemode = name;
	}

	endStartAnimation(){
		firstTime = false;
	}

	draw( display ){
		super.draw( display, 0, 0);
		if ( this.xOffset != -100){
			this.startButton.draw( display, this.xOffset, 0);
			this.levelsButton.draw( display, this.xOffset, 0);
			this.multiplayerButton.draw(  display, this.xOffset, 0);
			this.aboutButton.draw( display, this.xOffset, 0);	
			display.drawStaticImage( this.logo, 33.5 + this.xOffset, 8, 32.5, 32.5);
			display.setFontSize(4.2);
			display.drawStaticText( 50 + this.xOffset, 25, "center", "Pixel Perfect Snake");
		} 
		if ( this.xOffset != 0){
			this.sideMenu.draw( display, this.xOffset, 0);
			this.backButton.draw( display, 100 + this.xOffset, 0);	
		}		
	}

}