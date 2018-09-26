var steps = 9000;
var currStep = 0;
var speed = 15;
var spd2 = 4;
var ctx,c;

var ampMax = 100;
var amp = 0;
var freq = 3; //in Hz
init();


function init(){

	c = document.getElementById("bg");
	ctx = c.getContext("2d");

	ctx.canvas.width  = document.documentElement.clientWidth;//window.innerWidth;
	ctx.canvas.height = document.documentElement.clientHeight;//window.innerHeight;

	draw();
}

function drawH(){
	ctx.beginPath();
	ctx.strokeStyle = "#FF0000";
	ctx.moveTo(0,ctx.canvas.height/2);
	ctx.lineTo(ctx.canvas.width,ctx.canvas.height/2)
	ctx.stroke();
}

var dirFlag = false;

function draw(){

	//spd2 = speed/(ctx.canvas.height);
	
	//console.log("amp:"+amp)
	//console.log("ampMAX:"+ampMax)
	if (amp>ampMax || amp <=0){
		dirFlag=!dirFlag;//spd2*=-1;
	}

	amp = !dirFlag?amp-spd2:amp+spd2;

	currStep=currStep+1*speed>steps?0:currStep+1*speed;
//	console.log(currStep)
	makeSine(2*ctx.canvas.height/3,currStep);
}


function draw2(){
	currStep=currStep+1*speed>amp?0:currStep+1*speed;
	speed=currStep==0?speed*-1:speed;
	makeAM(ctx.canvas.height/2,currStep);
}

//let steps be number of fragments used to define the sin wave
//speed is how many fragments we skip when we start anew
//start is the last offset in the xAxis
//freq is inversed
function makeSine(offset,shift){

	ctx.clearRect(0, 0, c.width, c.height);
	let fragment = ctx.canvas.width/(steps);
	ctx.beginPath();


	let shifts = (shift/steps)*ctx.canvas.width/freq;
	//console.log(shifts);
	for (let x = 0; x<ctx.canvas.width;x+=fragment){
		ctx.lineTo(x,sinF(((x+shifts)*Math.PI),amp,freq,offset))
	//	ctx.lineTo(x,sinF((x*Math.PI)+((shift/currStep)*ctx.canvas.width),amp,freq,offset));
	}
	ctx.stroke(); 

	ctx.lineTo(ctx.canvas.width,ctx.canvas.height);
	ctx.lineTo(0,ctx.canvas.height);
	ctx.lineTo(0,offset);
	ctx.fillStyle="#2eda6b";
	ctx.fill();
	
	window.requestAnimationFrame(draw);
}

function makeAM(offset,shift){

	speed=3;
	freq=1;
	let subfreq=20;
	let samp=currStep;
	//console.log(currStep)
	offset=ctx.canvas.height/2;


	ctx.clearRect(0,0,c.width, c.height);
	let fragment = ctx.canvas.width/steps;
	ctx.beginPath();

	ctx.strokeStyle="#FFFFFF"
	ctx.lineWidth=5;

	let t = 0;
	for (let x = 0; x<ctx.canvas.width; x+=fragment){
		let shifts = 0;
		ctx.lineTo(x,sinF(((x+shifts)*Math.PI),1,freq*subfreq,0)*sinF(((x+shifts)*Math.PI),samp,freq,0)+offset)
	}
	ctx.stroke();

	window.requestAnimationFrame(draw2);
}


function sinF(delta,amp,freq,offset){
	offset+=0;
	return offset+amp*Math.sin(delta*freq*2/(ctx.canvas.width));
}