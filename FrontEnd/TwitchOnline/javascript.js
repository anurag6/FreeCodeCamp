onload = function(){
	console.log("Linked!");
	buildStreamObjects(streamerList);
};

var streamerList = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "comster404"];
var streamsToBeProcessed = streamerList.length;
var getStreamerObj = function(userName){
	var userObj = {};
	userObj.name = userName;
	console.log(userObj.name);
	lookUpLiveStream(userObj);
};

var lookUpLiveStream = function(user){
	var streamURL = "https://wind-bow.gomix.me/twitch-api/streams/" + user.name;
	console.log("lookUpLiveStream:streamURL:"+streamURL);

	var xHttp = new XMLHttpRequest();
	if(!xHttp){
		console.log("lookUpLiveStream: Couldnt create XMLHttpRequest object!");
		return;
	}
	else
	{
		xHttp.onreadystatechange = function(){
			if (xHttp.readyState === 4) {
				if (xHttp.status === 200) {
					var jsonResp = JSON.parse(xHttp.responseText);
					console.log("streamObj:")
					//console.log(jsonResp);
					if (jsonResp.stream != null) {
						user.exists = true;
						user.live = true;
						processStreamInfo(user, jsonResp);
					}
					else{
						user.live = false;	
						checkIfUserExists(user);
					}
				}
				else{
					console.log("lookUpLiveStream: Request failed. Status:" + xHttp.status);
				}
			}
		}
		xHttp.open("GET",streamURL);
		xHttp.send();
	} 
};

var processStreamInfo = function(userObj, jsonResp){
	userObj.preview = jsonResp.stream.preview.medium;
	userObj.logo = jsonResp.stream.channel.logo;
	userObj.status = jsonResp.stream.channel.status;
	userObj.url = jsonResp.stream.channel.url;
	userObj.displayName = jsonResp.stream.channel.display_name;
	if(!userObj.status){
		userObj.status = " ";
	}
	console.log("processStreamInfo");
	//console.log(userObj);
	var streamCard = buildStreamCard(userObj);
	var streamBoard = document.getElementById("streamList");
	streamBoard.appendChild(streamCard);	if(streamsToBeProcessed <= 1){
		resizeCards();
	}

};

var checkIfUserExists = function(userObj){
	var channelURL = "https://wind-bow.gomix.me/twitch-api/channels/" + userObj.name;
	console.log("checkIfUserExists:url:"+channelURL);

	var xHttp = new XMLHttpRequest();
	if (!xHttp) {
		console.log("lookUpLiveStream: Couldnt create XMLHttpRequest object!");
		return;
	}
	else{
		xHttp.onreadystatechange = function(){
			if (xHttp.readyState === 4) {
				if (xHttp.status === 200) {
					var jsonResp = JSON.parse(xHttp.responseText);
					if(jsonResp.status == 404){
						userObj.exists = false;
						//console.log(userObj);
						processChannelInfo(userObj,jsonResp);
					}
					else{
						userObj.exists = true;
						processChannelInfo(userObj,jsonResp);
					}
				}
				else{
					console.log("checkIfUserExists: Request failed. Status:" + xHttp.status);
				}					
			}
		};
		xHttp.open("GET", channelURL);
		xHttp.send();
	}
};

var processChannelInfo = function(userObj,jsonResp){
	userObj.preview = jsonResp.video_banner;
	userObj.logo = jsonResp.logo;
	userObj.status = jsonResp.status;
	userObj.url = jsonResp.url;
	userObj.displayName = jsonResp.display_name;
	if(!userObj.logo){
		userObj.logo = "C:\\Users\\aporripireddi\\Downloads\\twitchLogo.png";
	}
	if(!userObj.preview){
		userObj.preview = "C:\\Users\\aporripireddi\\Downloads\\FileName.png"
	}
	if(!userObj.status){
		userObj.status = " ";
	}
	console.log("processChannelInfo:");
	//console.log(userObj);
	var streamCard = buildStreamCard(userObj);
	var streamBoard = document.getElementById("streamList");
	console.log(streamsToBeProcessed);
	streamBoard.appendChild(streamCard);
	if(streamsToBeProcessed <= 1){
		resizeCards();
	}
}

var buildStreamObjects = function(streamerArray){
	streamsToBeProcessed = streamerList.length;
	streamerArray.forEach(function(element){
		getStreamerObj(element);
	});
};

var buildStreamCard = function(streamObj){
	console.log("buildStreamCard:");
	console.log(streamObj);

	var card = document.createElement("div");
	card.className += " card col-xs-6 col-md-4 col-lg-3";

	if(streamObj.exists){
		var previewDiv = document.createElement("div");
		previewDiv.className += " previewDiv";

		var preview = document.createElement("img");
		preview.className += " preview";
		preview.setAttribute("src",streamObj.preview);
		previewDiv.appendChild(preview);

		var streamStatusDiv = document.createElement("div");
		streamStatusDiv.className += " streamStatusDiv";

		var imageLogo = document.createElement("img");
		imageLogo.className += " profileImage";
		imageLogo.setAttribute("src", streamObj.logo);

		var streamNameDiv = document.createElement("div");
		streamNameDiv.className += " streamNameDiv";

		var streamName = document.createElement("p");
		streamName.className += " streamName";
		streamName.appendChild(document.createTextNode(streamObj.name));

		var streamStatus = document.createElement("p");
		streamStatus.className += " streamStatus";
		if (streamObj.live) {
			streamStatus.appendChild(document.createTextNode("Live"));
			streamStatus.className += " live";
		}
		else{
			streamStatus.appendChild(document.createTextNode("Offline"));
			streamStatus.className += " offline";
		}

		streamNameDiv.appendChild(streamName);
		streamNameDiv.appendChild(streamStatus);

		streamStatusDiv.appendChild(imageLogo);
		streamStatusDiv.appendChild(streamNameDiv);

		var streamingDiv = document.createElement("div");
		streamingDiv.className += " streamingDiv";

		var streamDescription = document.createElement("p");
		if (streamObj.live) {
			streamDescription.appendChild(document.createTextNode("Streaming Now: "));
		}
		else{
			streamDescription.appendChild(document.createTextNode("Last Streamed: "));
		}
		streamDescription.appendChild(document.createTextNode(streamObj.status));
		streamingDiv.appendChild(streamDescription);

		var link = document.createElement("a");
		link.setAttribute("href",streamObj.url);
		link.setAttribute("target", "_blank");
		var sp = document.createElement("span");
		sp.className += " cardLink";
		link.appendChild(sp);

		card.appendChild(previewDiv);
		card.appendChild(streamStatusDiv);
		card.appendChild(streamingDiv);
		card.appendChild(link);
	}
	else{
		console.log("adding Placeholder");		
		var absentPlaceHolder = document.createElement("div");
		absentPlaceHolder.className += " absentPlaceHolder";
		var streamHeading = document.createElement("h2");
		streamHeading.appendChild(document.createTextNode(streamObj.name));
		var streamError = document.createElement("p");
		streamError.appendChild(document.createTextNode("Streamer not found"));
		absentPlaceHolder.appendChild(streamHeading);
		absentPlaceHolder.appendChild(streamError);
		card.appendChild(absentPlaceHolder);
	}		
	streamsToBeProcessed--;
	return card;
};


var resizeCards= function(){
	console.log("Resize called");
	$(".card").matchHeight({byRow:false});
	$(".previewDiv").matchHeight({byRow:false});
};