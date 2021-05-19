function setup() {
	const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
	const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
	createCanvas(vw, vh);
	frameRate(30);
}

function draw () {
	clear();
	background(120);
	drawWalls();
	if (Walling) {
		renderLine()
	} else if (keyIsDown(82)) {
		Rays = new Array();
		drawRays();
	}
}

function toggleBalls() {
	if ($("#BID").is(':checked')){
		Balling = true;
	} else {
		Balling = false;
	}
}

function toggleWall(){
	if (Walling){
		Walling = false;
		$("#wallstat").html('');
	} else {
		fx = -1;
		fy = -1;
		bx = -1;
		by = -1;
		Walling = true;
		$("#wallstat").html("Click and drag to add a wall!");
	}
}

function mousePressed() {
	if (Walling) {
		fx = mouseX;
		fy = mouseY;
		document.body.style.cursor="crosshair";
	}
}

function renderLine(){
	if (fx > -1 && fy > -1){
		stroke(200);
		line(fx,fy,mouseX,mouseY);
	}
}
  
function mouseReleased() {
	if (Walling){
		bx = mouseX;
		by = mouseY;
		document.body.style.cursor="default";
		Walling = false;
		$("#wallstat").html('');
		var wall = new Wall({"x":fx,"y":fy},{"x":bx,"y":by});
		Walls.push(wall);
	}
}

function drawWalls() {
	for (let wall of Walls){
		wall.show();
	}
}

function drawRays(){
	var AIN = $("#AIN").val();
	if (AIN < 0) {
		Aint = parseInt(1);
	} else if (AIN > 360){
		Aint = parseInt(360);
	} else {
		Aint = parseInt(AIN);
	}
	var BIN = $("#BIN").val();
	var bc = 0;
	if (BIN < 0) {
		bc = parseInt(0);
	} else if (BIN > 10){
		bc = parseInt(10);
	} else {
		bc = parseInt(BIN);
	}
	var ca = Aint;
	var i = 0;
	while (i < 360/Aint){
		var ray = new Ray(new p5.Vector(mouseX,mouseY),radians(ca),true,255,false,null,bc);
		ray.show();
		Rays.push(ray);
		ca += Aint;
		i++;
	}
}

function deleteWall(){
	Walls.pop();
}

document.addEventListener('keypress', logKey);

function logKey(e) {
  if (e.key == "w"){
	toggleWall();
  }
}