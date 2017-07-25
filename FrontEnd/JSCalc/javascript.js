var state = {
	INIT: 0,
	EXP: 1,
	ANS:2,
	ERR: 3
};

var calcState = state.INIT;
var calcExpression = "0";
var bracketCount = 0;
var allowOnlyOperand = false;
var allowDecimal = true;
var degreePower = 0;
var answer = "0";
var lastExpression = "";
var previousDisplay = "";
var displayText;
var miniDisplay;

var initialise = function(){
	console.log("Initialised!");
	calcState = state.INIT;
	calcExpression = "0";
	bracketCount = 0;
	allowOnlyOperand = false;
	allowDecimal = true;
	degreePower = 0;
};

onload = function(){	
	initialise();
	displayText = document.getElementById("displayText");
	miniDisplay = document.getElementById("prevDisplay");
};

function handleInput(str){
	if(str == "clear"){
		initialise();
		updateDisplay(generateDisplay(calcExpression));
		return;
	}
	if(calcState == state.INIT){
		if((isOperator(str) || isUnaryOperator(str)) && str!="-" || str=="."){
			calcExpression+=str;
			calcState = state.EXP;
		}
		else if(str=="bsp"){
			return;
		}
		else if(str=="(" || str == ")"){
			if(str == "("){
				bracketCount++;
				calcExpression = calcExpression.slice(0,-1);
				calcExpression+=str;
				calcState = state.EXP;
			}
		}
		else if(isBracketBoundOperator(str) && str!="^"){
			calcExpression = calcExpression.slice(0,-1);
			calcExpression+=str+"(";
			calcState = state.EXP;
			bracketCount++;			
		}
		else if(isOperand(str)){
			calcExpression = calcExpression.slice(0,-1);
			calcState = state.EXP;
			calcExpression += str;
		}
	}
	else if(calcState == state.EXP){
		var lastChar = calcExpression[calcExpression.length-1];
		if(str == "-" && !allowOnlyOperand){
			if((isOperand(lastChar) || lastChar == "*" || lastChar == "/" || lastChar == ")" || lastChar=="(") 
				|| (isUnaryOperator(lastChar)&&lastChar!="-")){
				calcExpression += str;				
			}
			else if(isOperator(lastChar) && lastChar!="-"){
				calcExpression = calcExpression.slice(0,-1);
				calcExpression += str;
			}
		}		
		else if(isOperator(str) && !allowOnlyOperand){
			if(isOperand(lastChar) || lastChar == ")" || (isUnaryOperator(lastChar)&&lastChar!="-")){
				calcExpression+=str;
			}
			else if(calcExpression.length > 1 && isOperator(lastChar) && !isOperator(calcExpression[calcExpression.length-2])){
				calcExpression = calcExpression.slice(0,-1);
				calcExpression += str;
			}
			if(isBracketBoundOperator(str)){
				calcExpression += "(";
				bracketCount++;
			}
		}
		else if(isOperand(str)){
			if(lastChar == ")" || (isUnaryOperator(lastChar) && lastChar!="-")){
				calcExpression += "*"
			}
			calcExpression += str;
			if(allowOnlyOperand){
				allowOnlyOperand = false;
			}
		}
		else if(isBracketBoundOperator(str) && str!="^" && !allowOnlyOperand){
			if(lastChar=="-" && calcExpression.length==1){
				calcExpression += "1*"+str+"(";
				bracketCount++;
			}
			else if(isOperand(lastChar)|| lastChar == ")" || (isUnaryOperator(lastChar) && lastChar!="-")){
				calcExpression += "*"+str+"(";
				bracketCount++;
			}
			else if(isOperator(lastChar) || lastChar == "("){
				calcExpression += str+"(";
				bracketCount++;
			}
		}
		else if(isUnaryOperator(str) && !allowOnlyOperand){
			if(isOperand(lastChar)|| lastChar == ")" || (isUnaryOperator(lastChar)&&lastChar!="-")){
				calcExpression += str;
			}
			else if(calcExpression.length && isOperator(lastChar) && !isOperator(calcExpression[calcExpression.length-2])){
				calcExpression = calcExpression.slice(0,-1);
				calcExpression += str;
			}
		} //"-" isnt included
		else if((str == ")" || str=="(") && !allowOnlyOperand){
			if(str == "("){
				if(lastChar=="-" && calcExpression.length==1){
					calcExpression += "1*(";
					bracketCount++;
				}
				else if(isOperand(lastChar)|| lastChar == ")" || (isUnaryOperator(lastChar)&&lastChar!="-")){
					calcExpression += "*(";
					bracketCount++;
				}
				else if(isOperator(lastChar) || lastChar == "("){
					calcExpression += "(";
					bracketCount++;
				}
			}
			else if(str == ")" && bracketCount>0){
				if(isOperand(lastChar) || lastChar == ")" || (isUnaryOperator(lastChar)&&lastChar!="-")){
					calcExpression += ")";
					bracketCount--;
				}
			}
		}	
		else if(str == "." && !allowOnlyOperand && allowDecimal){
			//console.log("lastChar:"+lastChar);
			if(lastChar=="(" || isOperator(lastChar)){
				calcExpression += "0.";
				allowOnlyOperand = true;
			}
			else if(lastChar==")"){
				calcExpression+="*0.";
				allowOnlyOperand = true;
			}
			else if(isOperand(lastChar)){
				calcExpression += ".";
				allowOnlyOperand = true;
			}
		}		
		else if(str == "bsp"){
			if(calcExpression.length == 1){
				calcExpression = "0";
				initialise();
			}
			else{
				if(lastChar == "."){
					allowOnlyOperand = false;
				}
				else if(lastChar == "("){
					bracketCount--;
					if (isBracketBoundOperator(calcExpression[calcExpression.length-2])){
						calcExpression = calcExpression.slice(0,-1);	
					}
				}
				else if(lastChar == ")"){
					bracketCount++;
				}
				calcExpression = calcExpression.slice(0,-1);
			}
		}
		else if(str=="="){
			lastExpression = calcExpression;						
			if(isOperator(lastChar)){
				//GOTO ERROR state
				calcState = state.ERR;
				//TODO: Display error
				calcExpression = "ERROR";
				//TODO: Change CE button to AC  

				updateDisplay(calcExpression);
				return;
			}
			if(bracketCount > 0){
				while(bracketCount>0){
					calcExpression+=")";
					bracketCount--;
				}
			}
			//calculate
			lastExpression = calcExpression;
			var soln = evaluateInput(calcExpression); //TODO: Assign calc Expression to this?
			//alter state
			if(!isValidSoln(soln)){
				//GOTO ERROR state
				calcState = state.ERR;
				//TODO: Display error
				calcExpression = "ERROR";
				//TODO: Change CE button to AC  

				updateDisplay(calcExpression);
				return;
			}
			calcState = state.ANS;			
			calcExpression = soln.toString();
			answer = soln.toString();
			//TODO: Update prev display
			//TODO: change CE button to AC
		}
	}
	else if(calcState == state.ERR){
		//If input is received on Error state, reinitialise calc expression and prev expression and move to INIT state
		//calcExpression = "0";
		initialise();
		calcState = state.INIT;
		//TODO: Change AC button to CE
		handleInput(str);
		//displayText.innerHTML = generateDisplay(calcExpression);
		return;
	}
	else if(calcState == state.ANS){
		if(isOperator(str) || isUnaryOperator(str)){
			calcExpression+=str;
			calcState = state.EXP;
		}
		else if(str=="bsp"){
			//TODO: Move current soln to prev view
			initialise();
			calcState = state.INIT;
			updateDisplay(calcExpression);
			return;
		}
		else if(str=="(" || str == ")"){
			if(str == "("){
				bracketCount++;
				calcExpression = "";
				calcExpression+=str;
				calcState = state.EXP;
			}
		}
		else if(isBracketBoundOperator(str) && str!="^"){
			calcExpression = "";
			calcExpression+=str+"(";
			calcState = state.EXP;
			bracketCount++;
		}
		else if(isOperand(str)){
			calcExpression = "";
			calcState = state.EXP;
			calcExpression += str;
		}
		else if (str == "."){
			calcExpression = "";
			calcState = state.EXP;
			calcExpression += "0.";
		}
	}
	//TODO: Update display depending on state
	//console.log("str:"+str);
	//console.log("calcExpression:"+calcExpression);
	//console.log("calcState:"+calcState);
	updateDisplay(generateDisplay(calcExpression));
}

