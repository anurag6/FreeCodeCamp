onload = function(){
	initialise();
	var timerContainer = document.getElementById("timerContainer");
	timerContainer.style.cursor = "pointer";
	timerContainer.onclick = toggleTimer;
};

var defaultTimerCount = 1500000;			//A default value to assign the timer countdown to
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

var workDial = document.getElementById("workdial");
var restDial = document.getElementById("restdial");

function initialise(){	
	mode = Mode.WORK;
	state = Mode.PAUSED;
	TimerCount[Mode.WORK] = defaultTimerCount;
	TimerCount[Mode.REST] = defaultTimerCount/5;
	resetTimerCountTo(TimerCount[Mode.WORK]);
	workDial = document.getElementById("workdial");
	restDial = document.getElementById("restdial");
	updateDisplay();
};

function resetTimerCountTo(resetTime){
	timerCount = resetTime + 999;
};

function startTimer(){
	state = State.RUNNING;
	workDial.style.pointerEvents = "none";
	restDial.style.pointerEvents = "none";
	timerID = setInterval(handleTimeout, timeOutFrequency);
};

function pauseTimer(){
	state = State.PAUSED;	
	workDial.style.pointerEvents = "auto";
	restDial.style.pointerEvents = "auto";
	clearInterval(timerID);
};

function switchModes(){
	var switchTo = (mode == Mode.WORK) ? Mode.REST : Mode.WORK;
	resetTimerCountTo(TimerCount[switchTo]);
	mode = switchTo;
	//TODO: Update display characteristics
};

var handleTimeout = function(){
	//console.log("handleTimeout timerCount:"+timerCount);
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
	//console.log("Hours:"+hours+" minutes:"+minutes+" seconds:"+seconds);
	timerDisplayText.innerHTML = numFormat(minutes)+":"+numFormat(seconds);
	if (hours>0) {
		timerDisplayText.innerHTML = numFormat(hours)+":"+timerDisplayText.innerHTML;
	}
	var totalCount = 0;
	if(mode == Mode.WORK){
		totalCount = TimerCount[Mode.WORK];
	}else{
		totalCount = TimerCount[Mode.REST];
	}
	var percent = 100 - (timerCount-999)/totalCount * 100;
	//console.log(percent);
	if(percent > 100)
		percent = 100;
	if(percent < 0)
		percent = 0;
	$("#dispdialinput")
		.val(percent)
		.trigger('change');
};

function toggleTimer(){
	if(state == State.RUNNING){
		pauseTimer();
	}
	else{
		startTimer();
	}
};

function updateWorkTimer(v){
	v = Math.floor(v);
	TimerCount[Mode.WORK] = v * 60 * 1000;
	if (mode == Mode.WORK) {
		resetTimerCountTo(TimerCount[Mode.WORK]);
	}	
	updateDisplay();
}

function updateRestTimer(v){
	v = Math.floor(v);
	TimerCount[Mode.REST] = v * 60 * 1000;
	if (mode == Mode.REST) {
		resetTimerCountTo(TimerCount[Mode.REST]);
	}	
	updateDisplay();
}




