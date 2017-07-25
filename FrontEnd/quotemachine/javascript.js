$(document).ready(function(){
	getRandomQuote();
	$("#getQuoteButton").on("click", getRandomQuote);
	//console.log("Hello World");
});
/*function getRandomQuote(){
	$.getJSON("http://api.forismatic.com/api/1.0/?method=getQuote&format=jsonp&key=&lang=en&jsonp=?",
		function(result){		
			console.log("Result:");
			console.log(result);
			showQuote(result);
		});		
}*/
/*function getRandomQuote(){
	var xHttp = new XMLHttpRequest();
	xHttp.open("GET","https://crossorigin.me/http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en",true);
	xHttp.onload = function(){
		if (xHttp.status >= 200 && xHttp.status < 400) {
			console.log("Success");
			var data = JSON.parse(xHttp.responseText);
			showQuote(data);
		}
		else{
			console.log("Something went wrong. But we did reach the server, so that's something.")
		}
	}
	xHttp.onerror = function(){
		console.log("Error!!");
	}
	xHttp.send();
}*/
function getRandomQuote(){
	var script = document.createElement("script");
	script.src = "http://api.forismatic.com/api/1.0/?method=getQuote&format=jsonp&lang=en&jsonp=processJSONPQuote";
	document.getElementsByTagName("head")[0].appendChild(script);
	script.parentNode.removeChild(script);
}
function processJSONPQuote(data){
	showQuote(data);
}
function showQuote(quoteObj){
	//console.log("quoteObj:");
	//console.log(quoteObj);
	//var transparency=0.5;
	var color=getRandomRGB();
	var solidColor = "rgba("+color[0]+","+color[1]+","+color[2]+",0.8)";
	var transparentColor = "rgba("+color[0]+","+color[1]+","+color[2]+",0.5)";
	console.log(transparentColor);
	var tweetLink = "https://twitter.com/intent/tweet?";
	$("#quoteText").fadeToggle(500,function(){
		document.getElementById("quoteText").innerHTML = quoteObj.quoteText;
		document.getElementById("quoteText").style.color = solidColor;
	});
	$("#quoteText").fadeToggle(500);
	$("#quoteAuthor").fadeToggle(500,function(){
		if(!quoteObj.quoteAuthor){
			quoteObj.quoteAuthor = "Unknown";
		}
		document.getElementById("quoteAuthor").innerHTML = quoteObj.quoteAuthor;
		document.getElementById("quoteAuthor").style.color = solidColor;
		document.getElementById("twitico").style.color = transparentColor;
		document.getElementById("comico").style.color = transparentColor;
		document.getElementsByClassName("blockquote")[0].style.borderColor = transparentColor;
	});	
	if(quoteObj.quoteAuthor){
		var hashtag = "&hashtags="+quoteObj.quoteAuthor.split(" ").join("");
		tweetLink += hashtag;
	}
	var tweetText=encodeURI('"'+quoteObj.quoteText+'" -'+quoteObj.quoteAuthor);	
	tweetText="&text="+tweetText;	
	tweetLink += tweetText;
	console.log(tweetLink);
	document.getElementById("tweetLink").setAttribute("href",tweetLink+tweetText);
	$("#quoteAuthor").fadeToggle(500);
}
function getRandomRGB(){
	var _rgb = [0,0,0];
	_rgb[0] = Math.floor(getRandomNum(0,111));
	_rgb[1] = Math.floor(getRandomNum(0,111));
	_rgb[2] = Math.floor(getRandomNum(0,111));
	//_rgb[getRandomNum(0,3)] = 0;
	return _rgb;
}
function getRandomNum(min,max){
	return Math.random() * (max-min) + min;
}
