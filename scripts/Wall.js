class Wall {

	constructor(pos1, pos2) {
		this.pos1 = pos1;
		this.pos2 = pos2;
	}
  
	show() {
		stroke(0,255,255);
		push();
		line(this.pos1.x, this.pos1.y, this.pos2.x, this.pos2.y);
		pop();
	}
}