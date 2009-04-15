/***************************
Copyright (C) 2006 Gaël Crova

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later version. 

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details. 

You should have received a copy of the GNU General Public License along with this program; if not, write to the Free Software Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
****************************/

/*****************
Smart Editor use the Mochikit library for the key events
****************/

// Textarea element / available for all scripts
var wikismartTextarea = "";
var wikismartTextareaId = "";
var wikismartTextareaHasFocus = false;

// For search engine
var wikismartTopSearchHasFocus = false;
var wikismartBottomSearchHasFocus = false;
var wikismartTextToSearch = "";
var wikismartTextOccurence = -1;

var wikismartValueToInsertFromPopup = "";

var wikismartShiftPressed = false;
// MLR variable to hold Alt & Ctrl key status
var wikismartAltorCtrlPressed = false;

// The textarea content at t time
var wikismartTextareaContent = "";
var wikismartSelection = "";
var wikismartStartIndex = "";
var wikismartEndIndex = "";
var wikismartTextareaScrollFirefox = 0;

// Opened rows
var smartEditSearchOpen = false;
var smartEditInternalLinkOpen = false;
var smartEditExternalLinkOpen = false;

// All custom functions
var wikismartCustomerStrings = new Array();
var wikismartCustomerIcons = new Array();
var wikismartCustomerFunctionNames = new Array();
var wikismartCustomerIconsNames = new Array();
var wikismartWebStrings = new Array();
var wikismartWebIcons = new Array();
var wikismartWebFunctionNames = new Array();
var wikismartWebIconsNames = new Array();
var wikismartSiteStrings = new Array();
var wikismartSiteIcons = new Array();
var wikismartSiteFunctionNames = new Array();
var wikismartSiteIconsNames = new Array();
var smartEditorIECssClass = "";

// When a popup div is opened ... do not initialize selection in IE !!!
var smartEditDoNotInit = false;

var smartEditFirstExternalLink = true;

var reVarUnset = /^($|off|0|%)/i;
var reIsIE = /MSIE/;
var reIsIE8 = /MSIE [123489][.]/;
var reFFinclude = /gecko/i;
var reFFexclude = /(spoofer|khtml|netscape\/7[.]0)/i;
var reOpera = /opera/i;

var is_opera = reOpera.exec(navigator.userAgent);
var is_firefox = reFFinclude(navigator.userAgent) && !reFFexclude(navigator.userAgent);

function wikismartEdit(textareaid){
	wikismartTextareaId = textareaid;
	// Works only on If browser is Firefox or IE 8
	if (!is_firefox 
	    && !reIsIE8.exec(navigator.userAgent)
	    && reVarUnset.exec(wikismartForce)) { 
	      return -1; 
	    }
	// Special CSS style for Internet Explorer
	if(reIsIE.exec(navigator.userAgent)) {
		smartEditorIECssClass = "IE";
	}

	// We try to detect if we are in WYSIWYG mode, and abort if such
	// look for: <meta name="TINYMCEPLUGIN_INIT" content="..." />
	// check the alignment on a number of cells in a table. 
	var head = document.getElementsByTagName('head').item(0);
	var metas = head.getElementsByTagName("meta"); 
	var mname;
	for (var i = 0; i < metas.length; i++) { 
	  mname = metas[i].getAttribute("name"); 
	  if ( mname == "TINYMCEPLUGIN_INIT") { 
	    return -1;
	  }
	}


	wikismartTextarea = document.getElementById(wikismartTextareaId);
	wikismartTextAreaRows = wikismartTextarea.rows;
	wikismartTextarea.onfocus = function(){wikismartTextAreaFocus();};
	wikismartTextarea.onclick = function(){wikismartTextAreaClicked();};
	wikismartTextarea.onblur = function(){wikismartTextAreaFocus();};
	wikismartParseSiteFunctions();
	wikismartParseWebFunctions();
	wikismartParseCustomerFunctions();
	wikismartParseSiteSmileys();
	wikismartParseWebSmileys();
	wikismartParseCustomerSmileys();
	if(wikismartTextarea == null){
		alert("No textarea detected with the given id : "+textareaid);
	}
	else{
		// The problem is here for preview mode ......
		// Insert the top toolbar
		var newTool = smartEditCreateToolbar();
		document.getElementById("smartEditorTopToolbarID").appendChild(newTool);
		// Insert the botton toolbar
		var newToolBottom = smartEditCreateToolbar();
		wikismartInsertAfter(wikismartTextarea.parentNode, newToolBottom, wikismartTextarea);
	}
}

