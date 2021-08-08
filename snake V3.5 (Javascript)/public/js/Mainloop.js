
var snakeDisplay, inputHandlers = [], snakes = [], food, endMenu, startTime, endTime, startMenu, startTip;
var showStartMenu = true, pause = false;

function startup(){
	// setup snakeDisplay
	snakeDisplay = new SnakeDisplay(document.getElementById('canvas'));	
	// setup input
	// arrow keys
	inputHandlers.push( new InputHandler( 38, 40, 37, 39) );
	//wasd
	inputHandlers.push( new InputHandler( 87, 83, 65, 68) );
	//  ijkl
	inputHandlers.push( new InputHandler( 73, 75, 74, 76 ) );
	// gvbn
	inputHandlers.push( new InputHandler( 71, 66, 86, 78) );
	
	window.onkeydown = function(e){
		if ( e.keyCode == 49 ){
			debuger = !debuger;
		} else if ( e.keyCode == 27 && showStartMenu == false && lose == false && reseting == false ){
			pause = !pause;
		} else if ( lose == true && !endMenu.hide){
			if ( e.keyCode == 32 ){
				reset();	
			}else if ( e.keyCode == 27 ){
				showStartMenu = true;
			}
			
		} else{
			for (var i = snakes.length - 1; i >= 0; i--) {
				inputHandler = inputHandlers[i]
				if ( inputHandler.lock ){
					inputHandler.keyPress(e)
					if ( inputHandler.requestedMovement != null ){
						inputHandler.lock = false;
						var snake = snakes[i];
						snake.vx = inputHandler.requestedMovement[0];
						snake.vy = inputHandler.requestedMovement[1];
						snake.dir = Directions.getDirection( snakes[i].vx, snakes[i].vy );
						snake.previousDirections = [snake.dir, snake.dir]
					}
				}else{
					inputHandler.keyPress(e);
				}
			}
		}
	};

	endMenu = new EndMenu();
	startMenu = new StartMenu();
	startTip = new StartTip();

	window.onmousedown = function(e){
		if ( e.button == 2 ){
			if ( showStartMenu && startMenu.xOffset == -100 ){
				startMenu.lerp.toggle();
			}else if ( lose){
				if ( endMenu.hide ){
					endMenu.press( 1, 1);	
				}else{
					endMenu.press( endMenu.x + 1, endMenu.y + 1);
				}
			}
		}else if ( e.button == 0 ){
			var pressX = (e.clientX - snakeDisplay.x)/ canvas.width
			var pressY = (e.clientY - snakeDisplay.y)/ canvas.width
			if ( showStartMenu ){
				startMenu.press(pressX * 100, pressY * 100 );
			}else if ( lose ){
				endMenu.press( pressX * 100, pressY * 100);
			}
		}
	};
	canvas.oncontextmenu = function (e) {
	    e.preventDefault();
	};
	//startGame();
    //gameOver(50, 50, 2);
	run( 0, 0, new Date().getTime() + outputRate*1000 )
}

function startGame(){
	snakeDisplay.xOffset = -100;
	snakes = [];
	setPlayers( startMenu.views[1].getActivePlayers() );
	resetFood();
	endMenu.reset();
	snakeDisplay.reset();
	lose = false;
	for (var i = snakes.length - 1; i >= 0; i--) {
		inputHandlers[i].lock = true;
		inputHandlers[i].requestedMovement = null;
	}
	startTip.reset();
	startTime = new Date();
}

function tick(){
	if ( showStartMenu ){
		startMenu.tick();
		return;
	}
	if (reseting){
		snakeDisplay.tick();
		if ( reseting = true && snakeDisplay.transit == false){
			startTip.reset();
		}
		reseting = snakeDisplay.transit;
		return;
	}
	if ( pause || isLocked()){
		return;
	}

	if ( startTip.lerp.isRunning()){
		startTip.tick();
	}
	if (!lose){
		var keyPressed = false;
		for (var i = snakes.length - 1; i >= 0; i--) {
			inputHandler = inputHandlers[i];
			if ( inputHandler.keyPressed ){
				keyPressed = true;
				inputHandler.keyPressed = false;
				let reqX = inputHandler.requestedMovement[0];
				let reqY = inputHandler.requestedMovement[1];
				snakes[i].setVelocity( reqX, reqY );
				socket.emit('player_input', i, reqX, reqY);
			}
		}
		for (var i = snakes.length - 1; i >= 0; i--) {
			var snake = snakes[i];
			if ( keyPressed ){
				snake.checkClosestCollision();
			}
			snake.tick();
		}
		for (var i = food.length - 1; i >= 0; i--) {
			var f = food[i]
			if ( f.moving ){
				f.tick();
			}
			f.checkCollision( snake );
			if ( f.used ){
				food.splice( i, 1 );
				spawnFood( !f.dangerous, !f.moving );
			}
		}
	}else{
		snakeDisplay.tick();
		if ( !snakeDisplay.transit ){
			endMenu.tick();
		}
	}
}

