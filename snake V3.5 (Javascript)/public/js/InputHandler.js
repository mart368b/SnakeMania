class InputHandler{
	constructor( up, down, left, right ){
		this.keyMapper = {}
		this.keyMapper[up] = [0,-1]; // up
		this.keyMapper[down] = [0,1];  // down
		this.keyMapper[left] = [-1,0]; // left
		this.keyMapper[right] = [1,0];  // right
		this.requestedMovement = null;
		this.keyPressed = false;
		this.lock = true;
	}

	keyPress(e){
		if ( e.keyCode == debug_key){
			debuger = !debuger;
			return;
		}

		var movement = this.keyMapper[e.keyCode];
		if (typeof movement !== "undefined"){
			this.requestedMovement = movement;
			this.keyPressed = true;
		}
	}
}