/* For function search*/
/* Calculate scroll value for firefox */
function wikismartCalculateScroll(){
	var scrollHeight = wikismartTextarea.scrollHeight;
	var tscontent = wikismartTextarea.value;
	tscontent = wikismartReplaceAll(tscontent);
	var tslines = wikismartGetLines(tscontent);
	var lineHeight = 0;
	if( tslines != null && tscontent.length != -1){
		lineHeight = scrollHeight / (tslines.length);
	}
	return lineHeight;
}

/* When the textarea get the focus*/
function wikismartTextAreaFocus(){
	wikismartTextareaHasFocus = !wikismartTextareaHasFocus;
}

/* If the user click on the textarea, close all menus*/
function wikismartTextAreaClicked(){
	if(wikismartTextareaHasFocus && smartExtendedStylesOpen){
		smartEditToggleStyles();
	}
	if(wikismartTextareaHasFocus && SmartEditInsertCommonStringOpen){
		smartEditToggleInsert();
	}
	if(wikismartTextareaHasFocus && SmartEditInsertColorOpen){
		smartEditToggleColors();
	}
	if(wikismartTextareaHasFocus && SmartEditInsertSmileyOpen){
		smartEditToggleSmileys();
	}
	if(smartEditInternalLinkOpen && wikismartTextareaHasFocus){
		smartEditFirstWikiLink = false;
	}
	if(smartEditExternalLinkOpen && wikismartTextareaHasFocus){
		smartEditFirstExternalLink = false;
		wikismartInitializeAllAttributesForIE();
		//document.getElementById("smarteditorExternalLinkTextInput").value = wikismartSelection;
	}
}

/* For all functions */
/* Initalize all selection attributes */
function wikismartInitializeAllAttributes(){
	wikismartTextareaContent = wikismartTextarea.value;
	wikismartTextareaContent = wikismartReplaceAll(wikismartTextareaContent);
	if(document.selection  && !is_firefox) {
		wikismartSelection = document.selection.createRange().text;
		var lbefore = wikismartSelection.length;
		wikismartStartIndex = wikismartCursorPosition();
		if(wikismartStartIndex == -1){
			wikismartStartIndex = wikismartTextarea.value.length;
		}
		wikismartSelection = wikismartReplaceAll(wikismartSelection);
		var lend = lbefore - wikismartSelection.length;
		wikismartEndIndex = wikismartStartIndex+wikismartSelection.length;
		var nblines = wikismartNbLinesBefore(wikismartStartIndex);
		wikismartStartIndex -= nblines;
		wikismartEndIndex -= nblines;
	}
	else{
		wikismartTextareaScrollFirefox = wikismartTextarea.scrollTop;
		wikismartStartIndex = wikismartCursorPosition();
		wikismartSelection = wikismartTextareaContent.substring(wikismartStartIndex,wikismartTextarea.selectionEnd);
		wikismartEndIndex = wikismartStartIndex+wikismartSelection.length;
	}
	
	if(wikismartIsEmptyString(wikismartSelection)){
		wikismartSelection = "";
	}
}