function setPlayers( playerInformation){
	var yOffset = 25;
	var xOffset = 25;
	if (playerInformation.length == 1){
		xOffset = 50;
	}
	if (playerInformation.length <= 2){
		yOffset = 50;
	}
	snakes = []
	for (var i = 0; i <  playerInformation.length ; i++) {
		var x = (i % 2);
		var y = Math.floor(i/2);
		snakes.push( new Snake( x * 50 + xOffset + y*0.001 , y * 50 + yOffset + x*0.001, snakeWidth, snakeSpeed, i, playerInformation[i] ));
	}
}

function isLocked(){
	for (var i = snakes.length - 1; i >= 0; i--) {
		if ( inputHandlers[i].lock ){
			return true;
		}
	}
	return false;
}

function draw (dt){
	snakeDisplay.wipe();

	if ( showStartMenu ){
		startMenu.draw( snakeDisplay );
		return;
	}
	for (var i = snakes.length - 1; i >= 0; i--) {
		snakes[i].draw( snakeDisplay );
	}
	for (var i = food.length - 1; i >= 0; i--) {
		food[i].draw( snakeDisplay );
	}

	if (startTip.isActive()){
		for (var i = snakes.length - 1; i >= 0; i--) {
			startTip.draw( snakeDisplay, snakes[i].ix, snakes[i].iy, inputHandlers[i].lock );
		}
	}

	if ( pause ){
		drawPause( snakeDisplay );
	}

	if (lose && snakeDisplay.transit == false){
		endMenu.draw( snakeDisplay, 0, 0 );
	}
}

var last = new Date().getTime();
var dt = 0.0;
var running = true;
var lose = false;
var reseting = false;

function run(ticks, renders, nextOutput) {
	var now = new Date().getTime();
	var dMs = now - last;
	last = now;
	dt += dMs * tps / 1000;
	var missingTicks = Math.floor(dt);
	dt -= missingTicks;

	for ( var t = 0; t < missingTicks; t++ ) {
		ticks++;
		tick();
	}
	renders++;
	draw(dt);

	if ( now >= nextOutput ){
		console.log("tps = " + (ticks/outputRate) + " fps = " + (renders/outputRate));
		ticks = 0;
		renders = 0;
		nextOutput = now + outputRate*1000;
	}
	var t = new Date().getTime();
	if( now - last > 1000 ){
		d = new Date();
		n = d.getTime()
		count = 0;
	}
	if ( running ){
		setTimeout(function(){ run( ticks, renders, nextOutput); }, Math.floor(1000 / tps));
	}
}

function gameOver( x, y, size, snake){
	snake.alive = false;
	for (var i = snakes.length - 1; i >= 0; i--) {
		if ( snakes[i].alive ){
			return;
		}
	}
	lose = true;
	snakeDisplay.focus( x, y, Math.min(deathZoom/size, 10));
	endTime = new Date();
	endMenu.setTimePassed( endTime - startTime );
	endMenu.calculatePoints( snakes );
}

function resetCamera(){
	snakeDisplay.focus( 50, 50, 1);
}

function spawnFood( editable, frozen ){
	var deviation = (Math.random()*foodWidthDeviation*2 - foodWidthDeviation)
	var width = deviation * foodWidth + foodWidth;
	var x = Math.random()*(100 - width);
	var y = Math.random()*(100 - width);
	var newFood = new Food( x , y, width, deviation * lengthIncrease + lengthIncrease, deviation * sizeIncrease + sizeIncrease, speedIncrease, editable? false: dangerousFood, frozen? false: movingFood)
	for (var i = snakes.length - 1; i >= 0; i--) {
		snake = snakes[i]
		if ( Math.abs(newFood.x - snake.getX()) <= newFood.width + snake.width && Math.abs(newFood.y - snake.getY()) <= newFood.width + snake.width){
			spawnFood();
			return;
		}
	}
	food.push( newFood );
}

function reset(){
	resetCamera();
	reseting = true;
	endMenu.reset();
	for (var i = snakes.length - 1; i >= 0; i--) {
		snakes[i].reset();
	}
	resetFood();
	lose = false;
	startTime = new Date();
	for (var i = snakes.length - 1; i >= 0; i--) {
		inputHandler = inputHandlers[i];
		inputHandler.lock = true;
		inputHandler.requestedMovement = null;
	}
}

function resetFood(){
	food = [];
	for (var i = 0; i < foodCount - 1; i++) {
		spawnFood( false, false );	
	}
	spawnFood( true, true );
}

function drawPause( snakeDisplay ){
	snakeDisplay.setOpacity( 0.2 );
	snakeDisplay.setFillColor("#AAAAAA");
	snakeDisplay.drawStaticFilledRect( 0, 0, 100, 100);
	snakeDisplay.setOpacity( 1 );

	snakeDisplay.drawStaticFilledRect( 45, 40, 4, 20);
	snakeDisplay.drawStaticFilledRect( 55, 40, 4, 20);
}