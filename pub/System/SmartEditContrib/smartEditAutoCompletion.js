/***************************
Copyright (C) 2006 Gaël Crova

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later version. 

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details. 

You should have received a copy of the GNU General Public License along with this program; if not, write to the Free Software Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
****************************/
// Topic list for auto-completion

var smartEditTopicList = "";
var smartEditAutoCompletionDiv = ""; // Autocompletion division
var theTdArray = new Array();
var theValueArray = new Array();
var theElementToUpdate = "";
var theAutoCompletionIsFocused = false;
var theSelectedItemId = "smartTopic0";

var selectedWeb = "";
var selectedTopic = "";

function smartEditInitAutoCompletion(smartEditElementList, elementToUpdateId, entirelist){
	var newTable = document.createElement("TABLE");
	theElementToUpdate = document.getElementById(elementToUpdateId);
	if(entirelist){
		theElementToUpdate.value = "";
	}
	newTable.id = "smartEditAutocompletionTable";
	newTable.className = "smartEditAutocompletionTable"+smartEditorIECssClass;
	var newTBody = document.createElement("TBODY");
	
	selectedTopic = "";
	if(entirelist){
		smartEditTopicList = smartEditElementList;
	}
	// Faire en sorte que le clic sur une case de tablo envoi la bonne valeur .....
	
	// Tableau contenant toutes les TD
	theTdArray = new Array();
	theValueArray = new Array();
	for(var i=0;i<smartEditElementList.length;i++){
		var theTR = document.createElement("TR");
		var theTD = document.createElement("TD");
		theTD.innerHTML = smartEditElementList[i];
		theTD.id = "smartTopic"+i;
		var thevalue = "";
		thevalue = "smartTopic"+i;
		theTdArray.push(thevalue);
		theValueArray.push(smartEditElementList[i]);
		theTR.appendChild(theTD);
		newTBody.appendChild(theTR);
	}
	newTable.appendChild(newTBody);
	

	
	if(!document.getElementById("smartEditAutoCompletionDivision")){
		
		smartEditAutoCompletionDiv = document.createElement("DIV");
	}
	else{
		
		smartEditAutoCompletionDiv = document.getElementById("smartEditAutoCompletionDivision");
		smartEditAutoCompletionDiv.innerHTML = "";
	}
	smartEditAutoCompletionDiv.id= "smartEditAutoCompletionDivision";
	smartEditAutoCompletionDiv.appendChild(newTable);
	setCompleteDivSize();
	//document.body.appendChild(smartEditAutoCompletionDiv);
	wikismartTextarea.parentNode.appendChild(smartEditAutoCompletionDiv);
	// Initialisation des valeurs onclick
	for(var j=0;j<theTdArray.length;j++){
		smartEditorCreateAutocompletionLink(theTdArray[j], theValueArray[j]);
	}
	theElementToUpdate.onclick = function(){smartEditToggleAutocompletion();};
	theElementToUpdate.onkeyup = function(){smartEditShowAutocompletion();};
	smartEditAutoCompletionDiv.style.display = "none";
}


function smartEditorCreateAutocompletionLink(htmlElementId, value){
	document.getElementById(htmlElementId).onclick = function(){smartEditorWikiTopicCliked(value);};
	document.getElementById(htmlElementId).onmouseover = function(){smartEditorSetSelectItemId(htmlElementId);};
	document.getElementById(htmlElementId).onmouseout = function(){smartEditorUnsetSelectItemId();};
}

function smartEditorSetSelectItemId(theID){
	theSelectedItemId = theID;
	if(document.getElementById(theID)){
		document.getElementById(theID).className = "smartMouseOver"+smartEditorIECssClass;
	}
}

function smartEditorUnsetSelectItemId(){
	if(document.getElementById(theSelectedItemId)){
		document.getElementById(theSelectedItemId).className = "";
	}
}

function smartEditorWikiTopicCliked(elementValue){
	document.getElementById("smartEditAutoCompletionDivision").style.display = "none";
	theElementToUpdate.value = elementValue;
	selectedTopic = elementValue;
	document.getElementById("smartEditorWikiLinkPreview").className="smarteditButtonTD"+smartEditorIECssClass;
	document.getElementById("smartEditorWikiLinkInsert").className="smarteditButtonTD"+smartEditorIECssClass;
	theElementToUpdate.focus();
}

function smartEditUpdateDataList(){
	var valueToTest = (theElementToUpdate.value).toUpperCase();
	var theNewElementList = new Array();
	if(valueToTest != null && valueToTest.length > 0){
		var enabledItems = 0;
		for(var i=0;i<theTdArray.length;i++){
			
			var smartTdTmp = document.getElementById(theTdArray[i]);
			if(smartTdTmp.innerHTML.toUpperCase().indexOf(valueToTest) != -1){
				theNewElementList.push(smartTdTmp.innerHTML);
			}
		}
	}
	else{ // Enable all elements
		theNewElementList = smartEditTopicList;
	}
	document.getElementById("smartEditorWikiLinkPreview").className="smarteditButtonTDDisabled"+smartEditorIECssClass;
	document.getElementById("smartEditorWikiLinkInsert").className="smarteditButtonTDDisabled"+smartEditorIECssClass;
	smartEditInitAutoCompletion(theNewElementList, theElementToUpdate.id, false);
	theSelectedItemId = "smartTopic0";
	smartEditorSetSelectItemId(theSelectedItemId);
	smartEditShowAutocompletion();
}