/*For Styles, Colors, Icons and Insert menus*/
/* Initialize selection before another click on menu */
/* Cause : Bug on IE - If I d'on't initialize it before, a click on the new divisions clear old selection in the textarea*/
function wikismartInitializeAllAttributesForIE(){
	wikismartTextareaContent = wikismartTextarea.value;
	wikismartTextareaContent = wikismartReplaceAll(wikismartTextareaContent);
	if(document.selection  && !is_firefox) {
		wikismartSelection = document.selection.createRange().text;
		var lbefore = wikismartSelection.length;
		wikismartStartIndex = wikismartCursorPosition();
		if(wikismartStartIndex == -1){
			wikismartStartIndex = wikismartTextarea.value.length;
		}
		wikismartSelection = wikismartReplaceAll(wikismartSelection);
		var lend = lbefore - wikismartSelection.length;
		wikismartEndIndex = wikismartStartIndex+wikismartSelection.length;
		var nblines = wikismartNbLinesBefore(wikismartStartIndex);
		wikismartStartIndex -= nblines;
		wikismartEndIndex -= nblines;
	}
	else{
		wikismartTextareaScrollFirefox = wikismartTextarea.scrollTop;
		wikismartStartIndex = wikismartCursorPosition();
		wikismartSelection = wikismartTextareaContent.substring(wikismartStartIndex,wikismartTextarea.selectionEnd);
		wikismartEndIndex = wikismartStartIndex+wikismartSelection.length;
	}
	if(wikismartIsEmptyString(wikismartSelection)){
		wikismartSelection = "";
	}
	wikismartTextarea.value = wikismartTextareaContent;
	wikismartSetSelectionRange(wikismartTextarea,wikismartStartIndex,wikismartEndIndex);

}

/* Set all line separators to \n */
/* In IE and Opera, it is \r\n */
function wikismartReplaceAll(text){
	if(text != null && text.length > 0){
		var indice = text.indexOf("\r\n");
		while(indice != -1){
			text = text.substring(0,indice)+"\n"+text.substring(indice+2,text.length);
			indice = text.indexOf("\r\n");
		}
	}
	return text;
}

/* return cursor position in the textarea*/
function wikismartCursorPosition() {
	var node = document.getElementById(wikismartTextareaId);
	node.focus();
	/* without node.focus() IE will returns -1 when focus is not on node */ 
	if(node.selectionStart || navigator.userAgent.toLowerCase().indexOf("opera") != -1) 
		return node.selectionStart;
	else if(!document.selection)
		return 0;
	var c  = "\001";
	var sel = document.selection.createRange();
	var dul = sel.duplicate(); 
	var len = 0;
	dul.moveToElementText(node);
	sel.text = c;
	len  = (dul.text.indexOf(c));
	sel.moveStart('character',-1);
	sel.text = "";
	return len;
}

/* Select text in the given input*/
function wikismartSetSelectionRange(input, start, end) {
	// If it is Opera, change the value for selected elements !
	if(navigator.userAgent.toLowerCase().indexOf("opera") != -1){
		var sslinesBefore = wikismartNbLinesBefore(start);
		var sslinesTotal = wikismartNbLinesBefore(end);
		var sslinesInner = sslinesTotal - sslinesBefore;
		start = start+sslinesBefore;
		end = end+sslinesTotal;
		
		//wikismartDebug("Start and end : "+start+"_"+end);
	}
//wikismartNbLinesBefore

	if (is_firefox) {
		input.setSelectionRange(start, end);
		input.focus();
	} 
	else {
		// assumed IE
		var range = input.createTextRange();
		range.collapse(true);
		range.moveStart("character", start);
		range.moveEnd("character", end - start);
		range.select();
	}
}

/* Cheat mode for Opera  - I have to know the number of lines before the first selected character to set the new startSelection value*/
function wikismartNbLinesBefore(index){
	var text = wikismartTextarea.value;
	var ind = wikismartIndexsOf(text,"\r\n");
	var nb = 0;
	if(ind != null && ind.length > 0){
		for(var i=0;i<ind.length;i++){
			if(ind[i] < index){
				nb++;
			}
		}
	}
	return nb;
}

/* returns an array with all indexes of the tosearch string in text*/
function wikismartIndexsOf(text, tosearch){
	var result = new Array();
	var result2 = new Array();
	if(text != null && text.length > 0){
		var index = text.lastIndexOf(tosearch);
		if(index != -1){
			while(index != -1 && text.length > 0){
				result2.push(index);
				text = text.substring(0,index);
				index = text.lastIndexOf(tosearch);
			}
			if(result2.length > 0){
				for(var i=result2.length-1;i>=0;i--){
					result.push(result2[i]);
				}
			}
		}
	}
	return result;
}
/* Write some debug info under textarea*/
function wikismartDebug(text){
	var divinfo = document.getElementById('wikismartinfo');
	divinfo.className="wikismartinfo"+smartEditorIECssClass;
	var tmptext = document.createElement('div');
	tmptext.innerHTML = text;
	divinfo.appendChild(tmptext);
}

