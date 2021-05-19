class Bounce {
	constructor(pos, angle) {
		this.pos = pos;
		this.dir = p5.Vector.fromAngle(angle);
	}

	show() {
		var isInt = this.isWall();
		if (isInt > -1){
			var pt = this.cast(Walls[isInt]);
			stroke(255);
			push();
			if (pt){
				line(this.pos.x, this.pos.y,pt.x, pt.y);
			}
			pop();
		} else {
			stroke(255);
			push();
			translate(this.pos.x, this.pos.y);
			line(0, 0, this.dir.x * MaxLength, this.dir.y * MaxLength);
			pop();
			translate(0,0);
		}
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
		var highest = {"index": -1, "dist": Number.POSITIVE_INFINITY};
		for (let ds of dists){
			if (ds.dist < 0){
				ds.dist = ds.dist*-1;
			}
			if (ds.dist < highest.dist){
				highest = ds;
			}
		}
		return highest.index;
	}

	getDistance(interr) {
		var a = this.pos.x;
		var b = this.pos.y;
		return Math.sqrt( Math.pow((a-interr.x), 2) + Math.pow((b-interr.y), 2) );
	}

	cast(wall) {
		const x1 = wall.pos1.x;
		const y1 = wall.pos1.y;
		const x2 = wall.pos2.x;
		const y2 = wall.pos2.y;
	
		const x3 = this.pos.x;
		const y3 = this.pos.y;
		const x4 = this.pos.x + this.dir.x;
		const y4 = this.pos.y + this.dir.y;
	
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