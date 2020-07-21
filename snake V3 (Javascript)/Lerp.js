class Lerp{
	constructor( initial, target, duration ){
		this.initial = initial;
		this.target = target;
		for (var i = this.initial.length - 1; i >= 0; i--) {
			this.target[i] =  this.target[i] - this.initial[i];
		}
		this.values = [];
		i = this.initial.length;
		while(i--){
			this.values.push( this.initial[2 - i] );	
		} 
		this.step = (1 / tps) / duration;
		this.duration = duration;
		this.t = 0;
		this.reverse = false;
	}

	tick(){
		if ( this.isRunning() ){
			this.t += this.reverse ? -this.step: this.step;
			if (this.reverse){
				if (this.t < 0)	{	
					this.t = 0;
				}
			}else{
				if (this.t > 1)	{
					this.t = 1;
				}	
			}
			this.calculateValues();
		}
	}

	toggle(){
		this.reverse = !this.reverse;
	}

	calculateValues(){
		for (var i = this.target.length - 1; i >= 0; i--) {
			this.values[i] = this.initial[i] + this.target[i] * this.t;				
		}
	}

	reset(){
		if ( this.reverse ){
			this.t = 1;
		}else{
			this.t = 0;
		}
		this.calculateValues();
	}

	isRunning(){
		if (this.reverse){
			return this.t > 0;
		}
		return this.t < 1;
	}
}