/* Test if text is an empty string*/
function wikismartIsEmptyString(text){
	count = 0;
	if(text != null && text.length > 0){
		while(text.charAt(count) == " "){
			count++;
		}
		if(count == text.length){
			return true;
		}
	}
	else{
		if(text.length == 0){
			return true;
		}
	}
	return false;
}

function wikismartIndexOfFirstCharacter(text){
	if(text!=null && text.length > 0){
		var currentPos = 0;
		while(text.length>0 && text.indexOf(" ")==0){
			currentPos++;
			text = text.substring(1,text.length);
		}
		return currentPos;
	}
	else{
		return -1;
	}
}

function wikismartIndexOfLastCharacter(text){
	if(text!=null && text.length > 0){
		var currentPos = text.length-1;
		while(text.length>0 && text.lastIndexOf(" ")==(text.length-1)){
			currentPos--;
			text = text.substring(0,text.length-1);
		}
		return currentPos;
	}
	else{
		return -1;
	}
}

function wikismartGetLines(mySelection){
	var text = mySelection;
	var myarray = wikismartIndexsOf(text,"\n");
	var textarray = new Array();
	if(myarray != null && myarray.length > 0){
		textarray.push(text.substring(0,myarray[0]));
		for(var i=0;i<myarray.length-1;i++){
			textarray.push(text.substring(myarray[i],myarray[i+1]));
		}
		textarray.push(text.substring(myarray[myarray.length-1],text.length));
	}
	else{ // No line detected
		textarray.push(text);
	}
	return textarray;
}

function wikismartIndexOfBulletOrNumList(text){
	var result = -1;
	var stringres = "";
	if(text.indexOf("   1 ") >= 0){
		while(text.indexOf("   ") == 0){
			text = text.substring(3,text.length);
			result++;	
		}
		stringres+="1 ";
		if(text.length == 2 || (text.length > 2 && wikismartIsEmptyString(text.substring(2,text.length)))){
			listtodelete = true;
			return -1;
		}
		
	}
	else{
		if(text.indexOf("   * ") >= 0){
			while(text.indexOf("   ") == 0){
				text = text.substring(3,text.length);
				result++;
			}
			stringres+="* ";
			if(text.length == 2 || (text.length > 2 && wikismartIsEmptyString(text.substring(2,text.length)))){
				listtodelete = true;
				return -1;
			}
		}
	}
	return result;
}

// Returns value from 1 to 6 to give the Heading value - returns -1 else no heading detected
// The given text musn't contain \n character
function wikismartContainsHeading(text){
	if(text != null && text.length > 3){
		if(text.indexOf("---") == 0){
			if(text.indexOf("---++++++") == 0){	
				return 6;
			}
			else{
				if(text.indexOf("---+++++") == 0){
					return 5;
				}
				else{
					if(text.indexOf("---++++") == 0){
						return 4;
					}
					else{
						if(text.indexOf("---+++") == 0){
							return 3;
						}
						else{
							if(text.indexOf("---++") == 0){
								return 2;
							}
							else{
								if(text.indexOf("---+") == 0){
									return 1;
								}
								else{
									return -1;
								}
							}
						}
					}
				}
			}
		}
		else{
			return -1;
		}
	}
	return -1;
}

