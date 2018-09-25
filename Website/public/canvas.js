var steps = 9000;
var currStep = 0;
var speed = 200;
var ctx,c;

var amp = 150;
var freq = 1; //in Hz
init();


function init(){
	c = document.getElementById("bg");
	ctx = c.getContext("2d");

	ctx.canvas.width  = document.documentElement.clientWidth;//window.innerWidth;
	ctx.canvas.height = document.documentElement.clientHeight;//window.innerHeight;

	//ctx,steps,amp,freq,offset
	//makeSine(ctx.canvas.height/2,0);
	//start(ctx,9000,100,15,ctx.canvas.height/2);

	draw();
	//for (currStep = 0; currStep<steps; currStep++){
	//	window.requestAnimationFrame(draw);
	//}
}

function drawH(){
	ctx.beginPath();
	ctx.strokeStyle = "#FF0000";
	ctx.moveTo(0,ctx.canvas.height/2);
	ctx.lineTo(ctx.canvas.width,ctx.canvas.height/2)
	ctx.stroke();
}

function draw(){
	currStep=currStep+1*speed>steps?0:currStep+1*speed;
	//currStep+=1*5;
	//console.log(currStep)
	makeSine(ctx.canvas.height/2,currStep);
}


//let steps be number of fragments used to define the sin wave
//speed is how many fragments we skip when we start anew
//start is the last offset in the xAxis
//freq is inversed
function makeSine(offset,shift){

	ctx.clearRect(0, 0, c.width, c.height);
	//console.log("width: "+ctx.canvas.width)
	//fragment is length of unit of the step on the width
	let fragment = ctx.canvas.width/(steps);
	//console.log("steps, "+(ctx.canvas.width/fragment)+", fragment "+fragment)

;
	ctx.beginPath();
	//ctx.moveTo(0,300)
	let t= 0;
	for (let x = 0; x<ctx.canvas.width;x+=fragment){
		let shifts = (shift/steps)*ctx.canvas.width;
		ctx.lineTo(x,sinF(((x+shifts)*Math.PI),amp,freq,offset))
	//	ctx.lineTo(x,sinF((x*Math.PI)+((shift/currStep)*ctx.canvas.width),amp,freq,offset));
	}

	console.log(shift/steps);

	ctx.lineTo(ctx.canvas.width,ctx.canvas.height);
	ctx.lineTo(0,ctx.canvas.height);
	ctx.lineTo(0,offset);
	ctx.fillStyle="#2eda6b";
	ctx.fill();
	drawH();
	
	window.requestAnimationFrame(draw);
}

//return the y for matching x (delta) for a given sin function
function sinF(delta,amp,freq,offset){
	offset+=0;//+=(document.documentElement.clientHeight/2); //start at the half point of the document when dealing with offset
	return offset+amp*Math.sin(delta*freq*2/(ctx.canvas.width));
}