onload = function(){
	console.log("Linked!");
	document.getElementById("temperature").style.cursor = "pointer";
	document.getElementById("temperature").onclick = changeTempUnit;
	document.getElementById("locationTime").style.cursor = "pointer";
	document.getElementById("locationTime").onclick = loadLocationPopup;
	var coordinateButton = document.getElementById("coordinateButton");
	coordinateButton.onclick = function(){
		readCoordinates(coordinateButton.form.latitude.value, coordinateButton.form.longitude.value);
	};
	document.getElementById("shareLocationButton").onclick = function(){getLocation(); loadLocationPopup()};
	getLocation();	
	/*var cel = document.getElementById("celsiusbox");
	var fahr = document.getElementById("fahrenheitBox");
	cel.value = 0;
	fahr.value = 32;
	cel.oninput = function(){
		fahr.value = celsToFahr(cel.value)
	};
	cel.onpropertychange = cel.oninput;
	fahr.oninput = function(){
		cel.value = fahrToCels(fahr.value);
	};*/
};

var matchHeightOptions = {};

var iconMap = {
	"01d":"wi-day-sunny",
	"01n":"wi-night-clear",
	"02d": "wi-day-cloudy",
	"02n": "wi-night-alt-cloudy",
	"03d": "wi-cloud",
	"03n": "wi-cloud",
	"04d": "wi-cloudy",
	"04n": "wi-cloudy", 
	"09d": "wi-day-showers",
	"09n": "wi-night-alt-showers",
	"10d": "wi-day-rain",
	"10n": "wi-night-alt-rain",  
	"11d": "wi-day-thunderstorm",
	"11n": "wi-night-alt-thunderstorm",
	"13d": "wi-day-snow",
	"13n": "wi-night-alt-snow",
	"50d": "wi-day-fog",
	"50n": "wi-night-fog",
};

var LAST_COORDINATES={
	latitude: 51.5074,
	longitude: -0.1278
};

var WEATHER_API_KEY="86a213de5db42c231e4f1ad24d64c312";
var WEATHER_API_SITE="https://api.openweathermap.org/data/2.5/weather?";

var LAST_FETCHED_WEATHER = {};

var printLocation = function(){
	//console.log("printLocation");
	if(!navigator.geolocation){
		console.log("Browser doesnt support geolocation");
		return;
	}
	function success(position){
		console.log("("+position.coords.latitude+","+position.coords.longitude+")");
	}
	function error(error){
		console.log("Unable to retrieve location. Error code:"+error.code);
	}
	navigator.geolocation.getCurrentPosition(success,error);
};

var getLocation = function(){
	//console.log("getLocation");
	if (!navigator.geolocation) {
		console.log("Browser doesnt support geolocation. Using default("+LAST_COORDINATES.latitude+","+LAST_COORDINATES.longitude+").");
		updateDisplayCoordinates(LAST_COORDINATES);
	}
	function success(position){
		//console.log("Location retrieval succeeded");
		LAST_COORDINATES = position.coords;
		updateDisplayCoordinates(position.coords);
	}
	function error(error){
		console.log("Unable to retrieve location. Error code:"+error.code+". Using last known/default coords.");
		updateDisplayCoordinates(LAST_COORDINATES);
	}
	navigator.geolocation.getCurrentPosition(success,error,{maximumAge:Infinity, timeout:5000});
};

var updateDisplayCoordinates = function(coordinates){
	//console.log("updateDisplayCoordinates");
	getWeather(coordinates);
}

var getWeather = function(coordinates,time){
	//console.log("getWeather");
	if (!coordinates) {
		coordinates = LAST_COORDINATES;
	}
	var getURL = WEATHER_API_SITE+"&lat="+coordinates.latitude+"&lon="+coordinates.longitude+"&appid="+WEATHER_API_KEY;
	var xHttp = new XMLHttpRequest();
	if(!xHttp){
		console.log("Couldnt create XMLHttpRequest instance.");		
	}
	xHttp.onreadystatechange = function(){
		if(xHttp.readyState === 4){
			if(xHttp.status === 200){
				//On success
				console.log(JSON.parse(xHttp.responseText));
				updateWeather(JSON.parse(xHttp.responseText));
			}
			else
				console.log("Received error code:"+xHttp.status);
		}
	};
	xHttp.open("GET",getURL);
	xHttp.send();
};

var fahrToCels = function(fahrenHeit){
	var fah =  parseFloat(fahrenHeit);
	console.log("fahrToCels:" + fah);
	return ((fah - 32)/1.8).toFixed(1);
};

var celsToFahr = function(celsius){
	var cels = parseFloat(celsius);
	console.log("celsToFahr:" + cels);
	return ((cels*1.8) + 32).toFixed(1);
};