function wikismartParseCustomerFunctions(){
	if(wikismartCustomerPreferences != null && wikismartCustomerPreferences.length > 0){
		wikismartCustomerPreferences = wikismartReplaceAll(wikismartCustomerPreferences);
		var tsIndexesOfStartElements = wikismartIndexsOf(wikismartCustomerPreferences,"<tselement>");
		var tsIndexesOfEndElements = wikismartIndexsOf(wikismartCustomerPreferences,"</tselement>");
		if(tsIndexesOfStartElements != null && tsIndexesOfEndElements != null && tsIndexesOfEndElements.length == tsIndexesOfStartElements.length){
			
			for(var i =0; i< tsIndexesOfEndElements.length;i++){
				if(tsIndexesOfStartElements[i] < tsIndexesOfEndElements[i]){
					var tsElement = wikismartCustomerPreferences.substring(tsIndexesOfStartElements[i]+11,tsIndexesOfEndElements[i]); 
					var elementIsValid = true;
					
					// Process for the element name
					var tsElementName = "";
					var tsIndexOfStartNameTag = tsElement.indexOf("<tsname>");
					var tsIndexOfEndNameTag = tsElement.indexOf("</tsname>");
					if(tsIndexOfStartNameTag != -1 && tsIndexOfEndNameTag != -1 && tsIndexOfStartNameTag < tsIndexOfEndNameTag){
						tsElementName = tsElement.substring(tsIndexOfStartNameTag+8,tsIndexOfEndNameTag);
					}
					else{
						elementIsValid = false;
						
					}
					
					// Process for the element string to insert
					var tsElementString = "";
					var tsIndexOfStartStringTag = tsElement.indexOf("<tsstring>");
					var tsIndexOfEndStringTag = tsElement.indexOf("</tsstring>");
					if(tsIndexOfStartStringTag != -1 && tsIndexOfEndStringTag != -1 && tsIndexOfStartStringTag < tsIndexOfEndStringTag){
						tsElementString = tsElement.substring(tsIndexOfStartStringTag+10,tsIndexOfEndStringTag);
					}
					else{
						elementIsValid = false;
						
					}
					if(elementIsValid){
						
						wikismartCustomerStrings.push(tsElementString);
						wikismartCustomerFunctionNames.push(tsElementName);
					}
					
				}
				else{
					
				}
			}
		}
		else{
			
		}
	}
	else{
		
	}
}

function wikismartParseWebFunctions(){
	if(wikismartWebPreferences != null && wikismartWebPreferences.length > 0){
		wikismartWebPreferences = wikismartReplaceAll(wikismartWebPreferences);
		var tsIndexesOfStartElements = wikismartIndexsOf(wikismartWebPreferences,"<tselement>");
		var tsIndexesOfEndElements = wikismartIndexsOf(wikismartWebPreferences,"</tselement>");
		if(tsIndexesOfStartElements != null && tsIndexesOfEndElements != null && tsIndexesOfEndElements.length == tsIndexesOfStartElements.length){
			
			for(var i =0; i< tsIndexesOfEndElements.length;i++){
				if(tsIndexesOfStartElements[i] < tsIndexesOfEndElements[i]){
					var tsElement = wikismartWebPreferences.substring(tsIndexesOfStartElements[i]+11,tsIndexesOfEndElements[i]); 
					var elementIsValid = true;
					
					// Process for the element name
					var tsElementName = "";
					var tsIndexOfStartNameTag = tsElement.indexOf("<tsname>");
					var tsIndexOfEndNameTag = tsElement.indexOf("</tsname>");
					if(tsIndexOfStartNameTag != -1 && tsIndexOfEndNameTag != -1 && tsIndexOfStartNameTag < tsIndexOfEndNameTag){
						tsElementName = tsElement.substring(tsIndexOfStartNameTag+8,tsIndexOfEndNameTag);
					}
					else{
						elementIsValid = false;
						
					}
					
					// Process for the element string to insert
					var tsElementString = "";
					var tsIndexOfStartStringTag = tsElement.indexOf("<tsstring>");
					var tsIndexOfEndStringTag = tsElement.indexOf("</tsstring>");
					if(tsIndexOfStartStringTag != -1 && tsIndexOfEndStringTag != -1 && tsIndexOfStartStringTag < tsIndexOfEndStringTag){
						tsElementString = tsElement.substring(tsIndexOfStartStringTag+10,tsIndexOfEndStringTag);
					}
					else{
						elementIsValid = false;
						
					}
					if(elementIsValid){
						
						wikismartWebStrings.push(tsElementString);
						wikismartWebFunctionNames.push(tsElementName);
					}
					
				}
				else{
					
				}
			}
		}
		else{
			
		}
	}
	else{
		
	}
}