function generateDisplay(calcExpression){
	//console.log("updateDisplay:"+calcExpression);
	var tmp = calcExpression.split("");	
	//console.log(tmp);
	for (var i = 0; i < tmp.length; i++) {
		if (tmp[i]=="^") {		
			//console.log("Found ^ at"+i);	
			var j = i+1;
			var brckCt = 0;
			for (; j<tmp.length; j++) {
				if(tmp[j]=="("){
					brckCt++;
				}
				if(tmp[j]==")"){
					brckCt--;
				}
				if(brckCt == 0){
					tmp.splice(j+1,0,"</sup>");
					break;
				}
			}
			tmp.splice(i+1,0,"<sup>");
			//console.log(tmp);
			i=j;
		}
	}
	tmp = tmp.map(function(elem,index,arr){
		if(elem == "*"){
			return " x ";
		}
		else if(elem=="^"){
			return "";
		}
		else if(elem == "/"){
			return " \xF7 ";
		}
		else if(elem == "-" && ((index==0) || (isOperator(arr[index-1])) || arr[index-1] == "(" )){
			return "-";
		}
		else if(elem == "s"){
			return "\u221A";
		}
		else if(isOperator(elem)){
			return " "+elem+" ";
		}
		else if(elem == "l"){
			return "log";
		}
		else if(elem == "L"){
			return "ln";
		}
		else
			return elem;
	});
	//console.log("brckCt:"+brckCt);
	var str = tmp.join("");
	var sparePara = document.getElementById("sparePara");
	var spP = "";
	if(calcState == state.EXP){	
		if(brckCt > 0)
			spP += "<sup>";	
		for (var i = 0; i < bracketCount; i++) {
			spP += ")";
			if(i == brckCt-1)
				spP += "</sup>";
		}
		sparePara.innerHTML = spP;
	}
	else{
		sparePara.innerHTML = "";
	}
	return str;
}