var updateWeather = function(weather){
	LAST_FETCHED_WEATHER.currentTemperature = (parseFloat(weather.main.temp) - 273.15).toFixed(1) + "";
	LAST_FETCHED_WEATHER.maxTemperature = (parseFloat(weather.main.temp_max) - 273.15).toFixed(1) + "";
	LAST_FETCHED_WEATHER.minTemperature = (parseFloat(weather.main.temp_min) - 273.15).toFixed(1) + "";
	LAST_FETCHED_WEATHER.description = weather.weather[0].main;
	LAST_FETCHED_WEATHER.icon = weather.weather[0].icon;
	LAST_FETCHED_WEATHER.location =  weather.name + "," + weather.sys.country;
	LAST_FETCHED_WEATHER.humidity = weather.main.humidity + "";
	LAST_FETCHED_WEATHER.pressure = weather.main.pressure + "";
	LAST_FETCHED_WEATHER.clouds = weather.clouds.all + "";
	LAST_FETCHED_WEATHER.wind = weather.wind.speed;
	var date = new Date(weather.dt*1000);
	console.log(date);
	LAST_FETCHED_WEATHER.timeUpdated = date.toLocaleString();
	//console.log(currentTemperature,minMaxTemperature,description,location,humidity,pressure,clouds,wind);
	if(typeof document.getElementById("temperature").unitCelsius == "undefined"){
		document.getElementById("temperature").unitCelsius = true;
	}
	if (document.getElementById("temperature").unitCelsius) {
		document.getElementById("currentTemp").innerHTML = "<p>" + LAST_FETCHED_WEATHER.currentTemperature+"\xB0C" + "</p>";
		document.getElementById("maxTemp").innerHTML = "<p>" +LAST_FETCHED_WEATHER.maxTemperature+"\xB0C" + "</p>";
		document.getElementById("minTemp").innerHTML = "<p>" +LAST_FETCHED_WEATHER.minTemperature+"\xB0C" + "</p>";
	}
	else{
		document.getElementById("currentTemp").innerHTML = "<p>" +celsToFahr(LAST_FETCHED_WEATHER.currentTemperature)+"\xB0F" + "</p>";
		document.getElementById("maxTemp").innerHTML ="<p>" + celsToFahr(LAST_FETCHED_WEATHER.maxTemperature)+"\xB0F" + "</p>";
		document.getElementById("minTemp").innerHTML ="<p>" + celsToFahr(LAST_FETCHED_WEATHER.minTemperature)+"\xB0F" + "</p>";
	}

	document.getElementById("weatherIcon").innerHTML = "<p><i class=\"wi " + iconMap[LAST_FETCHED_WEATHER.icon] + "\"></i>" + "</p>";
	document.getElementById("weatherText").innerHTML = "<p>" + LAST_FETCHED_WEATHER.description + "</p>";
	document.getElementById("wind").innerHTML = "<p><i class=\"wi wi-strong-wind\"></i>" + " " + LAST_FETCHED_WEATHER.wind + " m/s" + "</p>";
	document.getElementById("humidity").innerHTML = "<p><i class=\"wi wi-humidity\"></i>" + " " +LAST_FETCHED_WEATHER.humidity + "%" + "</p>";
	document.getElementById("pressure").innerHTML = "<p><i class=\"wi wi-barometer\"></i>" + " " + LAST_FETCHED_WEATHER.pressure+" hPa"+"</p>";
	document.getElementById("clouds").innerHTML = "<p><i class=\"wi wi-cloud\"></i>" + " " + LAST_FETCHED_WEATHER.clouds + "%"+ "</p>";
	document.getElementById("locationTime").innerHTML = "<p>" + LAST_FETCHED_WEATHER.location + "</p>";
	document.getElementById("localTime").innerHTML = "<p>Data last updated:" + LAST_FETCHED_WEATHER.timeUpdated + "</p>";
	$(".card").matchHeight();	
};

var changeTempUnit = function(){
	var tempConv = function(vars){ return vars};
	var unit = "";
	if (document.getElementById("temperature").unitCelsius) {
		document.getElementById("temperature").unitCelsius = false;
		tempConv = celsToFahr;
		unit = "F";
	}   	
	else{
		document.getElementById("temperature").unitCelsius = true;
		unit = "C";
	}
	$("#temperature").animate({opacity:0},function(){
		document.getElementById("currentTemp").innerHTML ="<p>" + tempConv(LAST_FETCHED_WEATHER.currentTemperature)+"\xB0"+unit + "</p>";
		document.getElementById("maxTemp").innerHTML ="<p>" + tempConv(LAST_FETCHED_WEATHER.maxTemperature)+"\xB0"+unit + "</p>";		
		document.getElementById("minTemp").innerHTML ="<p>" + tempConv(LAST_FETCHED_WEATHER.minTemperature)+"\xB0"+unit + "</p>";
		$('#temperature').animate({opacity:100});
	});
};

var loadLocationPopup = function() {
    var popup = document.getElementById("myPopup");
    if(!popup.classList.contains("show") && !popup.classList.contains("hide"))
    {
    	popup.classList.toggle("show")    
    }
    else
    {
    	popup.classList.toggle('show');
        popup.classList.toggle('hide');
    }
}

var readCoordinates = function(lat, long){
	var coords = {};
	coords.latitude = lat;
	coords.longitude = long;
	updateDisplayCoordinates(coords);
}