function wikismartParseSiteFunctions(){

	if(wikismartSitePreferences != null && wikismartSitePreferences.length > 0){
		wikismartSitePreferences = wikismartReplaceAll(wikismartSitePreferences);
		var tsIndexesOfStartElements = wikismartIndexsOf(wikismartSitePreferences,"<tselement>");
		var tsIndexesOfEndElements = wikismartIndexsOf(wikismartSitePreferences,"</tselement>");
		if(tsIndexesOfStartElements != null && tsIndexesOfEndElements != null && tsIndexesOfEndElements.length == tsIndexesOfStartElements.length){
			for(var i =0; i< tsIndexesOfEndElements.length;i++){
				if(tsIndexesOfStartElements[i] < tsIndexesOfEndElements[i]){
					var tsElement = wikismartSitePreferences.substring(tsIndexesOfStartElements[i]+11,tsIndexesOfEndElements[i]); 
					var elementIsValid = true;
					
					// Process for the element name
					var tsElementName = "";
					var tsIndexOfStartNameTag = tsElement.indexOf("<tsname>");
					var tsIndexOfEndNameTag = tsElement.indexOf("</tsname>");
					if(tsIndexOfStartNameTag != -1 && tsIndexOfEndNameTag != -1 && tsIndexOfStartNameTag < tsIndexOfEndNameTag){
						tsElementName = tsElement.substring(tsIndexOfStartNameTag+8,tsIndexOfEndNameTag);
					}
					else{
						elementIsValid = false;
					}
					
					// Process for the element string to insert
					var tsElementString = "";
					var tsIndexOfStartStringTag = tsElement.indexOf("<tsstring>");
					var tsIndexOfEndStringTag = tsElement.indexOf("</tsstring>");
					if(tsIndexOfStartStringTag != -1 && tsIndexOfEndStringTag != -1 && tsIndexOfStartStringTag < tsIndexOfEndStringTag){
						tsElementString = tsElement.substring(tsIndexOfStartStringTag+10,tsIndexOfEndStringTag);
					}
					else{
						elementIsValid = false;
					}
					if(elementIsValid){
						
						wikismartSiteStrings.push(tsElementString);
						wikismartSiteFunctionNames.push(tsElementName);
					}
				}
			}
		}
	}
}

function smartEditorDoGetWebs(){
	var req = null;      
	if(window.XMLHttpRequest){ // Firefox 
      req = new XMLHttpRequest();  
	 }
	else{ 
		if(window.ActiveXObject){ // Internet Explorer 
			req = new ActiveXObject("Microsoft.XMLHTTP");			
		}
		else { // XMLHttpRequest non supporté par le navigateur 
			alert("Your browser is not compliant ! Please use another one !"); 
			return; 
		}
	} 
	var address = wikismartWikiHomeURL+'?skin=smarteditorweblist';
	var smartResponse ="";
	req.open("GET", address, true);
	req.onreadystatechange = function() { 
		if(req.readyState == 4){ 
			smartEditInitWebs(req.responseText);
		}
	}
	req.send(null);
}

function smartEditInitWebs(text){ 
	var theHTML = "Select web <SELECT id=\"smartEditorWebSelectElement\">"+text+"</SELECT>";
	if(document.getElementById("smarteditorWebChoice") != null){
		document.getElementById("smarteditorWebChoice").innerHTML = theHTML;
		var webSelect = document.getElementById("smartEditorWebSelectElement");
		//document.getElementById("smartEditorWebSelectElementTable").style.width = "100%";
		//document.getElementById("smartEditorWebSelectElementTable").style.margin = "0px";
		webSelect.value = wikismartCurrentWeb;
		selectWebClicked(wikismartCurrentWeb);
		webSelect.onchange = function(){selectWebClicked(webSelect.value)};
	}
}

function selectWebClicked(theWebValue){
	document.getElementById("smartEditorInputTopic").style.display = "none";
	smartEditorDoGetWebTopics(theWebValue);
	selectedWeb = theWebValue;
}

function smartEditorDoGetWebTopics(web){
	var req = null;      
	if(window.XMLHttpRequest){ // Firefox 
      req = new XMLHttpRequest();  
	 }
	else{ 
		if(window.ActiveXObject){ // Internet Explorer 
			req = new ActiveXObject("Microsoft.XMLHTTP");			
		}
		else { // XMLHttpRequest non supporté par le navigateur 
			alert("Your browser is not compliant ! Please use another one !"); 
			return; 
		}
	} 
	var address = wikismartWikiHomeURL+"/"+web+'?skin=smarteditorwebtopiclist';
	//alert("Address : "+address);
	var smartResponse ="";
	req.open("GET", address, true);
	req.onreadystatechange = function() {
		if(req.readyState == 4){ 
			smartEditInitWebTopics(req.responseText);
		}
	}
	req.send(null);
}

