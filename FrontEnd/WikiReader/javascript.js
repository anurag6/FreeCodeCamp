onload = function(){
	console.log("Linked!");
	var wikiSearchButton = document.getElementById("wikiSearchButton");
	//console.log("Wiki search button:"+wikiSearchButton);
	wikiSearchButton.onclick = function(){
		console.log("search string: "+wikiSearchButton.form.searchText.value);
		getDetailsForSearch(wikiSearchButton.form.searchText.value);
	};
	var searchForm = document.getElementById("searchForm");
	var searchInput = document.getElementById("searchInput");
	console.log(searchForm);
	searchForm.addEventListener("submit", function(event){
		//console.log(event);
		console.log("search string:"+searchInput.value);
		getDetailsForSearch(searchInput.value);
	
	}, false);
};

var SEARCH_PARAMS = { 				//Determines parameters of search query for given string. 
	wikiBase : "https://en.wikipedia.org/w/api.php",
	action : "query",
	format : "json",
	uselang : "user",
	list : "prefixsearch",
	pssearch : "" 			
};

var QUERY_PARAMS = {
	wikiBase : "https://en.wikipedia.org/w/api.php",
	action : "query",
	format : "json",
	prop : "info%7Cextracts",
	pageids: "",
	formatversion : "2",
	inprop : "url%7Cpreload",
	exsentences : "5",
	exlimit : "max",
	exintro : "1",
	explaintext : "1",
	excontinue : "0"
};

var getDetailsForSearch = function(searchString){
	var searchArray = {};
	searchAndBuildResultArray(searchString,searchArray);
}	

var searchAndBuildResultArray = function(searchString, searchArray){
	console.log("searchAndBuildResultArray| searchString:" + searchString);
	var searchStr = (searchString.split(" ")).join("+");
	console.log("searchAndBuildResultArray|"+searchStr);

	var url = SEARCH_PARAMS.wikiBase+"?action="+SEARCH_PARAMS.action+"&format="+SEARCH_PARAMS.format+"&uselang="+SEARCH_PARAMS.uselang+"&list="+SEARCH_PARAMS.list+"&pssearch="+searchStr+"&origin=*";
	//console.log("searchAndBuildResultArray|url:"+url);

	var xHttp = new XMLHttpRequest();
	if(!xHttp){
		console.log("searchAndBuildResultArray|Couldnt create XMLHttpRequest object.");
	}
	xHttp.onreadystatechange = function(){
		if (xHttp.readyState === 4) {
			if (xHttp.status === 200) {
				var jsonResp = JSON.parse(xHttp.responseText);
				populateSearchArray(jsonResp,searchArray);
			}
			else{
				console.log("searchAndBuildResultArray| Error:" + xHttp.status);	
			}

		}
	};
	xHttp.open("GET",url);
	xHttp.send();
};
var populateSearchArray = function(jsonElement,searchArray){
	if (jsonElement.query.prefixsearch) {
		jsonElement.query.prefixsearch.forEach(function(element){
			var searchObject = new Object();
			searchObject.pageid = element["pageid"];
			searchObject.title = element["title"]; 
			searchArray[element["pageid"]] = (searchObject);
		});
	}
	else{
		console.log("populateSearchArray|Improper json obj passed.");
	}
	//console.log("Search array:");
	console.log(searchArray);
	getDetailsOnSearchResults(searchArray);
}

var getDetailsOnSearchResults = function(searchArray){
	var pageidGroup = "";
	for(var prop in searchArray){
		//console.log(searchArray[prop]);
		pageidGroup += searchArray[prop].pageid+"%7C";
	}
	//console.log(pageidGroup);
	var url = QUERY_PARAMS.wikiBase + "?action=" + QUERY_PARAMS.action + "&format=" + QUERY_PARAMS.format + "&prop=" + QUERY_PARAMS.prop + "&pageids=" + pageidGroup + "&formatversion=" + QUERY_PARAMS.formatversion + "&inprop=" + QUERY_PARAMS.inprop + "&exsentences=" + QUERY_PARAMS.exsentences + "&exlimit=" + QUERY_PARAMS.exlimit + "&exintro=" + QUERY_PARAMS.exintro + "&explaintext=" + QUERY_PARAMS.explaintext + "&excontinue=" + QUERY_PARAMS.excontinue + "&origin=*";
	console.log(url);
	var xHttp = new XMLHttpRequest();
	if(!xHttp){
		console.log("getDetailsOnSearchResults|Couldnt create XMLHttpRequest object.");
	}
	xHttp.onreadystatechange = function(){
		if (xHttp.readyState === 4) {
			if (xHttp.status === 200) {
				var jsonResp = JSON.parse(xHttp.responseText);
				console.log(jsonResp);
				populateURLAndSnippet(jsonResp, searchArray);
			}
			else{
				console.log("getDetailsOnSearchResults| Error:" + xHttp.status);	
			}
		}
	};
	xHttp.open("GET",url);
	xHttp.send();
};

var populateURLAndSnippet = function(jsonObj, searchArray){
	if(jsonObj.hasOwnProperty("query")){
		if (jsonObj["query"].hasOwnProperty("pages")) {
			jsonObj.query.pages.forEach(function(element){
				if (element.hasOwnProperty("pageid") && element.hasOwnProperty("title") && element.hasOwnProperty("fullurl") && element.hasOwnProperty("extract")) {
					searchArray[element.pageid]["fullurl"] = element.fullurl;
					searchArray[element.pageid]["extract"] = element.extract;
				}
			});
			console.log(searchArray);
			populateSearchPanel(searchArray);
		}
		else{
			console.log("populateURLAndSnippet|Parsed JSON object isnt valid.");
		}
	}
	else{
		console.log("populateURLAndSnippet|Parsed JSON object isnt valid.");
	}	
		
};

var populateSearchPanel = function(searchArray){
	var container = document.getElementById("searchContainer");
	if(document.getElementById("searchList"))
		container.removeChild(document.getElementById("searchList"));
	var searchList = document.createElement("div");
	searchList.setAttribute("id","searchList");
	for(var prop in searchArray){
		var card = createSearchCard(searchArray[prop]);
		if(card){
			searchList.appendChild(card);
		}
	}
	container.appendChild(searchList);
}

var createSearchCard = function(searchElement){
	console.log("createSearchCard");
	console.log(searchElement);
	if(searchElement.hasOwnProperty("title") && searchElement.hasOwnProperty("fullurl") && searchElement.hasOwnProperty("extract")){
		var title = document.createElement("h2");
		title.appendChild(document.createTextNode(searchElement.title));
		var extract = document.createElement("p");
		extract.appendChild(document.createTextNode(searchElement.extract));
		var link = document.createElement("a");
		link.setAttribute("href",searchElement.fullurl);
		link.setAttribute("target", "_blank");
		var sp = document.createElement("span");
		sp.className += " cardLink";
		link.appendChild(sp);
		var card = document.createElement("div");
		card.className += " card col-xs-12";
		card.appendChild(title);
		card.appendChild(extract);
		card.appendChild(link);
		console.log("createSearchCard:");
		console.log(card);				
		return card;
	}
	else{
		console.log("createSearchCard|Search element is not recognised.");
		return null;
	}			
};