function updateDisplay(str){
	displayText.innerHTML = str;
	if(calcState == state.EXP){
		miniDisplay.innerHTML = "Ans:"+answer;
	}	
	else if(calcState == state.ERR || calcState == state.ANS){
		miniDisplay.innerHTML = generateDisplay(lastExpression);
	}	
}

function isValidSoln(soln){ 		//Works like isNaN. Checks for infinity results as well
  return (soln*0.0 === 0.0);
}

function tokeniseExpression(str){
  return str.split(/([-+*%//(/)^slL])/).filter(function(elem){
    if(elem === "")
      return false;
    return true;
  });
}

function isOperand(str){
	return ["0","1","2","3","4","5","6","7","8","9"].includes(str);
}

function isBracketBoundOperator(str){
	return ["^","l","L","s"].includes(str);
}

function isOperator(str){
  return ["+","-","*","/","^"].includes(str);
}

function isUnaryOperator(str){
	return ["%","-"].includes(str);
}

function percent(a){
	return parseFloat(a)/100;
}

function evaluateUnaryOperators(arr){
	var index = 0;
	while(index < arr.length){
		//console.log(arr.toString());
		if(isUnaryOperator(arr[index])){
			//console.log(arr[index]);
			switch(arr[index]){
				case "%":
					/*if(arr[index-1] != ")"){
						arr[index-1] = parseFloat(percent(arr[index-1]).toFixed(8));
						arr = arr.slice(0,index).concat(arr.slice(index+1));
					}
					else{
						index++;
					}*/
					index++;
					break;				
				case "-":
					if(isOperator(arr[index-1]) || index==0 || arr[index-1]=="("){
						arr[index+1] = parseFloat(parseFloat("-"+arr[index+1]).toFixed(8));
						arr = arr.slice(0,index).concat(arr.slice(index+1));
					}
					else
						index++;
				break;
				default:
				console.log("Error.");
				break;
			}
		}
		else
			index++;
	}
	return arr;
}

var precedence = {

	"%": 5,
	"^": 6,		//power function
	"l": 6, 	//log
	"L":6,		//lon
	"s":6, 		//sqrt
  "+": 3,
  "-": 3,
  "*": 4,
  "/": 4
};

function convertToPostFix(arr){
  //console.log(arr);
  var postStack = [];
  var operStack = [];
  if(arr.length == 0){
  	return [];
  }
  arr.forEach(function(elem){
    //console.log(elem);
    if(isOperator(elem)){
      while(operStack.length>0 && 
            precedence[operStack[operStack.length-1]] >= precedence[elem]){
        postStack.push(operStack.pop());
      }
      operStack.push(elem);
    }
    else if(elem == "("){
    	operStack.push(elem);
    }
    else if(elem == ")"){
      while(operStack.length>0 && 
            operStack[operStack.length-1]!="("){
        postStack.push(operStack.pop());
      }     
      operStack.pop();
    }
    else if(isUnaryOperator(elem) && (elem!="-")){
    	operStack.push(elem);
    }  
    else if(isBracketBoundOperator(elem) && elem!="^"){
    	operStack.push(elem);
    }  
    else{
    	//operands
      postStack.push(elem);
    }
    //console.log(postStack,operStack);
  });  
  while(operStack.length>0){
    postStack.push(operStack.pop());
  }
  //console.log(postStack);
  return postStack;
}

function evaluatePostFix(arr){
	var evalStack = [];
	if(arr.length == 0){
		return 0;
	}
	arr.forEach(function(elem){
		if(isOperator(elem)){
			var b=evalStack.pop();
			var a=evalStack.pop();
			var c=evaluateExpression(parseFloat(a),parseFloat(b),elem);
			//console.log("evalExpression elem:"+elem+"result:"+c);
			evalStack.push(c);
		}
		else if((isUnaryOperator(elem) && elem!="-") || (isBracketBoundOperator(elem) && elem!="^")){
			a=evalStack.pop();
			b=0;
			c=evaluateExpression(parseFloat(a),0,elem)
			//console.log("evalExpression elem:"+elem+"result:"+c);
			evalStack.push(c);
		}
		else{
			elem = parseFloat(elem);
			evalStack.push(elem);
		}
	});
	return parseFloat(evalStack[0].toFixed(8));
}

function evaluateExpression(a,b,op){
	switch(op){
		case "+":
		return a+b;
		case "-":
		return a-b;
		case "*":
		return a*b;
		case "/":
		return a/b;
		case "%":
		return percent(a);
		case "^":
		return Math.pow(a,b);
		case "l":
		return Math.log10(a);
		case "L":
		return Math.log(a);
		case "s":
		return Math.pow(a,0.5);
		default:
		console.log("Improper expression");
	}
}

function pushInput(str){
	//console.log(str);
	handleInput(str);
}

function evaluateInput(str){//TODO: Streamline function once debugging is done
	var tokExpr = tokeniseExpression(str);
	//console.log("tokExpr:"+tokExpr.toString());
	var unEval = evaluateUnaryOperators(tokExpr);
	//console.log("unEval:"+unEval.toString());
	var postFixExpr = convertToPostFix(unEval);
	//console.log("postFixExpr:"+postFixExpr.toString());
	var soln = evaluatePostFix(postFixExpr);
	//console.log("soln:"+soln);
	return soln;
}
//console.log(convertToPostFix( evaluateUnaryOperators (tokeniseExpression("3%*7-3%*(%9+10/3-3)/(4+5-6)"))));