function smartEditInitWebTopics(text){
	wikismartParseTopics(text);
}

function wikismartParseTopics(webTopics){ 

	smartEditTopicList = new Array();	

	if(webTopics != null && webTopics.length > 0){
		webTopics = wikismartReplaceAll(webTopics);
		var tsIndexesOfStartElements = wikismartIndexsOf(webTopics,"<topic>");
		var tsIndexesOfEndElements = wikismartIndexsOf(webTopics,"</topic>");
		if(tsIndexesOfStartElements != null && tsIndexesOfEndElements != null && tsIndexesOfEndElements.length == tsIndexesOfStartElements.length){
			for(var i =0; i< tsIndexesOfEndElements.length;i++){
				if(tsIndexesOfStartElements[i] < tsIndexesOfEndElements[i]){
					var tsElement = webTopics.substring(tsIndexesOfStartElements[i]+7,tsIndexesOfEndElements[i]); 
					smartEditTopicList.push(tsElement);
				}
			}
		}
	}
	document.getElementById("smartEditorInputTopic").style.display = "";
	smartEditInitAutoCompletion(smartEditTopicList, "smartEditorInputTopic", true);
}

function wikismartParseCustomerSmileys(){
	if(wikismartFoswikiUserIcons != null && wikismartFoswikiUserIcons.length > 0){
		wikismartFoswikiUserIcons = wikismartReplaceAll(wikismartFoswikiUserIcons);
		var tsIndexesOfStartElements = wikismartIndexsOf(wikismartFoswikiUserIcons,"<tselement>");
		var tsIndexesOfEndElements = wikismartIndexsOf(wikismartFoswikiUserIcons,"</tselement>");
		if(tsIndexesOfStartElements != null && tsIndexesOfEndElements != null && tsIndexesOfEndElements.length == tsIndexesOfStartElements.length){
			
			for(var i =0; i< tsIndexesOfEndElements.length;i++){
				if(tsIndexesOfStartElements[i] < tsIndexesOfEndElements[i]){
					var tsElement = wikismartFoswikiUserIcons.substring(tsIndexesOfStartElements[i]+11,tsIndexesOfEndElements[i]); 
					var elementIsValid = true;
					
					// Process for the element name
					var tsElementName = "";
					var tsIndexOfStartNameTag = tsElement.indexOf("<tsname>");
					var tsIndexOfEndNameTag = tsElement.indexOf("</tsname>");
					if(tsIndexOfStartNameTag != -1 && tsIndexOfEndNameTag != -1 && tsIndexOfStartNameTag < tsIndexOfEndNameTag){
						tsElementName = tsElement.substring(tsIndexOfStartNameTag+8,tsIndexOfEndNameTag);
					}
					else{
						elementIsValid = false;
						
					}
					
					// Process for the element string to insert
					var tsElementString = "";
					var tsIndexOfStartStringTag = tsElement.indexOf("<tsstring>");
					var tsIndexOfEndStringTag = tsElement.indexOf("</tsstring>");
					if(tsIndexOfStartStringTag != -1 && tsIndexOfEndStringTag != -1 && tsIndexOfStartStringTag < tsIndexOfEndStringTag){
						tsElementString = tsElement.substring(tsIndexOfStartStringTag+10,tsIndexOfEndStringTag);
					}
					else{
						elementIsValid = false;
						
					}
					if(elementIsValid){
						
						wikismartCustomerIcons.push(tsElementString);
						wikismartCustomerIconsNames.push(tsElementName);
					}
					
				}
				else{
					
				}
			}
		}
		else{
			
		}
	}
	else{
		
	}
}

