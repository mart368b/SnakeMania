var _SIZE_ = 3;
var _FODD_ = 4;
var defaultspeed = 1;
var dashspeed = 5;
var decreaseTimer = 0;
var gradient = false;
var foodMoving = false;
var dashtimer = 0;
var dash = false;
var dashCooldown = 30;

function gameover(){
	running = false
	dt = 1;
	document.getElementById("pop_up").hidden = false;
}

function reset (){
	snake = [new Head(5,5,_SIZE_,_SIZE_,1,0)];
	decreaseTimer = 30;
	dash = false;
	dashtimer = 0;
    last = new Date().getTime();
	dt = 0.0;
	running = true
	document.getElementById("pop_up").hidden = true;
	rndpos = GetRandomPosOnScreen();
	food.setposition(rndpos[0],rndpos[1]);
	score = _SIZE_*_SIZE_/100;
	MainLoop();
}

var lscore = 0;
var scoreboard;

function addscore(){
	if (lscore!=score){
		lscore = score;
		scoreboard.innerHTML = "Filled: "+ Math.round(score*100)/100 + "%";
	}
}
var canvas;
var lastmove = new Date().getTime();
var currentmove = 0;
var quedTurn = null
function startup(){
	canvas = document.getElementById('canvas');
	canvas.width = window.innerHeight*0.8;
	canvas.height = window.innerHeight*0.8;
	scoreboard = document.getElementById("score");
	window.addEventListener('resize',function() {
		display.resize();
	});
    display = new Display(window.innerHeight*0.8,window.innerWidth*0.8,canvas);
    snake = [new Head(5,5,_SIZE_,_SIZE_,1,0)];
    var keyn = {38:[0,-1],40:[0,1],37:[-1,0],39:[1,0],65:[-1,0],83:[0,1],68:[1,0],87:[0,-1]};
	window.onkeydown = function(e) {
		var code = e.keyCode;
		if (dash == false){
			keyvalue = keyn[code];
		}else{
			keyvalue = undefined;
		}
		if (typeof keyvalue !== "undefined"){
			currentmove = new Date().getTime();
			if (currentmove >= lastmove){
				lastmove = currentmove+170
				turnSnake(keyvalue,snake)
				quedTurn = null
			}
			else{
				quedTurn = keyvalue
			}
		}
		if (code == 32 && running == false){
			reset();
		}
	}
	decreaseTimer = 30;
    MainLoop();
}
function turnSnake(directions, snake) {
	if (directions[0] != snake[0].vx && directions[1]!= snake[0].vy){
		snake.push(snake[0].newtail());
		snake[0].recall(directions);
	}else if(dashCooldown <= 0){
		dashtimer = 3;
		dash = true;
		setSnakeSpeed(dashspeed);
	}
}
function setSnakeSpeed(speed){
	for (var i = snake.length - 1; i >= 0; i--) {
		snake[i].speed = speed;
	}
}
function GetRandomPosOnScreen (){
	return [Math.floor(Math.random() * (100-_SIZE_)) + 0  ,Math.floor(Math.random() * (100-_SIZE_)) + 0]
}

var last = new Date().getTime();
var dt = 0.0;
var score = _SIZE_*_SIZE_/100;
var running = true
var rndpos = GetRandomPosOnScreen();
var food = new Tail(rndpos[0],rndpos[1],_FODD_,_FODD_,0,0,_FODD_,false);
food.changecolor();

function MainLoop() {
	var now = new Date().getTime();
	var dMs = now - last;
	last = now;
	dt += dMs * 20 / 1000;
	var missingTicks = Math.floor(dt);
	dt -= missingTicks;

	for (var tick = 0; tick < missingTicks; tick++) {
		update();
	}
	render(dt);

	var t = new Date().getTime();
	if(now-last>1000){
		d = new Date();
		n = d.getTime()
		count = 0;
	}
	if (running){
		setTimeout(function(){ MainLoop(); }, Math.floor(1000 / 60));
	}
}

function placefood (){
	var rndpos = GetRandomPosOnScreen();
	food.setposition(rndpos[0],rndpos[1]);
	for (var i = 1; i<snake.length-1;i++){
		if(snake[i].collides(food)==true){
			placefood();
			break;
		}
	}
}

function update(){
	if (dashtimer > 0){
		dashtimer -= 1;
		if (decreaseTimer > 0){
			decreaseTimer -= dashspeed - 1;
		}
	}else{
		setSnakeSpeed(defaultspeed);
		dash = false;
	}
	if (dashCooldown > 0){
		dashCooldown--;
	}
	output = "";
	for (var i = snake.length - 1; i >= 0; i--) {
		output += snake[i].speed + " ";
	}
	console.log(output);
	currentmove = new Date().getTime();
	if ( quedTurn != null &&  currentmove >= lastmove){
		turnSnake(quedTurn,snake)
		quedTurn = null
		lastmove = currentmove + 170
	}
	var partscore = score;
	score += (snake[0].getdistancetraveled()*_SIZE_)/100;
	addscore();
	decreaseTimer -= defaultspeed;
	if (decreaseTimer<=0){
		if (snake[0].tracker){
			snake[0].stoptracker();
		}
		decreaseTimer = 0;
		if(snake.length>1){
			//LEFTOFF
			snake[1].decrease(snake[0].speed);
			if (snake[1].dead){
				offset += 5;
				snake.splice(1, 1);
				if(snake.length>1){
					snake[1].decrease(snake[0].speed);
				}
			}
			snake[0].translate();
		}
		else{
			snake[0].move(display,dt);
		}
	}
	else{
		snake[0].translate();
	}
	if (snake[0].x<-0.5 || snake[0].y<-0.5 || snake[0].y+snake[0].h>100.5 || snake[0].x+snake[0].w>100.5){
		gameover()
	}
	if (!dash){
	for (var i = snake.length-3; i>0;i--){
		if (snake[i].collides(snake[0])){
			gameover();
		}
	}
	if (food.collides(snake[0])){
		placefood();
		var collide = false;
		for (var i = 1; i < snake.length; i++) {
			snake[i].pause();
		}
		decreaseTimer += 30;
		defaultspeed += 0.01;
		dashspeed += 0.01;
		snake[0].tracker = true;
	}
	if (food.x<0 || food.y<0 || food.y+food.h>100 || food.x+food.w>100){
		food.switchDir()
	}
	}
	if (foodMoving){
		food.move()
	}
}
var offset = 100;
function render (dt){
	display.clear();
	food.draw(display,dt);
	var tempoffset = 0;
	var adition = 0
	var totaladition = 0;
	var g = gradient;
	offset+=3*snake[0].speed + 30;
	if(snake.length!=1){
		for (var i = 1; i < snake.length; i++) {
			adition = snake[i].draw(display,dt,offset,g)+5;
			 totaladition += adition;
			 offset += adition;
		}
		adition = snake[0].draw(display,dt,offset,g);
		offset -= totaladition;
	}else{
		snake[0].draw(display,dt,offset,g);		
	}

}
function setgradient(){
	gradient = !gradient;
	bg = document.getElementById('rainbow');
	bt = document.getElementById('rainbowflip');
	if (gradient){
		bg.style.background = "lime";
		bt.style.left = "6vh";
	}else{
		bg.style.background = "lightgrey";
		bt.style.left = "0vh";
	}
}

function setmoving(){
	foodMoving = !foodMoving;
	bg = document.getElementById('moving');
	bt = document.getElementById('movingflip');
	if (foodMoving){
		bg.style.background = "lime";
		bt.style.left = "6vh";
	}else{
		bg.style.background = "lightgrey";
		bt.style.left = "0vh";
	}
}