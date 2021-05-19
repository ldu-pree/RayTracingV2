class Ray {

	constructor(pos, angle, bounce,color,isbounce,refP,bounceCount) {
		this.pos = pos;
		this.isbounce = isbounce;
		this.bounceCount = parseInt(bounceCount)-1;
		this.dir = new p5.Vector();
		if (this.isbounce){
			this.dir.x = refP[0];
			this.dir.y = refP[1];
		} else {
			this.dir = p5.Vector.fromAngle(angle);
		}
		this.bounce = null;
		this.doesbounce = bounce;
		this.color = color
	}

	reflectedPoint(point,lp1,wp){
		var x2 = lp1.x;
		var y2 = lp1.y;
		var lp2 = this.getcoordOnPerp(lp1,wp)
		var x3 = lp2.x;
		var y3 = lp2.y;
		var dx  = (x3 - x2);
  		var dy  = (y3 - y2);
  		var a   = (dx * dx - dy * dy) / (dx * dx + dy*dy);
  		var b   = 2 * dx * dy / (dx*dx + dy*dy);
  		var xx2  = Math.round(a * (point.x - x2) + b*(point.y - y2) + x2); 
  		var yy2  = Math.round(b * (point.x - x2) - a*(point.y - y2) + y2);
		return [xx2,yy2];
	}

	getcoordOnPerp(corner,wp){
		var x1 = corner.x;
		var y1 = corner.y;
		var x2 = wp.x;
		var y2 = wp.y;
		var m = (y2-y1)/(x2-x1);
		var m2 = -1*(1/m);
		var c2 = -1 * (m2*x1-y1);
		var ry = m2*1+c2;
		return {"x":parseInt(1),"y":parseInt(ry)};
	}

	show() {
		var isInt = this.isWall();
		stroke(this.color);
		push();
		if (isInt > -1){
			this.lineHittingWall(isInt);
		} else {
			this.finalLine();
		}
		pop();
		translate(0,0);
	}

	lineHittingWall(isInt){
		var pt = this.cast(Walls[isInt]);
		if (pt){
			line(this.pos.x, this.pos.y,pt.x, pt.y);
			if (this.doesbounce && this.bounceCount >= 0){
				this.doBounce(Walls[isInt],pt);
			}
		}
	}

	finalLine(){
		if (this.pos){
			if (this.pos.x > -1 && this.pos.y > -1){
				if (this.isbounce){
					var recP = this.calculateExtendedPos(this.pos,this.dir);
					line(this.pos.x, this.pos.y, recP.x, recP.y);
				} else {
					translate(this.pos.x, this.pos.y);
					line(0, 0, this.dir.x * MaxLength, this.dir.y * MaxLength);
				}
			}
		}
	}

	calculateExtendedPos(pos,dir){
		let dx = dir.x-pos.x;
		let dy = dir.y-pos.y;
		let dist = Math.sqrt(dx*dx + dy*dy);
		let ux = dx / dist;
		let uy = dy / dist;
		let x2 = pos.x + ux * MaxLength;
		let y2 = pos.y + uy * MaxLength;
		return  {"x":parseInt(x2),"y":parseInt(y2)};
	}

	doBounce(inWall,corner){
		var ang = this.find_angle(this.pos,inWall.pos1,corner);
		var up = inWall.pos1;
		if (ang > 90){
			ang = this.find_angle(this.pos,inWall.pos2,corner);
			up = inWall.pos2;
		}
		var refPo = this.reflectedPoint(this.pos,corner,up);
		var crr
		if (this.color-50 > 0){
			crr = this.color-50;
		} else {
			crr = 0;
		}
		this.bounce = new Ray(corner,radians(ang),true,crr,true,refPo,this.bounceCount);
		this.bounce.show();
	}

	isWall() {
		var i = 0;
		var dists = new Array();
		for (let wall of Walls)
		{
			if (this.cast(wall)){
				var pt = this.cast(wall);
				if (Balling){
					noStroke();
					fill(255, 0, 0);
					ellipseMode(RADIUS);
					ellipse(pt.x,pt.y, 2);
				}
				dists.push({"index": i, "dist": this.getDistance(pt)})
			}
			i++;
		}
		var lowest = {"index": -1, "dist": Number.POSITIVE_INFINITY};
		for (let ds of dists){
			if (ds.dist < 0){
				ds.dist = ds.dist*-1;
			}
			if (ds.dist < lowest.dist && ds.dist > 2){
				lowest = ds;
			}
		}
		return lowest.index;
	}

	getDistance(interr) {
		var a = this.pos.x;
		var b = this.pos.y;
		return Math.sqrt( Math.pow((a-interr.x), 2) + Math.pow((b-interr.y), 2) );
	}
	
	find_angle(p0,p1,c) {
		var p0c = Math.sqrt(Math.pow(c.x-p0.x,2)+Math.pow(c.y-p0.y,2));  
		var p1c = Math.sqrt(Math.pow(c.x-p1.x,2)+Math.pow(c.y-p1.y,2));
		var p0p1 = Math.sqrt(Math.pow(p1.x-p0.x,2)+Math.pow(p1.y-p0.y,2));
		var angle = Math.acos((p1c*p1c+p0c*p0c-p0p1*p0p1)/(2*p1c*p0c));
		return angle * (180 / Math.PI);
	}

	cast(wall) {
		const x1 = wall.pos1.x;
		const y1 = wall.pos1.y;
		const x2 = wall.pos2.x;
		const y2 = wall.pos2.y;
	
		var x3 = 0;
		var y3 = 0;
		var x4 = 0;
		var y4 = 0;
		if (this.isbounce){
			x3 = this.pos.x;
			y3 = this.pos.y;
			x4 = this.dir.x;
			y4 = this.dir.y;
		} else {
			x3 = this.pos.x;
			y3 = this.pos.y;
			x4 = this.pos.x + this.dir.x;
			y4 = this.pos.y + this.dir.y;
		}
	
		const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
		if (den == 0) {
			return;
		}
	
		const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
		const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
		if (t > 0 && t < 1 && u > 0) {
			const pt = createVector();
			pt.x = x1 + t * (x2 - x1);
			pt.y = y1 + t * (y2 - y1);
			return pt;
		} else {
			return;
		}
	}
}