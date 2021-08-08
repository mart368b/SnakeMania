class SnakeDisplay{
	constructor(canvas){
		this.canvas = canvas;

		this.resize();
		window.addEventListener('resize',function() {
			snakeDisplay.resize();
		});

		this.ctx = this.canvas.getContext("2d");
		this.ctx.moveTo( 0, 0);
		this.xOffset = 0;
		this.yOffset = 0;
		this.focusX = 0;
		this.focusY = 0;
		this.transit = false;
	}

	resize(){
		var screenWidth = window.innerWidth;
		var screenHeight = window.innerHeight;
		this.sideLength = Math.min( screenWidth, screenHeight );
		this.canvas.width = this.sideLength - borderWidth;
		this.canvas.height = this.sideLength - borderWidth;
		this.scale = this.sideLength/100;
		this.zoom = 1 * this.scale;
		var boundary = this.canvas.getBoundingClientRect();
		this.x = boundary.x;
		this.y = boundary.y;
	}

	setColor( color ){
		this.ctx.strokeStyle = color;
	}

	setFillColor( color ){
		this.ctx.fillStyle = color;
	}

	setOpacity( alpha ){
		this.ctx.globalAlpha = alpha;
	}

	setFontSize( size ){
		this.ctx.font = size*this.scale + "px joystick";
	}

	drawLine( x0, y0, x1, y1 ){
		this.ctx.beginPath();
		this.ctx.moveTo( (x0 + this.xOffset) * this.zoom, (y0 + this.yOffset)  * this.zoom );
		this.ctx.lineTo( (x1 + this.xOffset) * this.zoom, (y1 + this.yOffset) * this.zoom );
		this.applyStroke();
	}

	drawRect( x0, y0, x1, y1 ){
		this.ctx.beginPath();
		this.ctx.rect( (x0 + this.xOffset) * this.zoom, (y0 + this.yOffset) * this.zoom, (x1 - x0) * this.zoom, (y1 - y0) * this.zoom );
		this.applyStroke();	
	}

	drawLight( x0, y0, x1, y1 ){
		var lx = ((x0 + (x1 - x0)/2) + this.xOffset) * this.zoom;
		var ly = ((y0 + (y1 - y0)/2) + this.yOffset) * this.zoom;
		var grd = this.ctx.createRadialGradient( lx, ly, (visionRange * 0.5) * this.zoom, lx, ly, visionRange * this.zoom);
		grd.addColorStop(0, "rgba(255,255,255,0)");
		grd.addColorStop(1, "rgb(240,240,240)");
		this.ctx.beginPath();
		this.ctx.fillStyle = grd;
		this.ctx.fillRect( (x0 + this.xOffset) * this.zoom, (y0 + this.yOffset) * this.zoom, (x1 - x0) * this.zoom, (y1 - y0) * this.zoom );
		this.applyStroke();
	}

	drawFilledRect( x0, y0, x1, y1 ){
		this.ctx.beginPath();
		this.ctx.fillRect( (x0 + this.xOffset) * this.zoom, (y0 + this.yOffset) * this.zoom, (x1 - x0) * this.zoom, (y1 - y0) * this.zoom );
		this.applyStroke();
	}

	drawStaticRect( x, y, width, height ){
		this.ctx.beginPath();
		this.ctx.rect( x * this.scale, y* this.scale, width * this.scale, height * this.scale );
		this.applyStroke();
	}

	drawStaticFilledRect( x, y, width, height ){
		this.ctx.beginPath();
		this.ctx.fillRect( x * this.scale, y* this.scale, width * this.scale, height * this.scale );
		this.applyStroke();
	}

	drawStaticImage( img, x, y, width, height){
		this.ctx.beginPath();
		this.ctx.drawImage( img, x * this.scale, y * this.scale, width * this.scale, height * this.scale);
		this.applyStroke();
	}

	drawStaticText( x, y, alignment, msg){
		this.ctx.textAlign = alignment;      
		this.ctx.fillText(msg, x * this.scale, y * this.scale); 
		this.applyStroke();
	}

	applyStroke(){
		this.ctx.stroke();
		this.setColor("#000000");
		this.setFillColor("#000000");
	}

	wipe(){
		this.ctx.clearRect(0, 0, this.sideLength, this.sideLength);
		this.applyStroke();
	}

	focus( x, y, zoom){
		this.transit = true;
		var centerx = 50 - x;
		var centery = 50 - y;
		this.lerp = new Lerp( [this.focusX, this.focusY, this.zoom/this.scale], [centerx , centery, zoom], cameraPanSpeed );
	}

	tick(){
		if ( this.lerp.isRunning() ){
			this.lerp.tick();
			this.focusX = this.lerp.values[0];
			this.focusY = this.lerp.values[1];
			var currentZoom = this.lerp.values[2];
			this.zoom = currentZoom * this.scale;
			this.xOffset = this.focusX -(currentZoom - 1) * (50 / currentZoom);
			this.yOffset = this.focusY - (currentZoom - 1) * (50 / currentZoom);	
		}else{
			this.transit = false;
		}
	}

	reset(){
		this.xOffset = 0;
		this.yOffset = 0;
		this.zoom = this.scale;
	}
}