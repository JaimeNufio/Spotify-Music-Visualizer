var c = document.getElementById("bg"),ctx = document.getElementById("bg").getContext("2d");
ctx.canvas.width  = document.documentElement.clientWidth;//window.innerWidth;
ctx.canvas.height = document.documentElement.clientHeight;//window.innerHeight;

var Circles = [];

function Circle(s){
	this.steps = s; 
	this.rSteps = 1000;
	this.currStep = 0;
	this.speed = 0;
	this.amplitude = 100;
	this.amplitudeRest = 100;
	this.targetAmplitude = 100;
	this.radius = 250;
	this.freq =12;
	this.angleShift = 0;
	this.color = "#333";
}

Circle.prototype.makeSineCircle = function() {

	this.angleShift+=Math.PI*2/this.rSteps;
	//
	ctx.beginPath();
	ctx.lineWidth=15;
	ctx.strokeStyle = this.color;

	let mod = CurrentSong['amplitudeMod'];
	this.targetAmplitude = this.amplitudeRest*mod;
	this.amplitude += (this.targetAmplitude-this.amplitude)*.25;

	//	x = (R + a · sin(n·θ)) · cos(θ) + xc // y = (R + a · sin(n·θ)) · sin(θ) + yc

	let xcenter = ctx.canvas.width/2, ycenter = ctx.canvas.height/2;
	for( let theta = 0; theta<=(Math.PI*2)+1;theta+=Math.PI*2/this.steps){
		thetaDelta = theta+this.angleShift;
		ctx.lineTo( (this.radius + this.amplitude*Math.sin((thetaDelta*this.freq)))*Math.cos(theta) +xcenter ,
		 (this.radius + this.amplitude*Math.sin((thetaDelta)*this.freq))*Math.sin(theta) +ycenter )
	}
	ctx.stroke();
//	console.log('drew')

	//requestAnimationFrame(this.draw.bind(this));
}

var Circ = new Circle(10000);
var Circ1 = new Circle(10000);
var Circ2 = new Circle(10000);

//TODO Have modifiers based on stats as part of makeSineCircle method
Circ1.color="#BBB";
Circ2.color="#EEE";
Circ.rSteps*=-.5;
Circ1.rSteps*1.5;
Circ2.amplitudeRest=150;
Circ2.freq=50;
Circ1.freq=30;
Circ1.amplitudeRest=70
Circ.freq=99;


Circles.push(Circ2);

Circles.push(Circ);
Circles.push(Circ1);

console.log(Circles)

draw();

function draw(){
//	console.log("called draw")
	requestAnimationFrame(drawCircles);
}

function drawCircles(){
	ctx.clearRect(0, 0, c.width, c.height);
	for (let i = 0; i<Circles.length; i++){
		Circles[i].makeSineCircle();
	}
//	console.log(Circles)
//	console.log("drew all of them")
	requestAnimationFrame(draw);
}

//Circ2.makeSineCircle();
//Circ.makeSineCircle();
//Circ1.makeSineCircle();

/*
	Tracking:

	-- Variable
		Pitch/Mode	For a color?
		Timbre		 -X- Too complex
		Sound 		For a "bounce"

	-- Constant
		Tempo		Speed of wave
		Energy		Amplitude of wave
*/

/*

var steps = 9000;
var currStep = 0;
var speed = 15;
var spd2 = 4;
var ampMax = 100;
var amp = 0;
var freq = 3; //in Hz
//init();

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

*/