function wikismartParseWebSmileys(){
	if(wikismartFoswikiWebIcons != null && wikismartFoswikiWebIcons.length > 0){
		wikismartFoswikiWebIcons = wikismartReplaceAll(wikismartFoswikiWebIcons);
		var tsIndexesOfStartElements = wikismartIndexsOf(wikismartFoswikiWebIcons,"<tselement>");
		var tsIndexesOfEndElements = wikismartIndexsOf(wikismartFoswikiWebIcons,"</tselement>");
		if(tsIndexesOfStartElements != null && tsIndexesOfEndElements != null && tsIndexesOfEndElements.length == tsIndexesOfStartElements.length){
			
			for(var i =0; i< tsIndexesOfEndElements.length;i++){
				if(tsIndexesOfStartElements[i] < tsIndexesOfEndElements[i]){
					var tsElement = wikismartFoswikiWebIcons.substring(tsIndexesOfStartElements[i]+11,tsIndexesOfEndElements[i]); 
					var elementIsValid = true;
					
					// Process for the element name
					var tsElementName = "";
					var tsIndexOfStartNameTag = tsElement.indexOf("<tsname>");
					var tsIndexOfEndNameTag = tsElement.indexOf("</tsname>");
					if(tsIndexOfStartNameTag != -1 && tsIndexOfEndNameTag != -1 && tsIndexOfStartNameTag < tsIndexOfEndNameTag){
						tsElementName = tsElement.substring(tsIndexOfStartNameTag+8,tsIndexOfEndNameTag);
					}
					else{
						elementIsValid = false;
						
					}
					
					// Process for the element string to insert
					var tsElementString = "";
					var tsIndexOfStartStringTag = tsElement.indexOf("<tsstring>");
					var tsIndexOfEndStringTag = tsElement.indexOf("</tsstring>");
					if(tsIndexOfStartStringTag != -1 && tsIndexOfEndStringTag != -1 && tsIndexOfStartStringTag < tsIndexOfEndStringTag){
						tsElementString = tsElement.substring(tsIndexOfStartStringTag+10,tsIndexOfEndStringTag);
					}
					else{
						elementIsValid = false;
						
					}
					if(elementIsValid){
						
						wikismartWebIcons.push(tsElementString);
						wikismartWebIconsNames.push(tsElementName);
					}
					
				}
				else{
					
				}
			}
		}
		else{
			
		}
	}
	else{
		
	}
}

function wikismartParseSiteSmileys(){
	if(wikismartFoswikiSiteIcons != null && wikismartFoswikiSiteIcons.length > 0){
		wikismartFoswikiSiteIcons = wikismartReplaceAll(wikismartFoswikiSiteIcons);
		var tsIndexesOfStartElements = wikismartIndexsOf(wikismartFoswikiSiteIcons,"<tselement>");
		var tsIndexesOfEndElements = wikismartIndexsOf(wikismartFoswikiSiteIcons,"</tselement>");
		if(tsIndexesOfStartElements != null && tsIndexesOfEndElements != null && tsIndexesOfEndElements.length == tsIndexesOfStartElements.length){
			for(var i =0; i< tsIndexesOfEndElements.length;i++){
				if(tsIndexesOfStartElements[i] < tsIndexesOfEndElements[i]){
					var tsElement = wikismartFoswikiSiteIcons.substring(tsIndexesOfStartElements[i]+11,tsIndexesOfEndElements[i]); 
					var elementIsValid = true;
					
					// Process for the element name
					var tsElementName = "";
					var tsIndexOfStartNameTag = tsElement.indexOf("<tsname>");
					var tsIndexOfEndNameTag = tsElement.indexOf("</tsname>");
					if(tsIndexOfStartNameTag != -1 && tsIndexOfEndNameTag != -1 && tsIndexOfStartNameTag < tsIndexOfEndNameTag){
						tsElementName = tsElement.substring(tsIndexOfStartNameTag+8,tsIndexOfEndNameTag);
					}
					else{
						elementIsValid = false;
					}
					
					// Process for the element string to insert
					var tsElementString = "";
					var tsIndexOfStartStringTag = tsElement.indexOf("<tsstring>");
					var tsIndexOfEndStringTag = tsElement.indexOf("</tsstring>");
					if(tsIndexOfStartStringTag != -1 && tsIndexOfEndStringTag != -1 && tsIndexOfStartStringTag < tsIndexOfEndStringTag){
						tsElementString = tsElement.substring(tsIndexOfStartStringTag+10,tsIndexOfEndStringTag);
					}
					else{
						elementIsValid = false;
					}
					if(elementIsValid){
						
						wikismartSiteIcons.push(tsElementString);
						wikismartSiteIconsNames.push(tsElementName);
					}
				}
			}
		}
	}
}
