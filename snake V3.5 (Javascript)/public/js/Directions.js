class Directions{
	static get Left(){
		return 0
	}

	static get Up(){
		return 1
	}

	static get Right(){
		return 2
	}

	static get Down(){
		return 3
	}

	static getDirection( vx, vy ){
		// vx[-1] = 0, vy[-1] = 1, vx[1]=2, vy[1]=3
		switch( vx ){
			case -1:
				return this.Left;
			case 1:
				return this.Right;
		}
		switch( vy ){
			case -1:
				return this.Up;
			case 1:
				return this.Down;
		}
	}

	static rotateClockwise( dir ){
		var newDir = dir + 1;
		return newDir <= 3 ? newDir : 0;
	}

	static rotateCounterClockwise( dir ){
		var newDir = dir - 1;
		return newDir >= 0 ? newDir : 3;
	}

	static invert( dir ){
		var newDir = dir + 2;
		return newDir <= 3 ? newDir : newDir - 3;
	}

	static isVertical( dir ){
		return dir == this.Down || dir == this.Up;
	}

	static isHorizontal( dir ){
		return dir == this.Left || dir == this.Right;
	}
}