// calcule le décalage à gauche
function calculateOffsetLeft(r){
  return calculateOffset(r,"offsetLeft");
}

// calcule le décalage vertical
function calculateOffsetTop(r){
  return calculateOffset(r,"offsetTop");
}

function calculateOffset(r,attr){
  var kb=0;
  while(r){
    kb+=r[attr];
    r=r.offsetParent;
  }
  return kb
}

// calcule la largeur du champ
function calculateWidth(){
  return document.getElementById("smartEditorInputTopic").offsetWidth-2*1;
}

function setCompleteDivSize(){
  if(smartEditAutoCompletionDiv){
	smartEditAutoCompletionDiv.style.position = "absolute";
	smartEditAutoCompletionDiv.style.backgroundColor = "white";
    smartEditAutoCompletionDiv.style.left=calculateOffsetLeft(document.getElementById("smartEditorInputTopic"))+"px";
    smartEditAutoCompletionDiv.style.top=calculateOffsetTop(document.getElementById("smartEditorInputTopic"))+document.getElementById("smartEditorInputTopic").offsetHeight-1+"px";
    smartEditAutoCompletionDiv.style.width=calculateWidth()+"px";
  }
}

function smartEditToggleAutocompletion(){  
	if(document.getElementById("smartEditAutoCompletionDivision")){
		if(document.getElementById("smartEditAutoCompletionDivision").style.display.indexOf("none") == 0){
			document.getElementById("smartEditAutoCompletionDivision").style.display = "";
			theAutoCompletionIsFocused = true;
			smartEditUpdateDataList();
		}
		else{
			document.getElementById("smartEditAutoCompletionDivision").style.display = "none";
			
			theAutoCompletionIsFocused = false;
		}
	}
}

function smartEditShowAutocompletion(){
	document.getElementById("smartEditAutoCompletionDivision").style.display = "";
	theAutoCompletionIsFocused = true;
	
}

function smartEditHideAutocompletion(){ 
	document.getElementById("smartEditAutoCompletionDivision").style.display = "none";
	theAutoCompletionIsFocused = false;
}

function smartEditorCloseWikiLinkRow(smartDataSource){
	smartEditHideAutocompletion();
	smartEditToggleInternalLink(smartDataSource);
}

function smartEditorPreviousOccurence(){ 
	var topicNum = theSelectedItemId.substring("smartTopic".length, theSelectedItemId.length);
	if(topicNum >= 1){
		topicNum--;
		var thePreviousOccId = "smartTopic"+topicNum;
		smartEditorUnsetSelectItemId();
		smartEditorSetSelectItemId(thePreviousOccId);
		theSelectedItemId = thePreviousOccId;
	}
	else{
		smartEditorSetSelectItemId(theSelectedItemId);
	}
}

function smartEditorNextOccurence(){
	var topicNum = theSelectedItemId.substring("smartTopic".length, theSelectedItemId.length);
	if(topicNum == null || topicNum == ""){
		topicNum = -1;
	}
	if(topicNum < (theTdArray.length-1)){
		topicNum++;
		var theNextOccId = "smartTopic"+topicNum;
		smartEditorUnsetSelectItemId();
		smartEditorSetSelectItemId(theNextOccId);
		theSelectedItemId = theNextOccId;
	}
	else{
		smartEditorSetSelectItemId(theSelectedItemId);
	}
}

function smartEditInsertWikiLink(){
	theAutoCompletionIsFocused = false;
	var theWebToInsert = "";
	if(selectedWeb.indexOf(wikismartCurrentWeb) == 0){
		theWebToInsert = "";
	}
	else{
		theWebToInsert = selectedWeb+".";
	}
	wikismartInsertSimpleTagButNotInit(theWebToInsert+selectedTopic);
}

function smartEditInsertWikiLinkAndInitialize(){
	theAutoCompletionIsFocused = false;
	var theWebToInsert = "";
	if(selectedWeb.indexOf(wikismartCurrentWeb) == 0){
		theWebToInsert = "";
	}
	else{
		theWebToInsert = selectedWeb+".";
	}
	wikismartInsertSimpleTag(theWebToInsert+selectedTopic);
}

function smartEditOpenPreview(){
	if(selectedWeb != null && selectedWeb.length > 0 && selectedTopic != null && selectedTopic.length > 0){
		var theLink = wikismartWikiHomeURL+"/"+selectedWeb+"."+selectedTopic+"?template=koalaprint";
		smartEditCreateGenericPreviewPopup(theLink);
	}
}