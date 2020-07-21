class Display {
	constructor(h,w,c){
		this.scale = 1;
		this.height = h;
		this.width = h;
		this.canvas  = c;
		this.ctx = this.canvas.getContext("2d");
		this.scale = h/100;
	}
	resize(){
		var h = window.innerHeight*0.8
		this.canvas.width = h;
		this.canvas.height = h;
		this.width = h;
		this.height = h;
		this.scale = h/100;
	}
	getcontext(){
		return this.ctx;
	}
	getscale(){
		return this.scale;
	}
	clear(){
		this.ctx.clearRect(0, 0, this.width, this.height);
	}
}
class Head {
	constructor(x,y,w,h,vx,vy){
		this.x = x;
		this.y = y;
		this.ox = x;
		this.oy = y;
		this.w = w;
		this.h = h;
		this.ow = w;
		this.oh = h;
		this.lx = x
		this.ly = y;
		this.lw = w
		this.lh = h;
		this.vx = vx;
		this.vy = vy;
		this.speed = 1;
		this.dm = 0;
		this.tracker = true;
		this.c = "black"
		this.gradientcolor = [[255,0,0],[255,127,0],[255,255,0],[0,255,0],[0,0,255],[75,0,130],[139,0,255]];
	}
	getrgb (offset){
		var currentcolor = (offset/500)%this.gradientcolor.length;
		var rem = currentcolor-Math.floor(currentcolor);
		var irem = 1-rem;
		currentcolor = Math.floor(currentcolor);
		var nextcolor = currentcolor+1;
		if (nextcolor==this.gradientcolor.length){
			nextcolor = 0;
		}
		var c = "rgb(";
		var nc = 0;
		for (var i = 0; i <this.gradientcolor[currentcolor].length; i++) {
			nc = Math.ceil((this.gradientcolor[currentcolor][i] * irem) + (this.gradientcolor[nextcolor][i] * rem));
			c += nc + ","
		}
		c = c.slice(0,c.length-1) + ")";
		return c;
	}
	draw (display,dt,offset,g){
		var s = display.getscale();
		display.getcontext().fillStyle=this.c;
		var xp = Math.floor((this.lx + (this.x - this.lx)*dt)*s);
		var yp = Math.floor((this.ly + (this.y - this.ly)*dt)*s);
		var ww = Math.floor((this.lw + (this.w - this.lw)*dt)*s);
		var hh = Math.floor((this.lh + (this.h - this.lh)*dt)*s);
		if (this.vx !=0){
			var parts = Math.ceil(ww/1);
			//nx-= xp/5;
		}else{
			var parts = Math.ceil(hh/1);
		}
		if (g){
			var nx = 0;
			var ny = 0;
			var nw = 0;
			var nh = 0;
			for (var i = 0 ; i<parts-1 ; i++){
				if (this.vx !=0){
					if (this.vx <0){
						nx = xp + 1*((parts-1)-i) + ww-1*parts;	
					}else{
						nx = xp + 1*i;	
					}
					ny = yp;
					nw = 1;
					nh = hh;
				}
				if (this.vy !=0){
					nx = xp;
					if (this.vy <0){
						ny = yp + 1*((parts-1)-i) +hh-1*parts;	
					}else{
						ny = yp + 1*i;	
					}
					nw = ww;
					nh = 1;
				}
				display.getcontext().fillStyle=this.getrgb(offset+i);
				display.getcontext().fillRect(nx,ny,nw,nh);
			}
			if (this.vx !=0){
				if (this.vx <0){
						nx = xp;	
					}else{
						nx = xp + 1*(parts-1);	
					}
					ny = yp;
					nw = ww-1*(parts-1);
					nh = hh;
				}
				if (this.vy !=0){
					nx = xp;
					if (this.vy <0){
						ny = yp;	
					}else{
						ny = yp + 1*i;	
					}
					nw = ww;
					nh = hh - 1*(parts-1);
				}
			display.getcontext().fillStyle=this.getrgb(offset+i);
			display.getcontext().fillRect(nx,ny,nw,nh);
		}else{
			display.getcontext().fillStyle=this.c;
			display.getcontext().fillRect(xp,yp,ww,hh);
		}
		return parts-1;
	}
	translate(){
		if (this.vx>0){
			this.lw = this.w;
			this.w += this.speed;
			this.ox += this.speed;
		}
		if(this.vx<0){
			this.lw = this.w;
			this.w += this.speed;
			this.lx = this.x;
			this.x -= this.speed;
			this.ox -= this.speed;
		}
		if (this.vy>0){
			this.lh = this.h;
			this.h += this.speed;
			this.oy += this.speed;
		}
		if(this.vy<0){
			this.lh = this.h;
			this.h += this.speed;
			this.ly = this.y;
			this.y -= this.speed;
			this.oy -= this.speed;
		}
		if (this.tracker){
			this.dm += this.speed;
		}
	}
	move(){
		this.lw = this.w;
		this.lh = this.h;
		if (this.vx>0){
			this.lx = this.x;
			this.x += this.speed;
			this.ox += this.speed;
		}
		if(this.vx<0){
			this.lx = this.x;
			this.x -= this.speed;
			this.ox -= this.speed;
		}
		if (this.vy>0){
			this.ly = this.y;
			this.y += this.speed;
			this.oy += this.speed;
		}
		if(this.vy<0){
			this.ly = this.y;
			this.y -= this.speed;
			this.oy -= this.speed;
		}
		if (this.tracker){
			this.dm += this.speed;
		}
	}
	stoptracker(){
		this.tracker = false;
	}
	getdistancetraveled(){
		var temp = this.dm+0.00;
		this.dm = 0;
		return temp;
	}
	newtail(){
		if (this.vx>0){
			this.w -= 2;
		}
		if (this.vx<0){
			this.x += 2;
			this.w -= 2;
		}
		if (this.vy < 0){
			this.y += 2;
			this.h -=2
		}
		if (this.vy > 0){
			this.h -= 2;
		}
		return new Tail(this.x,this.y,this.w,this.h,this.vx,this.vy,this.ow);
	}
	recall(nv){
		this.vx = nv[0];
		this.vy = nv[1];
		this.x = this.ox;
		this.y = this.oy;
		this.w = this.ow;
		this.h = this.oh;
		this.lx = this.ox;
		this.ly = this.oy;
		this.lw = this.ow;
		this.lh = this.oh;
	}
	setposition (x,y,w,h){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.lx = x;
		this.ly = y;
		this.lw = w;
		this.lh = h;
		this.ox = x;
		this.oy = y;
	}
}
class Tail {
	constructor(x,y,w,h,vx,vy,size){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.lx = x
		this.ly = y;
		this.lw = w;
		this.lh = h;
		this.vx = vx;
		this.vy = vy;
		this.ow = size;
		this.oh = size;
		this.speed = 1;
		this.dead = false;
		this.c = "black"
		this.gradientcolor = [[255,0,0],[255,127,0],[255,255,0],[0,255,0],[0,0,255],[75,0,130],[139,0,255]];
		this.dir = 0
	}
	changecolor(spd){
		this.c = "red";
	}
	getrgb (offset){
		var currentcolor = (offset/500)%this.gradientcolor.length;
		var rem = currentcolor-Math.floor(currentcolor);
		var irem = 1-rem;
		currentcolor = Math.floor(currentcolor);
		var nextcolor = currentcolor+1;
		if (nextcolor==this.gradientcolor.length){
			nextcolor = 0;
		}
		var c = "rgb(";
		var nc = 0;
		for (var i = 0; i <this.gradientcolor[currentcolor].length; i++) {
			nc = Math.ceil((this.gradientcolor[currentcolor][i] * irem) + (this.gradientcolor[nextcolor][i] * rem));
			c += nc + ","
		}
		c = c.slice(0,c.length-1) + ")";
		return c;
	}
	draw (display,dt,offset,g){
		var s = display.getscale();
		display.getcontext().fillStyle=this.c;
		var xp = Math.floor((this.lx + (this.x - this.lx)*dt)*s);
		var yp = Math.floor((this.ly + (this.y - this.ly)*dt)*s);
		var ww = Math.floor((this.lw + (this.w - this.lw)*dt)*s);
		var hh = Math.floor((this.lh + (this.h - this.lh)*dt)*s);
		if (this.vx !=0){
			var parts = Math.ceil(ww/1);
			//nx-= xp/5;
		}else{
			var parts = Math.ceil(hh/1);
		}
		if (g){
			var nx = 0;
			var ny = 0;
			var nw = 0;
			var nh = 0;
			for (var i = 0 ; i<parts-1 ; i++){
				if (this.vx !=0){
					if (this.vx <0){
						nx = xp + 1*((parts-1)-i) + ww-1*parts;	
					}else{
						nx = xp + 1*i;	
					}
					ny = yp;
					nw = 1;
					nh = hh;
				}
				if (this.vy !=0){
					nx = xp;
					if (this.vy <0){
						ny = yp + 1*((parts-1)-i) +hh-1*parts;	
					}else{
						ny = yp + 1*i;	
					}
					nw = ww;
					nh = 1;
				}
				display.getcontext().fillStyle=this.getrgb(offset+i);
				display.getcontext().fillRect(nx,ny,nw,nh);
			}
			if (this.vx !=0){
				if (this.vx <0){
						nx = xp;	
					}else{
						nx = xp + 1*(parts-1);	
					}
					ny = yp;
					nw = ww-1*(parts-1);
					nh = hh;
				}
				if (this.vy !=0){
					nx = xp;
					if (this.vy <0){
						ny = yp;	
					}else{
						ny = yp + 1*i;	
					}
					nw = ww;
					nh = hh - 1*(parts-1);
				}
			display.getcontext().fillStyle=this.getrgb(offset+i);
			display.getcontext().fillRect(nx,ny,nw,nh);
		}else{
			display.getcontext().fillStyle=this.c;
			display.getcontext().fillRect(xp,yp,ww,hh);
		}
		return parts-1;
	}
	decrease(s){
		if (this.w < this.ow-2 && this.vx !=0){
			this.kill();
			return (this.ow - 2) - this.w;
		}
		if(this.h < this.oh-2 && this.vy !=0){
			this.kill();
			return (this.oh - 2) - this.h;
		}
		if (this.vx<0){
			this.lw = this.w;
			this.w -= s;
		}
		if(this.vx>0){
			this.lw = this.w;
			this.w -= s;
			this.lx = this.x;
			this.x += s;
		}
		if (this.vy<0){
			this.lh = this.h;
			this.h -= s;
		}
		if(this.vy>0){
			this.ly = this.y;
			this.y += s;
			this.lh = this.h;
			this.h -= s;
		}
		return 0;
	}
	move(){
		this.lw = this.w;
		this.lh = this.h;
		this.lx = this.x;
		this.ly = this.y;
		if (this.dir == 0){
			this.x += this.speed
			this.y += this.speed
		}
		if (this.dir == 1){
			this.x -= this.speed
			this.y += this.speed
		}
		if (this.dir == 2){
			this.x -= this.speed
			this.y -= this.speed
		}
		if (this.dir == 3){
			this.x += this.speed
			this.y -= this.speed
		}
	}
	switchDir(){
		var outside = true
		var x = 0
		var y = 0
		var tries = 0
		var invertDir = 2+this.dir
		if (invertDir >3){
			var newDir = invertDir-4
			invertDir = newDir
		}
		while (outside){
			++tries
			if (++this.dir == 4){
				this.dir = 0;
			}
			if (this.dir == 0){
				x = this.speed*2
				y = this.speed*2
			}
			if (this.dir == 1){
				x = -this.speed*2
				y = this.speed*2
			}
			if (this.dir == 2){
				x = -this.speed*2
				y = -this.speed*2
			}
			if (this.dir == 3){
				x = this.speed*2
				y = -this.speed*2
			}
			if (this.x + x>0 && this.y + y>0 && this.y+this.h + y<100 && this.x+this.w + x<100 && this.dir != invertDir){
				outside = false
			}
			if (tries > 3){
				outside = false
				this.dir = invertDir
			}
		}
	}

