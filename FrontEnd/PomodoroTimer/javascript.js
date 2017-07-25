onload = function(){
	initialise();
	var timerContainer = document.getElementById("timerContainer");
	timerContainer.style.cursor = "pointer";
	timerContainer.onclick = toggleTimer;
};

var defaultTimerCount = 10000/*1500000*/;			//A default value to assign the timer countdown to
var timeOutFrequency = 50;				//time after which timeout for the countdown is called;

var TimerCount = {};

var timerCount;
var timerID;

var State = {
	PAUSED:0,
	RUNNING:1
};
var Mode = {
	WORK:0,
	REST:1
};
var mode;
var state;

function initialise(){	
	mode = Mode.WORK;
	state = Mode.PAUSED;
	TimerCount[Mode.WORK] = defaultTimerCount;
	TimerCount[Mode.REST] = defaultTimerCount/5;
	resetTimerCountTo(TimerCount[Mode.WORK]);
};

function resetTimerCountTo(resetTime){
	timerCount = resetTime + 999;
};

function startTimer(){
	state = State.RUNNING;
	timerID = setInterval(handleTimeout, timeOutFrequency);
};

function pauseTimer(){
	state = State.PAUSED;
	clearInterval(timerID);
};

function switchModes(){
	var switchTo = (mode == Mode.WORK) ? Mode.REST : Mode.WORK;
	resetTimerCountTo(TimerCount[switchTo]);
	mode = switchTo;
	//TODO: Update display characteristics
};

var handleTimeout = function(){
	console.log("handleTimeout timerCount:"+timerCount);
	timerCount = timerCount - timeOutFrequency;
	if(timerCount <= 0){
		pauseTimer();
		switchModes();
		startTimer();
	}	
	//update display
	updateDisplay();
};

function numFormat(num){
	if(num < 10){
		return "0"+num.toString();
	}
	else
		return num.toString();
};

function updateDisplay(){
	var timerDisplayText = document.getElementById("timerDisplayText");
	var hours = Math.floor(timerCount/3600000);
	var minutes = Math.floor((timerCount%3600000)/60000);
	var seconds = Math.floor((timerCount%60000)/1000);
	console.log("Hours:"+hours+" minutes:"+minutes+" seconds:"+seconds);
	timerDisplayText.innerHTML = numFormat(minutes)+":"+numFormat(seconds);
	if (hours>0) {
		timerDisplayText.innerHTML = numFormat(hours)+":"+timerDisplayText.innerHTML;
	}
};

function toggleTimer(){
	if(state == State.RUNNING){
		pauseTimer();
	}
	else{
		startTimer();
	}
};