	kill() {
		this.dead = true;
	}
	reset(){
		this.lx = this.x
		this.ly = this.y;
		this.lw = this.w;
		this.lh = this.h;
	}
	setposition (x,y){
		this.x = x;
		this.y = y;
		this.lx = x;
		this.ly = y;
		this.ox = x;
		this.oy = y;
		this.dir = Math.floor(Math.random() * (3 - 1)) 
	}
	pause(){
		this.lx = this.x;
		this.ly = this.y;
		this.lw = this.w;
		this.lh = this.h;
	}
	collides (head){
		var left = [head.lx<this.x+this.w,head.lx>this.x];
		var right = [head.lx+head.lw>this.x,head.lx+head.lw<this.x+this.w];
		var top = [head.ly>this.y,head.ly<this.y+this.h];
		var bottom = [head.ly+head.lh>this.y,head.ly+head.lh<this.y+this.h];
		var xcount = 0;
		var ycount = 0;
		for (var i = 0 ; i<2;i++ ){
			if (left[i]){
				xcount++;
			}
			if (right[i]){
				xcount++;
			}
			if (top[i]){
				ycount++;
			}	
			if (bottom[i]){
				ycount++;
			}
		}
		if (xcount >=3 && ycount>=3){
			return true;
			this.c = "red"
		}
		return false;
	}
}