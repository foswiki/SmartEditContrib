/***************************
Copyright (C) 2006 Gaël Crova

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later version. 

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details. 

You should have received a copy of the GNU General Public License along with this program; if not, write to the Free Software Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
****************************/


var smartEditorStyles = new Array();
var smartEditorBoldButtons = new Array();
var smartEditorItalicButtons = new Array();
var smartEditorFormattedButtons = new Array();
var smartEditorBoldItalicButtons = new Array();
var smartEditorBulletListButtons = new Array();
var smartEditorNumListButtons = new Array();
var smartEditorExternalLinkButtons = new Array();
var smartEditorInternalLinkButtons = new Array();
var smartEditorIndentButtons = new Array();
var smartEditorOutdentButtons = new Array();
var smartEditorHRButtons = new Array();
var smartEditorNopButtons = new Array();
var smartEditorBRButtons = new Array();
var smartEditorInsert = new Array();
var smartEditorBoldButtons = new Array();
var smartEditorSearchButtons = new Array();
var smartEditorSearchNextButtons = new Array();
var smartEditorSearchPreviousButtons = new Array();
var smartEditorAutoFitButtons = new Array();
var smartEditorIncreaseButtons = new Array();
var smartEditorDecreaseButtons = new Array();

/* Sert vraiment*/
var smartEditorUndoButtons = new Array();
var smartEditorRedoButtons = new Array();
var smartEditUndoButtonEnabled = false;
var smartEditRedoButtonEnabled = false;

var rowSearch = "";
var smartEditorRowInternalLink = "";
var smartEditorRowExternalLink = "";

var smartLastExternalRowSource = "";
var smartLastInternalRowSource = "";
var smartLastSearchRowSource = "";

var smartExtendedStylesOpen = false;
var SmartEditInsertCommonStringOpen = false;
var SmartEditInsertColorOpen = false;
var SmartEditInsertSmileyOpen = false;


var smartExtendedStylesMouseOn = false;
var smartExtendedStylesMouseOnTable = false;
var smartExtendedStylesMouseOnTBody = false;
var smartExtendedStylesMouseOnTd = false;
var smartExtendedStylesMouseOnOnce = false;



function smartEditCreateTD(){
	var toreturn = document.createElement("TD");
	toreturn.noWrap = true;
	return toreturn;
}

function smartEditCreateOption(text, value, className){
	var toreturn = document.createElement("OPTION");
	toreturn.innerHTML = text;
	toreturn.value = value;
	toreturn.className = className+smartEditorIECssClass;
	return toreturn;
}

function smartEditCreateInsertRowData(text, value, className, id){
	var toreturn = document.createElement("TR");
	toreturn.className = "smarteditSelectOption"+smartEditorIECssClass;
	var theleftColumn = smartEditCreateTD();
	theleftColumn.className = "smarteditSelectOptionImg";
	theleftColumn.style.width = "20px";
	var thedataI = smartEditCreateTD();
	thedataI.innerHTML = text;
	smartEditApplyActionForInsertData(toreturn, value, id );
	toreturn.className = className+smartEditorIECssClass;
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		toreturn.onmouseover = function () {toreturn.className = "smarteditSelectOptionPressed"+smartEditorIECssClass;};
		toreturn.onmouseout = function () {toreturn.className = "smarteditSelectOption"+smartEditorIECssClass;};
	}
	toreturn.appendChild(theleftColumn);
	toreturn.appendChild(thedataI);
	return toreturn;
}

function smartEditApplyActionForInsertData(theButton, theValue, id){
	theButton.onclick = function (){	
		smartEditCloseInsert(id);
		wikismartInsertSimpleTagButNotInit(theValue);
	};
}

function smartEditGetBoldButton(){
	var myimg = document.createElement("IMG");
	myimg.src = wikismartScriptURL+"bold.gif";
	var thedata = smartEditCreateTD();
	thedata.title = "Insert bold tags";
	thedata.className = "smarteditButtonTD"+smartEditorIECssClass;	
	thedata.appendChild(myimg);
	smartEditorBoldButtons.push(thedata);
	thedata.onclick = function () {
		wikismartInsertBold();
	};
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		thedata.onmouseover = function () {thedata.className = "smarteditButtonTDPressed"+smartEditorIECssClass;};
		thedata.onmouseout = function () {thedata.className = "smarteditButtonTD"+smartEditorIECssClass;};
	}
	return thedata;
}

function smartEditGetSelectLineButton(){
	var myimg = document.createElement("IMG");
	myimg.src = wikismartScriptURL+"line.gif";
	var thedata = smartEditCreateTD();
	thedata.title = "Select whole line";
	thedata.className = "smarteditButtonTD"+smartEditorIECssClass;	
	thedata.appendChild(myimg);
	thedata.onclick = function () {
		wikismartSelectEntireLine();
	};
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		thedata.onmouseover = function () {thedata.className = "smarteditButtonTDPressed"+smartEditorIECssClass;};
		thedata.onmouseout = function () {thedata.className = "smarteditButtonTD"+smartEditorIECssClass;};
	}
	return thedata;
}

function smartEditGetInsertSmileyButton(){
	var myimg = document.createElement("IMG");
	myimg.src = wikismartScriptURL+"smiley.png";
	var thedata = smartEditCreateTD();
	thedata.title = "Insert an Icon";
	thedata.className = "smarteditButtonTD"+smartEditorIECssClass;	
	thedata.appendChild(myimg);
	thedata.onclick = function () {
		wikismartInitializeAllAttributesForIE();
		smartEditToggleSmileys(thedata);
		//wikismartDebug("OLA");
	};
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		thedata.onmouseover = function () {thedata.className = "smarteditButtonTDPressed"+smartEditorIECssClass;};
		thedata.onmouseout = function () {thedata.className = "smarteditButtonTD"+smartEditorIECssClass;};
	}
	return thedata;
}

function smartEditGetColorButton(){
	var myimg = document.createElement("IMG");
	myimg.src = wikismartScriptURL+"forecolor.gif";
	var thedata = smartEditCreateTD();
	thedata.title = "Choose and apply a text color";
	thedata.className = "smarteditButtonTD"+smartEditorIECssClass;	
	thedata.appendChild(myimg);
	thedata.onclick = function () {
		wikismartInitializeAllAttributesForIE();
		smartEditToggleColors(thedata);
	};
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		thedata.onmouseover = function () {thedata.className = "smarteditButtonTDPressed"+smartEditorIECssClass;};
		thedata.onmouseout = function () {thedata.className = "smarteditButtonTD"+smartEditorIECssClass;};
	}
	return thedata;
}

function smartEditorSetMouseFor(thedata){
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		thedata.onmouseover = function () {thedata.className = "smarteditButtonTDPressed"+smartEditorIECssClass;};
		thedata.onmouseout = function () {thedata.className = "smarteditButtonTD"+smartEditorIECssClass;};
	}
}

function smartEditRedoEnabled(value){
	if(smartEditorRedoButtons != null && smartEditorRedoButtons.length>0){
		smartEditRedoButtonEnabled = value;
		var theClassToSet = "smarteditButtonTD"+smartEditorIECssClass;
		if(!value){
			theClassToSet = "smarteditButtonTDDisabled"+smartEditorIECssClass;
		}
		for(var i=0;i<smartEditorRedoButtons.length;i++){
			smartEditorRedoButtons[i].className = theClassToSet;
			if(smartEditRedoButtonEnabled){
				smartEditorSetMouseFor(smartEditorRedoButtons[i]);
			}
			else{
				smartEditorRedoButtons[i].onmouseover = function (){};
				smartEditorRedoButtons[i].onmouseout = function (){};
			}
		}
	}
}

function smartEditGetExpandButton(){
	var myimg = document.createElement("IMG");
	myimg.src = wikismartScriptURL+"expand.gif";
	var thedata = smartEditCreateTD();
	thedata.title = "More styles";
	thedata.className = "smarteditExpandButton"+smartEditorIECssClass;
	thedata.appendChild(myimg);
	thedata.onclick = function () {
		smartEditToggleStyles(thedata);
	};
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		thedata.onmouseover = function () {thedata.className = "smarteditExpandButtonPressed"+smartEditorIECssClass;};
		thedata.onmouseout = function () {thedata.className = "smarteditExpandButton"+smartEditorIECssClass;};
	}
	return thedata;
}

function smartEditGetH1Row(){
	var myimg = document.createElement("IMG");
	myimg.src = wikismartScriptURL+"h1.gif";
	var theRowToReturn = document.createElement("TR");
	var thedata = smartEditCreateTD();
	var theleftColumn = smartEditCreateTD();
	theleftColumn.className = "smarteditSelectOptionImg";
	theRowToReturn.title = "Insert heading 1 style";
	thedata.innerHTML = " Heading 1";
	theRowToReturn.className = "smarteditSelectOption"+smartEditorIECssClass;	
	theleftColumn.appendChild(myimg);
	theRowToReturn.appendChild(theleftColumn);
	theRowToReturn.appendChild(thedata);
	theRowToReturn.onclick = function () {
		wikismartFormatText("---+ ");
		smartEditCloseStyles();
	};
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		theRowToReturn.onmouseover = function () {theRowToReturn.className = "smarteditSelectOptionPressed"+smartEditorIECssClass;};
		theRowToReturn.onmouseout = function () {theRowToReturn.className = "smarteditSelectOption"+smartEditorIECssClass;};
	}
	return theRowToReturn;
}

function smartEditGetH2Row(){
	var myimg = document.createElement("IMG");
	myimg.src = wikismartScriptURL+"h2.gif";
	var theRowToReturn = document.createElement("TR");
	var thedata = smartEditCreateTD();
	var theleftColumn = smartEditCreateTD();
	theleftColumn.className = "smarteditSelectOptionImg";
	theRowToReturn.title = "Insert heading 2 style";
	thedata.innerHTML = " Heading 2";
	theRowToReturn.className = "smarteditSelectOption"+smartEditorIECssClass;	
	theleftColumn.appendChild(myimg);
	theRowToReturn.appendChild(theleftColumn);
	theRowToReturn.appendChild(thedata);
	theRowToReturn.onclick = function () {
		wikismartFormatText("---++ ");
		smartEditCloseStyles();
	};
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		theRowToReturn.onmouseover = function () {theRowToReturn.className = "smarteditSelectOptionPressed"+smartEditorIECssClass;};
		theRowToReturn.onmouseout = function () {theRowToReturn.className = "smarteditSelectOption"+smartEditorIECssClass;};
	}
	return theRowToReturn;
}

function smartEditGetH3Row(){
	var myimg = document.createElement("IMG");
	myimg.src = wikismartScriptURL+"h3.gif";
	var theRowToReturn = document.createElement("TR");
	var thedata = smartEditCreateTD();
	var theleftColumn = smartEditCreateTD();
	theleftColumn.className = "smarteditSelectOptionImg";
	theRowToReturn.title = "Insert heading 3 style";
	thedata.innerHTML = " Heading 3";
	theRowToReturn.className = "smarteditSelectOption"+smartEditorIECssClass;	
	theleftColumn.appendChild(myimg);
	theRowToReturn.appendChild(theleftColumn);
	theRowToReturn.appendChild(thedata);
	theRowToReturn.onclick = function () {
		wikismartFormatText("---+++ ");
		smartEditCloseStyles();
	};
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		theRowToReturn.onmouseover = function () {theRowToReturn.className = "smarteditSelectOptionPressed"+smartEditorIECssClass;};
		theRowToReturn.onmouseout = function () {theRowToReturn.className = "smarteditSelectOption"+smartEditorIECssClass;};
	}
	return theRowToReturn;
}

function smartEditGetH4Row(){
	var myimg = document.createElement("IMG");
	myimg.src = wikismartScriptURL+"h4.gif";
	var theRowToReturn = document.createElement("TR");
	var thedata = smartEditCreateTD();
	var theleftColumn = smartEditCreateTD();
	theleftColumn.className = "smarteditSelectOptionImg";
	theRowToReturn.title = "Insert heading 4 style";
	thedata.innerHTML = " Heading 4";
	theRowToReturn.className = "smarteditSelectOption"+smartEditorIECssClass;	
	theleftColumn.appendChild(myimg);
	theRowToReturn.appendChild(theleftColumn);
	theRowToReturn.appendChild(thedata);
	theRowToReturn.onclick = function () {
		wikismartFormatText("---++++ ");
		smartEditCloseStyles();
	};
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		theRowToReturn.onmouseover = function () {theRowToReturn.className = "smarteditSelectOptionPressed"+smartEditorIECssClass;};
		theRowToReturn.onmouseout = function () {theRowToReturn.className = "smarteditSelectOption"+smartEditorIECssClass;};
	}
	return theRowToReturn;
}

function smartEditGetH5Row(){
	var myimg = document.createElement("IMG");
	myimg.src = wikismartScriptURL+"h5.gif";
	var theRowToReturn = document.createElement("TR");
	var thedata = smartEditCreateTD();
	var theleftColumn = smartEditCreateTD();
	theleftColumn.className = "smarteditSelectOptionImg";
	theRowToReturn.title = "Insert heading 5 style";
	thedata.innerHTML = " Heading 5";
	theRowToReturn.className = "smarteditSelectOption"+smartEditorIECssClass;	
	theleftColumn.appendChild(myimg);
	theRowToReturn.appendChild(theleftColumn);
	theRowToReturn.appendChild(thedata);
	theRowToReturn.onclick = function () {
		wikismartFormatText("---+++++ ");
		smartEditCloseStyles();
	};
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		theRowToReturn.onmouseover = function () {theRowToReturn.className = "smarteditSelectOptionPressed"+smartEditorIECssClass;};
		theRowToReturn.onmouseout = function () {theRowToReturn.className = "smarteditSelectOption"+smartEditorIECssClass;};
	}
	return theRowToReturn;
}

function smartEditGetH6Row(){
	var myimg = document.createElement("IMG");
	myimg.src = wikismartScriptURL+"h6.gif";
	var theRowToReturn = document.createElement("TR");
	var thedata = smartEditCreateTD();
	var theleftColumn = smartEditCreateTD();
	theleftColumn.className = "smarteditSelectOptionImg";
	theRowToReturn.title = "Insert heading 6 style";
	thedata.innerHTML = " Heading 6";
	theRowToReturn.className = "smarteditSelectOption"+smartEditorIECssClass;	
	theleftColumn.appendChild(myimg);
	theRowToReturn.appendChild(theleftColumn);
	theRowToReturn.appendChild(thedata);
	theRowToReturn.onclick = function () {
		wikismartFormatText("---++++++ ");
		smartEditCloseStyles();
	};
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		theRowToReturn.onmouseover = function () {theRowToReturn.className = "smarteditSelectOptionPressed"+smartEditorIECssClass;};
		theRowToReturn.onmouseout = function () {theRowToReturn.className = "smarteditSelectOption"+smartEditorIECssClass;};
	}
	return theRowToReturn;
}

function smartEditGetNormalButton(){
	var theRowToReturn = document.createElement("TR");
	var thedataIMG = smartEditCreateTD();
	var myimg = document.createElement("IMG");
	myimg.src = wikismartScriptURL+"normal.gif";
	thedataIMG.className = "smarteditSelectOptionImg";
	thedataIMG.appendChild(myimg);
	var thedata = smartEditCreateTD();
	thedata.innerHTML = "Normal";
	theRowToReturn.className = "smarteditSelectOption"+smartEditorIECssClass;
	thedata.noWrap = true;
	theRowToReturn.title = "Normal style";
	theRowToReturn.appendChild(thedataIMG);
	theRowToReturn.appendChild(thedata);
	theRowToReturn.onclick = function () {
		wikismartNormalizeFormat();
		smartEditCloseStyles();
	;};
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		theRowToReturn.onmouseover = function () {theRowToReturn.className = "smarteditSelectOptionPressed"+smartEditorIECssClass;};
		theRowToReturn.onmouseout = function () {theRowToReturn.className = "smarteditSelectOption"+smartEditorIECssClass;};
	}
	return theRowToReturn;
}

function smartEditGetVerbatimButton(){
	var theRowToReturn = document.createElement("TR");
	var thedataIMG = smartEditCreateTD();
	thedataIMG.className = "smarteditSelectOptionImg";
	var myimg = document.createElement("IMG");
	myimg.src = wikismartScriptURL+"verbatim.gif";
	thedataIMG.className = "smarteditSelectOptionImg";
	thedataIMG.appendChild(myimg);
	var thedata = smartEditCreateTD();
	theRowToReturn.title = "Insert verbatim style";
	thedata.innerHTML = "Verbatim";
	theRowToReturn.className = "smarteditSelectOption"+smartEditorIECssClass;
	thedata.noWrap = true;
	theRowToReturn.appendChild(thedataIMG);
	theRowToReturn.appendChild(thedata);
	theRowToReturn.onclick = function () {
		wikismartVerbatim();
		smartEditCloseStyles();
	};
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		theRowToReturn.onmouseover = function () {theRowToReturn.className = "smarteditSelectOptionPressed"+smartEditorIECssClass;};
		theRowToReturn.onmouseout = function () {theRowToReturn.className = "smarteditSelectOption"+smartEditorIECssClass;};
	}
	return theRowToReturn;
}

function smartEditGetBlockquoteButton(){
	var theRowToReturn = document.createElement("TR");
	var thedataIMG = smartEditCreateTD();
	thedataIMG.className = "smarteditSelectOptionImg";
	var myimg = document.createElement("IMG");
	myimg.src = wikismartScriptURL+"blockquote.gif";
	thedataIMG.className = "smarteditSelectOptionImg";
	thedataIMG.appendChild(myimg);
	var thedata = smartEditCreateTD();
	thedata.title = "Insert blockquote style";
	thedata.innerHTML = "Blockquote";
	theRowToReturn.className = "smarteditSelectOption"+smartEditorIECssClass;
	thedata.noWrap = true;
	theRowToReturn.appendChild(thedataIMG);
	theRowToReturn.appendChild(thedata);
	theRowToReturn.onclick = function () {
		wikismartBlockquote();
		smartEditCloseStyles();
	};
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		theRowToReturn.onmouseover = function () {theRowToReturn.className = "smarteditSelectOptionPressed"+smartEditorIECssClass;};
		theRowToReturn.onmouseout = function () {theRowToReturn.className = "smarteditSelectOption"+smartEditorIECssClass;};
	}
	return theRowToReturn;
}


function smartEditCreateExpandStyleDiv(source){
	var theDivToShow = smartEditorGetDynamicDivision(source);
	theDivToShow.id = "SmartEditExtendedStyles";
	theDivToShow.className = "SmartEditExtendedStyles"+smartEditorIECssClass;
	var theTable = document.createElement("TABLE");
	var theTBody = document.createElement("TBODY");
	theTable.cellSpacing = "0";

	theTBody.appendChild(smartEditGetNormalButton());
	
	var theRowSeparator = document.createElement("TR");
	var theTDHR = document.createElement("TD");
	theTDHR.innerHTML = "<hr />";
	theTDHR.style.height = "3px";
	
	var emptTD = document.createElement("TD");
	emptTD.className = "smarteditSelectOptionImg";
	
	theRowSeparator.appendChild(emptTD);
	theRowSeparator.appendChild(theTDHR);
	theTBody.appendChild(theRowSeparator);
	
	theTBody.appendChild(smartEditGetH1Row());
	theTBody.appendChild(smartEditGetH2Row());
	theTBody.appendChild(smartEditGetH3Row());
	
	theTBody.appendChild(smartEditGetH4Row());
	theTBody.appendChild(smartEditGetH5Row());
	theTBody.appendChild(smartEditGetH6Row());
	
	var theRowSeparator2 = document.createElement("TR");
	var theTDHR2 = document.createElement("TD");
	theTDHR2.innerHTML = "<hr />";
	theTDHR2.style.height = "3px";

	var emptTD2 = document.createElement("TD");
	emptTD2.className = "smarteditSelectOptionImg";
	theRowSeparator2.appendChild(emptTD2);
	theRowSeparator2.appendChild(theTDHR2);
	theTBody.appendChild(theRowSeparator2);
	
	theTBody.appendChild(smartEditGetVerbatimButton());
	
	theTBody.appendChild(smartEditGetBlockquoteButton());
	
	theTable.appendChild(theTBody);
	theDivToShow.appendChild(theTable);
	smartExtendedStylesOpen = true;
	//document.body.appendChild(theDivToShow);
	wikismartTextarea.parentNode.appendChild(theDivToShow);
	
}

function smartEditToggleStyles(src){
	if(src){
		if(smartExtendedStylesOpen){ 
			var theDivToClose = document.getElementById("SmartEditExtendedStyles");
			if(theDivToClose != null){
				theDivToClose.parentNode.removeChild(theDivToClose);
				smartExtendedStylesOpen = false;
				smartExtendedStylesMouseOn = false;
			}
		}
		else{
			smartEditCreateExpandStyleDiv(src);
			if(SmartEditInsertCommonStringOpen){
				smartEditToggleInsert(); 
			}
			if(SmartEditInsertColorOpen){
				smartEditToggleColors();
			}
			if(SmartEditInsertSmileyOpen){
				smartEditToggleSmileys();
			}
		}
	}
	else{
		if(smartExtendedStylesOpen){
			var theDivToClose = document.getElementById("SmartEditExtendedStyles");
			if(theDivToClose != null){
				theDivToClose.parentNode.removeChild(theDivToClose);
				smartExtendedStylesOpen = false;
				smartExtendedStylesMouseOn = false;
			}
		}
	}
}

function smartEditCloseStyles(){
	var theDivToClose = document.getElementById("SmartEditExtendedStyles");
	theDivToClose.parentNode.removeChild(theDivToClose);
	smartExtendedStylesOpen = false;
	smartExtendedStylesMouseOn = false;
	wikismartTextarea.focus();
}

function smartEditGetItalicButton(){
	var myimg = document.createElement("IMG");
	myimg.src = wikismartScriptURL+"italic.gif";
	var thedata = smartEditCreateTD();
	thedata.title = "Insert italic tags";
	thedata.className = "smarteditButtonTD"+smartEditorIECssClass;
	thedata.appendChild(myimg);
	thedata.onclick = function () {
		wikismartInsertItalic();
		
	};
	smartEditorItalicButtons.push(thedata);
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		thedata.onmouseover = function () {thedata.className = "smarteditButtonTDPressed"+smartEditorIECssClass;};
		thedata.onmouseout = function () {thedata.className = "smarteditButtonTD"+smartEditorIECssClass;};
	}
	return thedata;
}

function smartEditGetFormattedButton(){
	var myimg = document.createElement("IMG");
	myimg.src = wikismartScriptURL+"code.png";
	var thedata = smartEditCreateTD();
	thedata.title = "Insert formatted - aka typewriter, monospaced font - tags";
	thedata.className = "smarteditButtonTD"+smartEditorIECssClass;
	thedata.appendChild(myimg);
	smartEditorFormattedButtons.push(thedata);
	thedata.onclick = function () {
		wikismartInsertFormatted();
		
	};
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		thedata.onmouseover = function () {thedata.className = "smarteditButtonTDPressed"+smartEditorIECssClass;};
		thedata.onmouseout = function () {thedata.className = "smarteditButtonTD"+smartEditorIECssClass;};
	}
	return thedata;
}

function smartEditGetBoldItalicButton(){
	var myimg = document.createElement("IMG");
	myimg.src = wikismartScriptURL+"boldItalic.gif";
	var thedata = smartEditCreateTD();
	thedata.className = "smarteditButtonTD"+smartEditorIECssClass;
	thedata.title = "Insert bold italic tags";
	thedata.appendChild(myimg);
	smartEditorBoldItalicButtons.push(thedata);
	thedata.onclick = function () {
		wikismartInsertBoldItalic();
		
	};
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		thedata.onmouseover = function () {thedata.className = "smarteditButtonTDPressed"+smartEditorIECssClass;};
		thedata.onmouseout = function () {thedata.className = "smarteditButtonTD"+smartEditorIECssClass;};
	}
	return thedata;
}

function smartEditGetBulletListButton(){
	var myimg = document.createElement("IMG");
	myimg.src = wikismartScriptURL+"bullist.gif";
	var thedata = smartEditCreateTD();
	thedata.title = "Insert bullet list";
	thedata.className = "smarteditButtonTD"+smartEditorIECssClass;
	thedata.appendChild(myimg);
	smartEditorBulletListButtons.push(thedata);
	thedata.onclick = function () {
		wikismartInsertBullet();
		
	};
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		thedata.onmouseover = function () {thedata.className = "smarteditButtonTDPressed"+smartEditorIECssClass;};
		thedata.onmouseout = function () {thedata.className = "smarteditButtonTD"+smartEditorIECssClass;};
	}
	return thedata;
}

function smartEditGetNumListButton(){
	var myimg = document.createElement("IMG");
	myimg.src = wikismartScriptURL+"numlist.gif";
	var thedata = smartEditCreateTD();
	thedata.title = "Insert numered list";
	thedata.className = "smarteditButtonTD"+smartEditorIECssClass;
	thedata.appendChild(myimg);
	smartEditorNumListButtons.push(thedata);
	thedata.onclick = function () {
		wikismartInsertNumList();
		
	};
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		thedata.onmouseover = function () {thedata.className = "smarteditButtonTDPressed"+smartEditorIECssClass;};
		thedata.onmouseout = function () {thedata.className = "smarteditButtonTD"+smartEditorIECssClass;};
	}
	return thedata;
}

function smartEditGetExternalLinkButton(){
	var myimg = document.createElement("IMG");
	myimg.src = wikismartScriptURL+"exthyperlink.png";
	var thedata = smartEditCreateTD();
	thedata.title = "Insert external web link";
	thedata.className = "smarteditButtonTD"+smartEditorIECssClass;
	thedata.appendChild(myimg);
	smartEditorExternalLinkButtons.push(thedata);
	thedata.onclick = function () {
		wikismartInitializeAllAttributesForIE();
		smartEditToggleExternalLink(thedata);
	};
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		thedata.onmouseover = function () {thedata.className = "smarteditButtonTDPressed"+smartEditorIECssClass;};
		thedata.onmouseout = function () {thedata.className = "smarteditButtonTD"+smartEditorIECssClass;};
	}
	return thedata;
}

function smartEditGetInternalLinkButton(){
	var myimg = document.createElement("IMG");
	myimg.src = wikismartScriptURL+"wikilink.png";
	var thedata = smartEditCreateTD();
	thedata.title = "Insert a link to a wiki page";
	thedata.className = "smarteditButtonTD"+smartEditorIECssClass;
	thedata.appendChild(myimg);
	smartEditorInternalLinkButtons.push(thedata);
	thedata.onclick = function () {
		wikismartInitializeAllAttributesForIE();
		smartEditToggleInternalLink(thedata);
	};
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		thedata.onmouseover = function () {thedata.className = "smarteditButtonTDPressed"+smartEditorIECssClass;};
		thedata.onmouseout = function () {thedata.className = "smarteditButtonTD"+smartEditorIECssClass;};
	}
	return thedata;
}

function smartEditGetIndentButton(){
	var myimg = document.createElement("IMG");
	myimg.src = wikismartScriptURL+"indent.gif";
	var thedata = smartEditCreateTD();
	thedata.title = "Indent text";
	thedata.className = "smarteditButtonTD"+smartEditorIECssClass;
	thedata.appendChild(myimg);
	smartEditorIndentButtons.push(thedata);
	thedata.onclick = function () {
		wikismartIndent();
		
	};
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		thedata.onmouseover = function () {thedata.className = "smarteditButtonTDPressed"+smartEditorIECssClass;};
		thedata.onmouseout = function () {thedata.className = "smarteditButtonTD"+smartEditorIECssClass;};
	}
	return thedata;
}

function smartEditGetOutdentButton(){
	var myimg = document.createElement("IMG");
	myimg.src = wikismartScriptURL+"outdent.gif";
	var thedata = smartEditCreateTD();
	thedata.title = "Outdent text";
	thedata.className = "smarteditButtonTD"+smartEditorIECssClass;
	thedata.appendChild(myimg);
	smartEditorOutdentButtons.push(thedata);
	thedata.onclick = function () {
		wikismartOutdent();
		
	};
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		thedata.onmouseover = function () {thedata.className = "smarteditButtonTDPressed"+smartEditorIECssClass;};
		thedata.onmouseout = function () {thedata.className = "smarteditButtonTD"+smartEditorIECssClass;};
	}
	return thedata;
}

function smartEditGetHRButton(){
	var myimg = document.createElement("IMG");
	myimg.src = wikismartScriptURL+"hr.gif";
	var thedata = smartEditCreateTD();
	thedata.title = "Insert horizontal rule";
	thedata.className = "smarteditButtonTD"+smartEditorIECssClass;
	thedata.appendChild(myimg);
	smartEditorHRButtons.push(thedata);
	thedata.onclick = function () {
		wikismartInsertHRTag();
		
	};
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		thedata.onmouseover = function () {thedata.className = "smarteditButtonTDPressed"+smartEditorIECssClass;};
		thedata.onmouseout = function () {thedata.className = "smarteditButtonTD"+smartEditorIECssClass;};
	}
	return thedata;
}

function smartEditGetBRButton(){
	var myimg = document.createElement("IMG");
	myimg.src = wikismartScriptURL+"br.gif";
	myimg.width = "30";
	myimg.height = "20";
	var thedata = smartEditCreateTD();
	thedata.className = "smarteditButtonTD"+smartEditorIECssClass;
	thedata.title = "Insert BR html tag, to force a line break";
	thedata.appendChild(myimg);
	smartEditorBRButtons.push(thedata);
	thedata.onclick = function () {
		wikismartInsertSimpleTag("<br />");
		
	};
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		thedata.onmouseover = function () {thedata.className = "smarteditButtonTDPressed"+smartEditorIECssClass;};
		thedata.onmouseout = function () {thedata.className = "smarteditButtonTD"+smartEditorIECssClass;};
	}
	return thedata;
}

function smartEditGetNopButton(){
	var myimg = document.createElement("IMG");
	myimg.src = wikismartScriptURL+"nop.png";
	var thedata = smartEditCreateTD();
	thedata.className = "smarteditButtonTD"+smartEditorIECssClass;
	thedata.title = "Insert NOP tag to protect wiki markup from expansion";
	thedata.appendChild(myimg);
	thedata.onclick = function () {
		wikismartNop();
		
	};
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		thedata.onmouseover = function () {thedata.className = "smarteditButtonTDPressed"+smartEditorIECssClass;};
		thedata.onmouseout = function () {thedata.className = "smarteditButtonTD"+smartEditorIECssClass;};
	}
	return thedata;
}

function smartEditGetSearchButton(){
	var myimg = document.createElement("IMG");
	myimg.src = wikismartScriptURL+"loupe.gif";
	var thedata = smartEditCreateTD();
	thedata.innerHTML = "Search";
	thedata.className = "smarteditButtonTD"+smartEditorIECssClass;
	thedata.title = "Search text";
	thedata.appendChild(myimg);
	thedata.onclick = function () {smartEditToggleSearch(thedata);};
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		thedata.onmouseover = function () {thedata.className = "smarteditButtonTDPressed"+smartEditorIECssClass;};
		thedata.onmouseout = function () {thedata.className = "smarteditButtonTD"+smartEditorIECssClass;};
	}
	return thedata;
}

function smartEditGetHelpButton(){
	var myimg = document.createElement("IMG");
	myimg.src = wikismartScriptURL+"help.gif";
	var thedata = smartEditCreateTD();

	thedata.className = "smarteditButtonTD"+smartEditorIECssClass;
	thedata.title = "Help about this editor";
	thedata.appendChild(myimg);
	thedata.onclick = function () {
		smartEditOpenHelpDiv();
		
	;};
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		thedata.onmouseover = function () {thedata.className = "smarteditButtonTDPressed"+smartEditorIECssClass;};
		thedata.onmouseout = function () {thedata.className = "smarteditButtonTD"+smartEditorIECssClass;};
	}
	return thedata;
}

// SmartEditContrib

function smartEditOpenHelpDiv(){
	var scw = (screen.width / 2);
	var sch = (screen.height / 2);
	scw = scw - 400;
	sch = sch - 300;
	
	var myAdd = wikismartWikiHomeURL+"/System/SmartEditContribHelp";
	
	var newpage=open(myAdd,'popup','width=800,height=600,toolbar=no,scrollbars=yes,resizable=yes,left='+scw+',top='+sch+'');
	newpage.document.close();
}

function smartEditCloseHelp(){
	var divTC = document.getElementById("SmartEditorHelpDivision");
	if(divTC){
		divTC.parentNode.removeChild(divTC);
	}
}

function smartEditGetPreviewButton(){

	var thedata = smartEditCreateTD();
	thedata.innerHTML = "<img src=\""+wikismartScriptURL+"preview.gif\"> Preview";
	thedata.className = "smarteditButtonTDDisabled"+smartEditorIECssClass;
	thedata.title = "Preview the selected topic";

	thedata.id = "smartEditorWikiLinkPreview";
	thedata.noWrap = true;
	thedata.style.width = "10%"; //80px
	thedata.style.textAlign = "center";

	thedata.onclick = function () {smartEditOpenPreview();};
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		thedata.onmouseover = function () {thedata.className = "smarteditButtonTDPressed"+smartEditorIECssClass;};
		thedata.onmouseout = function () {thedata.className = "smarteditButtonTD"+smartEditorIECssClass;};
	}
	return thedata;
}

function smartEditGetPreviewButtonForExternalLink(){

	var thedata = smartEditCreateTD();
	thedata.innerHTML = "<img src=\""+wikismartScriptURL+"preview.gif\"> Preview";
	thedata.className = "smarteditButtonTD"+smartEditorIECssClass;
	thedata.title = "Preview the given link into a new page";

	thedata.id = "smartEditorExternalLinkPreview";
	thedata.style.textAlign = "center";
	thedata.style.width = "8%"; // 200px

	thedata.onclick = function () {smartEditOpenPreviewForExternalLink();};
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		thedata.onmouseover = function () {thedata.className = "smarteditButtonTDPressed"+smartEditorIECssClass;};
		thedata.onmouseout = function () {thedata.className = "smarteditButtonTD"+smartEditorIECssClass;};
	}
	return thedata;
}

function smartEditGetOkButtonForInsertWikiLink(){

	var thedata = smartEditCreateTD();
	thedata.innerHTML = "<img src=\""+wikismartScriptURL+"ok.gif\"> Insert link";
	thedata.className = "smarteditButtonTDDisabled"+smartEditorIECssClass;
	thedata.title = "Insert a link to the selected topic";
	thedata.noWrap = true;

	thedata.id = "smartEditorWikiLinkInsert";
	thedata.style.textAlign = "center";
	thedata.style.width = "12%"; //110px

	thedata.onclick = function () {
		if(smartEditFirstWikiLink){
			smartEditInsertWikiLink();
			smartEditFirstWikiLink = false;
		}
		else{
			smartEditInsertWikiLinkAndInitialize();
		}
	};
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		thedata.onmouseover = function () {thedata.className = "smarteditButtonTDPressed"+smartEditorIECssClass;};
		thedata.onmouseout = function () {thedata.className = "smarteditButtonTD"+smartEditorIECssClass;};
	}
	return thedata;
}

function smartEditGetOkButtonForInsertExternalLink(){

	var thedata = smartEditCreateTD();
	thedata.innerHTML = "<img src=\""+wikismartScriptURL+"ok.gif\"> Insert link";
	thedata.className = "smarteditButtonTD"+smartEditorIECssClass;
	thedata.title = "Insert this link";

	thedata.style.textAlign = "center";
	thedata.style.width = "10%"; // 200px
	thedata.noWrap = true;

	thedata.onclick = function () {
		smartEditorInsertExternalLinkCall();
	};
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		thedata.onmouseover = function () {thedata.className = "smarteditButtonTDPressed"+smartEditorIECssClass;};
		thedata.onmouseout = function () {thedata.className = "smarteditButtonTD"+smartEditorIECssClass;};
	}
	return thedata;
}

function smartEditGetNextOccurenceButton(){
	var myimg = "<img src=\""+wikismartScriptURL+"testn.gif\">";
	var thedata = smartEditCreateTD();
	thedata.innerHTML = myimg+" Next occurence";
	thedata.className = "smarteditButtonTDDisabled"+smartEditorIECssClass;
	thedata.title = "Search text";
	thedata.align = "center";
	thedata.id = "smartEditSearchNextButton";

	thedata.noWrap = true;
	thedata.style.width = "15%"; // 160px
	thedata.onclick = function () {wikismartHighLightNextOccurenceFromTop();};
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		smartEditorChangeClassNameForIE(thedata);
	}
	return thedata;
}

function smartEditorChangeClassNameForIE(thedata){
	if(thedata.className.indexOf("Disabled") == -1){
		thedata.onmouseover = function () {thedata.className = "smarteditButtonTDPressed"+smartEditorIECssClass;};
		thedata.onmouseout = function () {thedata.className = "smarteditButtonTD"+smartEditorIECssClass;};
	}
}

function smartEditGetPreviousOccurenceButton(){
	var myimg = document.createElement("IMG");
	myimg.src = wikismartScriptURL+"testp.gif";
	var thedata = smartEditCreateTD();
	thedata.innerHTML = "Previous occurence";
	thedata.className = "smarteditButtonTDDisabled"+smartEditorIECssClass;
	thedata.id = "smartEditSearchPreviousButton";
	thedata.title = "Search text";
	thedata.appendChild(myimg);

	thedata.noWrap = true;
	thedata.style.width = "15%"; // 170px
	thedata.align = "center";
	thedata.onclick = function () {wikismartHighLightNextOccurenceFromBottom();};
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		smartEditorChangeClassNameForIE(thedata);
	}
	return thedata;
}


function smartEditGetCloseButtonForWikiLink(){

	var thedata = smartEditCreateTD();
	thedata.innerHTML = "Close <img src=\""+wikismartScriptURL+"close.gif\">";
	thedata.className = "smarteditButtonTD"+smartEditorIECssClass;
	thedata.title = "Close wiki link chooser";
	thedata.noWrap = true;
	thedata.align = "center";
	thedata.style.textAlign = "center";
	thedata.style.width = "10%"; //60px

	thedata.onclick = function () {smartEditCloseInternalLink(thedata);};
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		thedata.onmouseover = function () {thedata.className = "smarteditButtonTDPressed"+smartEditorIECssClass;};
		thedata.onmouseout = function () {thedata.className = "smarteditButtonTD"+smartEditorIECssClass;};
	}
	return thedata;
}

function smartEditGetCloseButtonForExternalLink(){

	var thedata = smartEditCreateTD();
	thedata.innerHTML = "Close <img src=\""+wikismartScriptURL+"close.gif\">";
	thedata.className = "smarteditButtonTD"+smartEditorIECssClass;
	thedata.title = "Close external link chooser";
	thedata.noWrap = true;
	thedata.align = "center";
	thedata.style.textAlign = "center";
	thedata.style.width = "10%"; // 60px

	thedata.onclick = function () {smartEditCloseExternalLink(thedata);};
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		thedata.onmouseover = function () {thedata.className = "smarteditButtonTDPressed"+smartEditorIECssClass;};
		thedata.onmouseout = function () {thedata.className = "smarteditButtonTD"+smartEditorIECssClass;};
	}
	return thedata;
}

function smartEditGetCloseButton(){

	var thedata = smartEditCreateTD();
	thedata.innerHTML = "Close <img src=\""+wikismartScriptURL+"close.gif\">";
	thedata.className = "smarteditButtonTD"+smartEditorIECssClass;
	thedata.title = "Close search";
	thedata.align = "center";
	thedata.style.textAlign = "center";
	thedata.noWrap = true;
	thedata.style.width = "10%"; // 60px
	thedata.onclick = function () {smartEditCloseSearchRow(thedata);};
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		thedata.onmouseover = function () {thedata.className = "smarteditButtonTDPressed"+smartEditorIECssClass;};
		thedata.onmouseout = function () {thedata.className = "smarteditButtonTD"+smartEditorIECssClass;};
	}
	return thedata;
}

function smartEditGetAutoFitButton(){
	var thedata = smartEditCreateTD();
	thedata.innerHTML = "Auto fit";
	thedata.className = "smarteditButtonTD"+smartEditorIECssClass;
	thedata.title = "Auto fit: adjust the editing window height to the contents (toggle)";
	thedata.onclick = function () {smartEditAutoFit();};
	smartEditorAutoFitButtons.push(thedata);
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		thedata.onmouseover = function () {thedata.className = "smarteditButtonTDPressed"+smartEditorIECssClass;};
		thedata.onmouseout = function () {thedata.className = "smarteditButtonTD"+smartEditorIECssClass;};
	}
	return thedata;
}

function smartEditGetIncreaseHeightButton(){
	var myimg = document.createElement("IMG");
	myimg.src = wikismartScriptURL+"down.jpg";
	var thedata = smartEditCreateTD();
	thedata.className = "smarteditButtonTD"+smartEditorIECssClass;
	thedata.title = "Increase editing window height";
	thedata.appendChild(myimg);
	thedata.onclick = function () {smartEditIncreaseHeight();};
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		thedata.onmouseover = function () {thedata.className = "smarteditButtonTDPressed"+smartEditorIECssClass;};
		thedata.onmouseout = function () {thedata.className = "smarteditButtonTD"+smartEditorIECssClass;};
	}
	return thedata;
}

function smartEditGetDecreaseHeightButton(){
	var myimg = document.createElement("IMG");
	myimg.src = wikismartScriptURL+"up.jpg";
	var thedata = smartEditCreateTD();
	thedata.className = "smarteditButtonTD"+smartEditorIECssClass;
	thedata.title = "Decrease editing window height";
	thedata.appendChild(myimg);
	thedata.onclick = function () {smartEditDecreaseHeight();};
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		thedata.onmouseover = function () {thedata.className = "smarteditButtonTDPressed"+smartEditorIECssClass;};
		thedata.onmouseout = function () {thedata.className = "smarteditButtonTD"+smartEditorIECssClass;};
	}
	return thedata;
}

function smartEditGetSeparator(){
	var myimg = document.createElement("IMG");
	myimg.src = wikismartScriptURL+"separator.gif";
	var thedata = smartEditCreateTD();
	thedata.className = "smarteditSeparatorTD"+smartEditorIECssClass;
	thedata.appendChild(myimg);
	return thedata;
}

function smartEditGetStyles(){
	var thedata = smartEditCreateTD();
	thedata.title = "Set text style";
	thedata.innerHTML = "<img src=\""+wikismartScriptURL+"styles.gif"+"\">Styles<img src=\""+wikismartScriptURL+"expand.gif\">";
	thedata.className = "smarteditButtonTD"+smartEditorIECssClass;
	thedata.onclick = function (){
		wikismartInitializeAllAttributesForIE();
		smartEditToggleStyles(thedata);
	};
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		thedata.onmouseover = function () {thedata.className = "smarteditButtonTDPressed"+smartEditorIECssClass;};
		thedata.onmouseout = function () {thedata.className = "smarteditButtonTD"+smartEditorIECssClass;};
	}

	return thedata;
}

function smartEditGetCheatTD(){
	var newTD = document.createElement("TD");
	var smartCheatInput = document.createElement("INPUT");
	smartCheatInput.type = "TEXT";
	smartCheatInput.style.width = "0";
	smartCheatInput.style.margin = "-2px";
	smartCheatInput.style.border = "1px solid #e9eaf2";
	smartCheatInput.style.fontSize = "0.1em";
	smartCheatInput.style.height = "0";
	//smartCheatInput.style.backgroundColor = "#e9eaf2";
	//smartCheatInput.style.color = "#e9eaf2";
	newTD.appendChild(smartCheatInput);
	newTD.onfocus = function(){wikismartTextarea.focus();};
	return newTD;
}

function wikismartGetInsertButton(){
	var thedata = smartEditCreateTD();
	thedata.title = "Insert a commonly used wiki constructs"; 
	var test = "<img src=\""+wikismartScriptURL+"strings.png\">";
	thedata.innerHTML = test;
	thedata.className = "smarteditButtonTD"+smartEditorIECssClass;	
	thedata.onclick = function () {
		wikismartInitializeAllAttributesForIE();
		smartEditToggleInsert(thedata);
	};
	if(!is_firefox && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)){
		thedata.onmouseover = function () {
			thedata.className = "smarteditButtonTDPressed"+smartEditorIECssClass;
		};
		thedata.onmouseout = function () {thedata.className = "smarteditButtonTD"+smartEditorIECssClass;};
	}
	return thedata;
}

function smartEditorGetSearchRow(){
	rowSearch = document.createElement("TR");
	rowSearch.style.display = "none";
	var thedata = smartEditCreateTD();
	wikismartTopSearch = document.createElement("INPUT");
	wikismartTopSearch.type = "text";
	wikismartTopSearch.size = "35";
	thedata.noWrap = true;
	thedata.style.width = "20%"; // 200px
	wikismartTopSearch.className = "wikismartSearch"+smartEditorIECssClass;
	wikismartTopSearch.onfocus = function () {wikismartTopSearchHasFocus = !wikismartTopSearchHasFocus;};
	wikismartTopSearch.onblur = function () {wikismartTopSearchHasFocus = !wikismartTopSearchHasFocus;};
	thedata.appendChild(wikismartTopSearch);
	thedata.className = "smartEditSearchLineInvisible"+smartEditorIECssClass;
	var thedata2 = document.createElement("TD");
	thedata2.innerHTML = "Search for : ";
	thedata2.noWrap = true;
	thedata2.style.width = "10%"; // 80px
	var smartEditEmpty = smartEditCreateTD();
	smartEditEmpty.id = "smartEditSearchInfoTD";
	if(is_opera || is_firefox){
		smartEditEmpty.style.width = "80%";
	}
	else{
		smartEditEmpty.style.width = "40%";
	}
	smartEditEmpty.className = "smartEditSearchLineInvisible"+smartEditorIECssClass;
	rowSearch.appendChild(thedata2);
	rowSearch.appendChild(thedata);
	rowSearch.appendChild(smartEditGetNextOccurenceButton());
	rowSearch.appendChild(smartEditGetPreviousOccurenceButton());
	rowSearch.appendChild(smartEditEmpty);
	rowSearch.appendChild(smartEditGetCloseButton());
	if (is_firefox){ // I don't know why but there is a bug with SHIFT-TAB in IE
		rowSearch.appendChild(smartEditGetCheatTD()); 
	}
	var theRowTable = document.createElement("TABLE");
	theRowTable.cellSpacing = "0";
	var theRowTbody = document.createElement("TBODY");
	theRowTable.appendChild(theRowTbody);
	theRowTbody.appendChild(rowSearch);
	var thesmartEditorRowSearch = document.createElement("TR");
	thesmartEditorRowSearch.id = "wikismartSearchTableRow";
	var thesmartEditorRowSearchTD = document.createElement("TD");
	if(is_firefox){
		thesmartEditorRowSearchTD.colSpan = "35";
	}
	else{
		thesmartEditorRowSearchTD.colSpan = "33";
	}
	thesmartEditorRowSearchTD.appendChild(theRowTable);
	thesmartEditorRowSearch.appendChild(thesmartEditorRowSearchTD);
	thesmartEditorRowSearch.className = "wikismartSearchRow"+smartEditorIECssClass;
	//thesmartEditorRowSearch.style.width = "100%";
	theRowTable.style.textAlign = "left";
	
	return thesmartEditorRowSearch;
}

function smartEditorGetWikiLinkRow(){		
	smartEditorRowInternalLink = document.createElement("TR");
	smartEditorRowInternalLink.style.display = "none";
	smartEditorRowInternalLink.className = "smartEditorRowInternalLink"+smartEditorIECssClass;
	if (is_firefox){ // I don't know why but there is a bug with SHIFT-TAB in IE
		smartEditorRowInternalLink.appendChild(smartEditGetCheatTD()); 
	}
	var tdSelectWeb = document.createElement("TD");
	tdSelectWeb.id = "smarteditorWebChoice";
	tdSelectWeb.className = "smarteditorWebChoice"+smartEditorIECssClass;
	tdSelectWeb.style.width = "16%"; // 200px
	tdSelectWeb.padding = "0px";
	tdSelectWeb.noWrap = true;
	//tdSelectWeb.style.backgroundColor = "blue";
	smartEditorRowInternalLink.appendChild(tdSelectWeb);
	var tdSelectWebTopic2 = document.createElement("TD");
	tdSelectWebTopic2.noWrap = true;
	tdSelectWebTopic2.className = "smarteditorWebChoice"+smartEditorIECssClass;
	tdSelectWebTopic2.innerHTML = "Search for topic :";
	tdSelectWebTopic2.style.width = "10%"; //110px
	var tdSelectWebTopic = document.createElement("TD");
	tdSelectWebTopic.className = "smarteditorWebChoice"+smartEditorIECssClass;
	tdSelectWebTopic.id = "tdSelectWebTopic";
	tdSelectWebTopic.style.width = "50px";
	var AutoInputTopic = document.createElement("INPUT");
	AutoInputTopic.className = "smarteditorWebChoice"+smartEditorIECssClass;
	AutoInputTopic.id = "smartEditorInputTopic";
	AutoInputTopic.style.display = "none";
	AutoInputTopic.type = "TEXT";
	AutoInputTopic.size = "30";
	tdSelectWebTopic.style.width = "18%"; //230px
	tdSelectWebTopic.appendChild(AutoInputTopic);
	var theSep = smartEditGetSeparator();
	theSep.style.width = "5px";
	smartEditorRowInternalLink.appendChild(theSep);
	smartEditorRowInternalLink.appendChild(tdSelectWebTopic2);
	smartEditorRowInternalLink.appendChild(tdSelectWebTopic);
	smartEditorRowInternalLink.appendChild(theSep.cloneNode(true));
	smartEditorRowInternalLink.appendChild(smartEditGetPreviewButton());
	smartEditorRowInternalLink.appendChild(theSep.cloneNode(true));
	smartEditorRowInternalLink.appendChild(smartEditGetOkButtonForInsertWikiLink());
	var smartEditEmpty = smartEditCreateTD();
	if (is_firefox){
		smartEditEmpty.style.width = "50%";
	}
	else{
		smartEditEmpty.style.width = "20%";
	}
	
	//smartEditEmpty.style.backgroundColor = "red";
	smartEditorRowInternalLink.appendChild(smartEditEmpty);
	smartEditorRowInternalLink.appendChild(smartEditGetCloseButtonForWikiLink());
	if (is_firefox){ // I don't know why but there is a bug with SHIFT-TAB in IE
		smartEditorRowInternalLink.appendChild(smartEditGetCheatTD()); 
	}
	var theRowTable = document.createElement("TABLE");
	//theRowTable.style.width = "100%";
	theRowTable.cellSpacing = "0";
	//theRowTable.style.display = "inline";
	var theRowTbody = document.createElement("TBODY");
	theRowTable.appendChild(theRowTbody);
	theRowTbody.appendChild(smartEditorRowInternalLink);
	var thesmartEditorRowInternalLink = document.createElement("TR");
	//thesmartEditorRowInternalLink.style.align = "left";
	thesmartEditorRowInternalLink.id = "smartEditorRowInternalLink";
	var thesmartEditorRowInternalLinkTD = document.createElement("TD");
	if(is_firefox){
		thesmartEditorRowInternalLinkTD.colSpan = "35";
	}
	else{
		thesmartEditorRowInternalLinkTD.colSpan = "33";
	}
	thesmartEditorRowInternalLinkTD.appendChild(theRowTable);
	thesmartEditorRowInternalLink.appendChild(thesmartEditorRowInternalLinkTD);
	thesmartEditorRowInternalLink.className = "smartEditorRowInternalLink"+smartEditorIECssClass;
	
	return thesmartEditorRowInternalLink;
}

function smartEditorGetExternalLinkRow(){		
	smartEditorRowExternalLink = document.createElement("TR");
	smartEditorRowExternalLink.style.display = "none";
	smartEditorRowExternalLink.className = "smartEditorRowInternalLink"+smartEditorIECssClass;
	
	if (is_firefox){ // I don't know why but there is a bug with SHIFT-TAB in IE
		smartEditorRowExternalLink.appendChild(smartEditGetCheatTD()); 
	}
	// TD of link element
	var TdinputLink = document.createElement("TD");
	TdinputLink.className = "smarteditorExternalLinkChoice"+smartEditorIECssClass;

	var linkTextInput = document.createElement("INPUT");
	linkTextInput.id = "smarteditorExternalLinkInput";
	linkTextInput.size = "20";
	TdinputLink.appendChild(linkTextInput);
	TdinputLink.style.width = "15%"; // 220px
	TdinputLink.noWrap = true;
	
	var TdinputLink3 = document.createElement("TD");
	TdinputLink3.innerHTML = "Link : ";
	TdinputLink3.style.width = "4%"; //50px
	TdinputLink3.noWrap = true;
	
	
	// TD of link text element
	var TdinputLinkText = document.createElement("TD");
	TdinputLink.className = "smarteditorExternalLinkChoice"+smartEditorIECssClass;
	TdinputLinkText.style.width = "15%";
	TdinputLinkText.noWrap = true;
	var textInput = document.createElement("INPUT");
	textInput.id = "smarteditorExternalLinkTextInput";
	textInput.size = "20";
	//TdinputLinkText.innerHTML = "Text for the link: ";
	TdinputLinkText.appendChild(textInput);
	
	var TdinputLink2 = document.createElement("TD");
	TdinputLink2.innerHTML = "Text for the link: ";
	TdinputLink2.style.width = "7%"; // 100px
	TdinputLink2.noWrap = true;
	
	smartEditorRowExternalLink.appendChild(TdinputLink3);
	smartEditorRowExternalLink.appendChild(TdinputLink);
	smartEditorRowExternalLink.appendChild(TdinputLink2);
	smartEditorRowExternalLink.appendChild(TdinputLinkText);
	var theSep = smartEditGetSeparator();
	theSep.style.width = "2%";
	smartEditorRowExternalLink.appendChild(theSep);
	var theExtLink = smartEditGetPreviewButtonForExternalLink();
	theExtLink.noWrap = true;
	theExtLink.className = "smarteditButtonTD"+smartEditorIECssClass;
	smartEditorRowExternalLink.appendChild(theExtLink);

	var theExtLinkOK = smartEditGetOkButtonForInsertExternalLink();
	theExtLinkOK.noWrap = true;
	theExtLinkOK.className = "smarteditButtonTD"+smartEditorIECssClass;
	smartEditorRowExternalLink.appendChild(theExtLinkOK);
	
	var emptyTd = document.createElement("TD");
	if(is_firefox){
		emptyTd.style.width = "60%";
	}
	else{
		emptyTd.style.width = "15%";
	}
	//emptyTd.style.backgroundColor = "blue";
	smartEditorRowExternalLink.appendChild(emptyTd);
	
	var extClose = smartEditGetCloseButtonForExternalLink();
	extClose.className = "smarteditButtonTD"+smartEditorIECssClass;
	extClose.noWrap = true;
	smartEditorRowExternalLink.appendChild(extClose);
	if (is_firefox){ // I don't know why but there is a bug with SHIFT-TAB in IE
		smartEditorRowExternalLink.appendChild(smartEditGetCheatTD()); 
	}
	
	var theRowTable = document.createElement("TABLE");
	theRowTable.cellSpacing = "0";
	var theRowTbody = document.createElement("TBODY");
	theRowTable.appendChild(theRowTbody);
	theRowTbody.appendChild(smartEditorRowExternalLink);
	var thesmartEditorRowExternalLink = document.createElement("TR");
	var thesmartEditorRowExternalLinkTD = document.createElement("TD");
	if(is_firefox){
		thesmartEditorRowExternalLinkTD.colSpan = "35";
	}
	else{
		thesmartEditorRowExternalLinkTD.colSpan = "33";
	}
	thesmartEditorRowExternalLinkTD.appendChild(theRowTable);
	thesmartEditorRowExternalLink.appendChild(thesmartEditorRowExternalLinkTD);
	thesmartEditorRowExternalLink.id = "smartEditorRowExternalLink";
	thesmartEditorRowExternalLink.className = "smartEditorRowExternalLink"+smartEditorIECssClass;
	return thesmartEditorRowExternalLink;
}

// Create and returns a toolbar
function smartEditCreateToolbar(){
	var tbody = document.createElement("TBODY");
	var table = document.createElement("TABLE");

	table.cellSpacing = "0";
	var row = document.createElement("TR");
	row.className = "smartEditTR"+smartEditorIECssClass;
	if (is_firefox){ // I don't know why but there is a bug with SHIFT-TAB in IE
		row.appendChild(smartEditGetCheatTD()); 
	}
	row.appendChild(smartEditGetStyles()); 
	row.appendChild(smartEditGetSeparator());
	row.appendChild(smartEditGetBoldButton());
	row.appendChild(smartEditGetItalicButton());
	row.appendChild(smartEditGetBoldItalicButton());
	row.appendChild(smartEditGetFormattedButton());
	row.appendChild(smartEditGetSeparator());
	row.appendChild(smartEditGetColorButton());
	row.appendChild(smartEditGetSeparator());
	row.appendChild(smartEditGetBulletListButton());
	row.appendChild(smartEditGetNumListButton());
	row.appendChild(smartEditGetSeparator());
	row.appendChild(smartEditGetInternalLinkButton());
	row.appendChild(smartEditGetExternalLinkButton());  
	row.appendChild(smartEditGetNopButton());
	row.appendChild(smartEditGetSeparator());
	row.appendChild(smartEditGetIndentButton());
	row.appendChild(smartEditGetOutdentButton());
	row.appendChild(smartEditGetSeparator());
	row.appendChild(smartEditGetHRButton());
	row.appendChild(smartEditGetBRButton());
	row.appendChild(smartEditGetInsertSmileyButton());
	row.appendChild(wikismartGetInsertButton());
	row.appendChild(smartEditGetSeparator());
	row.appendChild(smartEditGetSearchButton());
	row.appendChild(smartEditGetSeparator());	
	row.appendChild(smartEditGetSelectLineButton());	
	row.appendChild(smartEditGetSeparator());
	row.appendChild(smartEditGetAutoFitButton());
	row.appendChild(smartEditGetIncreaseHeightButton());
	row.appendChild(smartEditGetDecreaseHeightButton());
	
	// To add the help button
	// An empty space
	var smartEditEmpty = smartEditCreateTD();
	smartEditEmpty.style.width = "50%";
	row.appendChild(smartEditEmpty);
	// The help button
	row.appendChild(smartEditGetHelpButton());
	
	if (is_firefox){ // I don't know why but there is a bug with SHIFT-TAB in IE
		row.appendChild(smartEditGetCheatTD());
	}
	tbody.appendChild(row);
	table.appendChild(tbody);
	table.className = "smartEditorToolbar"+smartEditorIECssClass;
	return table;
}

function wikismartInsertAfter(parent, node, referenceNode) {
    parent.insertBefore(node, referenceNode.nextSibling);
}

function smartEditorSetClassToButtons(smartlist, smartclass){
	for(var i=0;i<smartlist.length;i++){
		smartlist[i].className = smartclass+smartEditorIECssClass;
	}
}

function smartEditAutoFit(){
	wikismartAdjustSize();
	if(wikismartAdjustActivated){
		smartEditorSetClassToButtons(smartEditorAutoFitButtons,"smarteditButtonTDPressed");
	}
	else{
		smartEditorSetClassToButtons(smartEditorAutoFitButtons,"smarteditButtonTD");
	}
}

function smartEditIncreaseHeight(){
	wikismartIncreaseSize();
	if(wikismartAdjustActivated){
		wikismartAdjustActivated = false;
		smartEditorSetClassToButtons(smartEditorAutoFitButtons,"smarteditButtonTD");
	}
}

function smartEditDecreaseHeight(){
	wikismartDecreaseSize();
	if(wikismartAdjustActivated){
		wikismartAdjustActivated = false;
		smartEditorSetClassToButtons(smartEditorAutoFitButtons,"smarteditButtonTD");
	}
}

function smartEditToggleSearch(smartDataSource){
	//if(!smartEditInternalLinkOpen && !smartEditExternalLinkOpen){
		var toRecall = false;
		var sourceButtonRows = smartDataSource.parentNode.parentNode.getElementsByTagName("TR");
		if(sourceButtonRows != null && sourceButtonRows.length > 1){
			for(var i=1;i<sourceButtonRows.length;i++){
				var tmp = sourceButtonRows[i];
				if(tmp.id != null && tmp.id.indexOf("wikismartSearchTableRow") != -1){
					toRecall = true; // Si c'est bien dans le meme tableau, c'est qu'il faut juste la fermer // sinon pas touche !
				}
			}
		}
		if(smartEditSearchOpen){ // Si c'est deja ouvert et pas dans le meme tableau .. il faut fermer l'autre sous peine de grosses erreurs ...
			toRecall = !toRecall;
		}
		if(document.getElementById("wikismartSearchTableRow") != null){
			// Alors on le supprime
			var theRowToDelete = document.getElementById("wikismartSearchTableRow");
			theRowToDelete.parentNode.removeChild(theRowToDelete);
			smartEditSearchOpen = false;
			smartLastSearchRowSource.className = "smarteditButtonTD"+smartEditorIECssClass;
			wikismartTextarea.focus();
		}
		else{
			// Sinon on l'ajoute au tableau qui l'a appelé
			if(SmartEditInsertCommonStringOpen){
				smartEditToggleInsert(); 
			}
			if(SmartEditInsertColorOpen){
				smartEditToggleColors();
			}
			if(SmartEditInsertSmileyOpen){
				smartEditToggleSmileys();
			}
			if(smartExtendedStylesOpen){
				smartEditToggleStyles(); 
			}
			smartDataSource.parentNode.parentNode.appendChild(smartEditorGetSearchRow());
			rowSearch.style.display = "";
			smartEditSearchOpen = true;
			smartDataSource.className = "smarteditButtonTDPressed"+smartEditorIECssClass;
			smartLastSearchRowSource = smartDataSource;
			wikismartTopSearch.focus();
		}
		if(toRecall){
			smartEditToggleSearch(smartDataSource);
		}
	//}
}


// A mettre pour le bouton close du search
function smartEditCloseSearchRow(smartDataSource){
	var theRowToDelete = document.getElementById("wikismartSearchTableRow");
	theRowToDelete.parentNode.removeChild(theRowToDelete);
	smartEditSearchOpen = false;

	smartLastSearchRowSource.className = "smarteditButtonTD"+smartEditorIECssClass;
	wikismartTextarea.focus();
}


function smartEditToggleInternalLink(smartDataSource){
	//if(!smartEditExternalLinkOpen && !smartEditSearchOpen){
		var toRecall = false;
		var sourceButtonRows = smartDataSource.parentNode.parentNode.getElementsByTagName("TR");
		if(sourceButtonRows != null && sourceButtonRows.length > 1){
			for(var i=1;i<sourceButtonRows.length;i++){
				var tmp = sourceButtonRows[i];
				if(tmp.id != null && tmp.id.indexOf("smartEditorRowInternalLink") != -1){
					toRecall = true; // Si c'est bien dans le meme tableau, c'est qu'il faut juste la fermer // sinon pas touche !
				}
			}
		}
		if(smartEditInternalLinkOpen){ // Si c'est deja ouvert et pas dans le meme tableau .. il faut fermer l'autre sous peine de grosses erreurs ...
			toRecall = !toRecall;
		}
		if(document.getElementById("smartEditorRowInternalLink") != null){
			// Alors on le supprime
			var theRowToDelete = document.getElementById("smartEditorRowInternalLink");
			theRowToDelete.parentNode.removeChild(theRowToDelete);
			var theCompletionToDelete = document.getElementById("smartEditAutoCompletionDivision");
			if(theCompletionToDelete != null){
				theCompletionToDelete.parentNode.removeChild(theCompletionToDelete);
			}
			smartEditInternalLinkOpen = false;
			smartEditorRowInternalLink = null;
			smartLastInternalRowSource.className = "smarteditButtonTD"+smartEditorIECssClass;
			smartEditFirstWikiLink = true;
			wikismartTextarea.focus();
		}
		else{
			// Sinon on l'ajoute au tableau qui l'a appelé
			smartDataSource.parentNode.parentNode.appendChild(smartEditorGetWikiLinkRow());
			if(SmartEditInsertCommonStringOpen){
				smartEditToggleInsert(); 
			}
			if(SmartEditInsertColorOpen){
				smartEditToggleColors();
			}
			if(SmartEditInsertSmileyOpen){
				smartEditToggleSmileys();
			}
			if(smartExtendedStylesOpen){
				smartEditToggleStyles(); 
			}
			smartEditorRowInternalLink.style.display = "";
			smartEditInternalLinkOpen = true;
			smartDataSource.className = "smarteditButtonTDPressed"+smartEditorIECssClass;
			smartLastInternalRowSource = smartDataSource;
			smartEditorDoGetWebs();
		}
		if(toRecall){
			smartEditToggleInternalLink(smartDataSource);
		}
	//}
}

function smartEditCloseInternalLink(smartDataSource){
	var theRowToDelete = document.getElementById("smartEditorRowInternalLink");
	theRowToDelete.parentNode.removeChild(theRowToDelete);
	smartEditInternalLinkOpen = false;
	smartEditorRowInternalLink = null;
	smartLastInternalRowSource.className = "smarteditButtonTD"+smartEditorIECssClass;
	smartEditFirstWikiLink = true;
	var theCompletionToDelete = document.getElementById("smartEditAutoCompletionDivision");
	if(theCompletionToDelete != null){
		theCompletionToDelete.parentNode.removeChild(theCompletionToDelete);
	}
	wikismartTextarea.focus();
}

//smartEditInternalLinkOpen smartEditExternalLinkOpen smartEditSearchOpen
function smartEditToggleExternalLink(smartDataSource){
	//if(!smartEditSearchOpen && !smartEditInternalLinkOpen){
		var toRecall = false;
		var sourceButtonRows = smartDataSource.parentNode.parentNode.getElementsByTagName("TR");
		if(sourceButtonRows != null && sourceButtonRows.length > 1){
			for(var i=1;i<sourceButtonRows.length;i++){
				var tmp = sourceButtonRows[i];
				if(tmp.id != null && tmp.id.indexOf("smartEditorRowExternalLink") != -1){
					toRecall = true; // Si c'est bien dans le meme tableau, c'est qu'il faut juste la fermer // sinon pas touche !
				}
			}
		}
		if(smartEditExternalLinkOpen){ // Si c'est deja ouvert et pas dans le meme tableau .. il faut fermer l'autre sous peine de grosses erreurs ...
			toRecall = !toRecall;
		}
		if(document.getElementById("smartEditorRowExternalLink") != null){
			// Alors on le supprime
			var theRowToDelete = document.getElementById("smartEditorRowExternalLink");
			theRowToDelete.parentNode.removeChild(theRowToDelete);
			smartEditExternalLinkOpen = false;
			smartEditorRowExternalLink = null;
			smartEditFirstExternalLink = true;
			smartLastExternalRowSource.className = "smarteditButtonTD"+smartEditorIECssClass;
			wikismartTextarea.focus();
		}
		else{
			// Sinon on l'ajoute au tableau qui l'a appelé
			
			// Avant tout enlever tous les menus ouverts avant ...
			if(SmartEditInsertCommonStringOpen){
				smartEditToggleInsert(); 
			}
			if(SmartEditInsertColorOpen){
				smartEditToggleColors();
			}
			if(SmartEditInsertSmileyOpen){
				smartEditToggleSmileys();
			}
			if(smartExtendedStylesOpen){
				smartEditToggleStyles(); 
			}
			smartDataSource.parentNode.parentNode.appendChild(smartEditorGetExternalLinkRow());
			smartEditorRowExternalLink.style.display = "";
			smartEditExternalLinkOpen = true;
			wikismartInitializeAllAttributes();
			var lines = wikismartGetLines(wikismartSelection);
			smartDataSource.className = "smarteditButtonTDPressed"+smartEditorIECssClass;
			smartLastExternalRowSource = smartDataSource;
			var theText = "";
			if(lines != null && lines.length > 0){
				theText = lines[0];
				if(theText.indexOf("\n") == 0){
					theText = theText.substring(1,theText.length);				
				}
				if(document.getElementById("smarteditorExternalLinkTextInput") && document.getElementById("smarteditorExternalLinkInput")){
					document.getElementById("smarteditorExternalLinkTextInput").value = theText;
					document.getElementById("smarteditorExternalLinkInput").value = "";
					
				}
			}
		}
		if(toRecall){
			smartEditToggleExternalLink(smartDataSource);
		}
	//}
}
function smartEditCloseExternalLink(smartDataSource){
	var theRowToDelete = document.getElementById("smartEditorRowExternalLink");
	theRowToDelete.parentNode.removeChild(theRowToDelete);
	smartEditExternalLinkOpen = false;
	smartEditorRowExternalLink = null;
	smartLastExternalRowSource.className = "smarteditButtonTD"+smartEditorIECssClass;
	wikismartTextarea.focus();
}

function smartEditorInsertExternalLinkCall(){
	//if(smartEditFirstExternalLink){
	wikismartInsertExlink(document.getElementById("smarteditorExternalLinkInput").value, document.getElementById("smarteditorExternalLinkTextInput").value);
		//smartEditFirstExternalLink = false;
	//}
	//else{
	//wikismartInsertExlinkButInit(document.getElementById("smarteditorExternalLinkInput").value, document.getElementById("smarteditorExternalLinkTextInput").value);
	//}
}

function smartEditOpenPreviewForExternalLink(){
	var theLink = document.getElementById("smarteditorExternalLinkInput").value;
	if(theLink != null && theLink.length > 0){

		smartEditCreateGenericPreviewPopup(theLink);
	}
	else{
		alert("Please enter a correct link");
	}
}


function smartEditCreateGenericPreviewPopup(smartAddress){
	var thePage = "<iframe src=\""+smartAddress+"\" style=\"width:100%;height:90%;\"></iframe><br>"
	var newpage=open("",'popup','width=500,height=500,toolbar=no,scrollbars=no,resizable=no');
	newpage.document.write("<html><body>");
	newpage.document.write("<div onclick=\"javascript:window.close();\" style=\"color:white;background-color : red;font-family : verdana;text-align : center;font-size:0.9em;font-weight:bold;\">Click here to close this window</div>");
	newpage.document.write(thePage);
	newpage.document.write("<div onclick=\"javascript:window.close();\" style=\"color:white;background-color : red;font-family : verdana;text-align : center;font-size:0.9em;font-weight:bold;\">Click here to close this window</div></body></html>");
	newpage.document.close();
}

function smartEditCreateInsertDiv(source){
	var theDivToShow = smartEditorGetDynamicDivision(source);

	theDivToShow.id = "SmartEditInsertCommonString";
	theDivToShow.className = "SmartEditInsertCommonString"+smartEditorIECssClass;
	var theTable = document.createElement("TABLE");
	theTable.cellSpacing = "0";
	var theTBody = document.createElement("TBODY");
	
	////// The new
	if(wikismartSiteFunctionNames != null && wikismartSiteFunctionNames.length > 0){

		for(var i=0;i<wikismartSiteFunctionNames.length;i++){
			var seTheValue = wikismartSiteStrings[i];
			var seInnerHTML = wikismartSiteFunctionNames[i];
			
			theTBody.appendChild(smartEditCreateInsertRowData(seInnerHTML, seTheValue, "smarteditSelectOption", theDivToShow.id));
		}
	}
	
	// Web custom functions
	if(wikismartWebFunctionNames != null && wikismartWebFunctionNames.length > 0){

		for(var i=0;i<wikismartWebFunctionNames.length;i++){
			var seTheValue = wikismartWebStrings[i];
			var seInnerHTML = wikismartWebFunctionNames[i];
			theTBody.appendChild(smartEditCreateInsertRowData(seInnerHTML, seTheValue, "smarteditSelectOption", theDivToShow.id));
		}
	}	
	
	// Customer functions
	if(wikismartCustomerFunctionNames != null && wikismartCustomerFunctionNames.length > 0){
		// Mettre le séparateur pour bien montrer les préférences utilisateur
		var CustomSeparatorRow = document.createElement("TR");
		var theleftColumn = smartEditCreateTD();
		theleftColumn.className = "smarteditSelectOptionImg";
		theleftColumn.style.width = "20px";
		var CustomSeparator = smartEditCreateTD();
		CustomSeparator.innerHTML = "<hr>";
		CustomSeparator.className = "CustomStringPreferencesTD"+smartEditorIECssClass;
		CustomSeparatorRow.appendChild(theleftColumn);
		CustomSeparatorRow.appendChild(CustomSeparator);
		theTBody.appendChild(CustomSeparatorRow);
		// Fin du séparateur
		
		for(var i=0;i<wikismartCustomerFunctionNames.length;i++){
			var seTheValue = wikismartCustomerStrings[i];
			var seInnerHTML = wikismartCustomerFunctionNames[i];
			
			theTBody.appendChild(smartEditCreateInsertRowData(seInnerHTML, seTheValue, "smarteditSelectOption", theDivToShow.id));
		}
	}	
	///// The end of new
	
	theTable.appendChild(theTBody);
	theDivToShow.appendChild(theTable);	
	
	SmartEditInsertCommonStringOpen = true;
	//document.body.appendChild(theDivToShow);
	wikismartTextarea.parentNode.appendChild(theDivToShow);
}

function smartEditToggleInsert(src){
	if(src){
		if(SmartEditInsertCommonStringOpen){ // Tout d'abord .; si c'est ouvert, alors il faut le fermer
			var theDivToClose = document.getElementById("SmartEditInsertCommonString");
			if(theDivToClose != null){
				theDivToClose.parentNode.removeChild(theDivToClose);
				SmartEditInsertCommonStringOpen = false;
				smartEditDoNotInit = false;
			}
		}
		else{ // Sinon, il faut la rajouter
			smartEditCreateInsertDiv(src);
			if(smartExtendedStylesOpen){
				smartEditToggleStyles(); 
			}
			if(SmartEditInsertColorOpen){
				smartEditToggleColors();
			}
			if(SmartEditInsertSmileyOpen){
				smartEditToggleSmileys();
			}
		}
	}
	else{
		if(SmartEditInsertCommonStringOpen){ // Tout d'abord .; si c'est ouvert, alors il faut le fermer
			var theDivToClose = document.getElementById("SmartEditInsertCommonString");
			if(theDivToClose != null){
				theDivToClose.parentNode.removeChild(theDivToClose);
				SmartEditInsertCommonStringOpen = false;
				smartEditDoNotInit = false;
			}
		}
	}
}

function smartEditCloseInsert(id){
	var theDivToClose = document.getElementById(id);
	theDivToClose.parentNode.removeChild(theDivToClose);
	if (id == "SmartEditInsertCommonString") {
		SmartEditInsertCommonStringOpen = false;
	} else {
	        SmartEditInsertSmileyOpen = false;
	}
	wikismartTextarea.focus();
}

function smartEditToggleColors(src){
	if(src){
		if(SmartEditInsertColorOpen){ // Tout d'abord .; si c'est ouvert, alors il faut le fermer
			var theDivToClose = document.getElementById("SmartEditInsertColor");
			if(theDivToClose != null){
				theDivToClose.parentNode.removeChild(theDivToClose);
				SmartEditInsertColorOpen = false;
			}
		}
		else{ // Sinon, il faut la rajouter
			if(smartExtendedStylesOpen){
				smartEditToggleStyles(); 
			}
			if(SmartEditInsertCommonStringOpen){
				smartEditToggleInsert();
			}
			if(SmartEditInsertSmileyOpen){
				smartEditToggleSmileys();
			}
			smartEditCreateColorDiv(src); 
		}
	}
	else{
		if(SmartEditInsertColorOpen){ // Tout d'abord .; si c'est ouvert, alors il faut le fermer
			var theDivToClose = document.getElementById("SmartEditInsertColor");
			if(theDivToClose != null){
				theDivToClose.parentNode.removeChild(theDivToClose);
				SmartEditInsertColorOpen = false;
			}
		}
	}
}

function smartEditCloseColors(){
	var theDivToClose = document.getElementById("SmartEditInsertColor");
	theDivToClose.parentNode.removeChild(theDivToClose);
	SmartEditInsertColorOpen = false;
	wikismartTextarea.focus();
}

function smartEditToggleSmileys(src){
	if(src){
		if(SmartEditInsertSmileyOpen){ // Tout d'abord .; si c'est ouvert, alors il faut le fermer
			var theDivToClose = document.getElementById("SmartEditInsertSmiley");
			if(theDivToClose != null){
				theDivToClose.parentNode.removeChild(theDivToClose);
				SmartEditInsertSmileyOpen = false;
			}
		}
		else{ // Sinon, il faut la rajouter
			smartEditCreateSmileyDivStringVersion(src);
			if(smartExtendedStylesOpen){
				smartEditToggleStyles();
			}
			if(SmartEditInsertCommonStringOpen){
				smartEditToggleInsert();
			}
			if(SmartEditInsertColorOpen){
				smartEditToggleColors();
			}
		}
	}
	else{
		if(SmartEditInsertSmileyOpen){ // Tout d'abord .; si c'est ouvert, alors il faut le fermer
			var theDivToClose = document.getElementById("SmartEditInsertSmiley");
			if(theDivToClose != null){
				theDivToClose.parentNode.removeChild(theDivToClose);
				SmartEditInsertSmileyOpen = false;
			}
		}
	}
}

function smartEditCloseSmileys(){
	var theDivToClose = document.getElementById("SmartEditInsertSmiley");
	theDivToClose.parentNode.removeChild(theDivToClose);
	SmartEditInsertSmileyOpen = false;
	wikismartTextarea.focus();
}

function smartEditApplyActionForIcon(theIcon){
	theIcon.onclick = function(){
		var theCheatDiv = document.createElement("DIV");
		theCheatDiv.appendChild(theIcon);
		var theText = theCheatDiv.innerHTML;
		wikismartInsertSimpleTagButNotInit(theText);
		smartEditCloseSmileys();
	};
}

function smartEditCreateColorDiv(source){
	var theDivToShow = smartEditorGetDynamicDivision(source);// Create a context menu under the source position
	theDivToShow.id = "SmartEditInsertColor";
	theDivToShow.className = "SmartEditInsertColor"+smartEditorIECssClass;
	var theTable = document.createElement("TABLE");
	theTable.cellSpacing = "1";
	var theTBody = document.createElement("TBODY");
	// 4 lines with 4 colors each
	var ssfirstLine = document.createElement("TR");
	var color1 = document.createElement("TD");
	color1.style.backgroundColor = "white";
	color1.onclick = function(){
		wikismartInsertSmartColor("white");
		smartEditCloseColors();
	}

	var color2 = document.createElement("TD");
	color2.style.backgroundColor = "gray";
	color2.onclick = function(){
		wikismartInsertSmartColor("gray");
		smartEditCloseColors();
	}

	var color3 = document.createElement("TD");
	color3.style.backgroundColor = "silver";
	color3.onclick = function(){
		wikismartInsertSmartColor("silver");
		smartEditCloseColors();
	}

	var color4 = document.createElement("TD");
	color4.style.backgroundColor = "black";
	color4.onclick = function(){
		wikismartInsertSmartColor("black");
		smartEditCloseColors();
	}
	
	ssfirstLine.appendChild(color1);
	ssfirstLine.appendChild(color2);
	ssfirstLine.appendChild(color3);
	ssfirstLine.appendChild(color4);
	
	
	var sssecondLine = document.createElement("TR");
	var color5 = document.createElement("TD");
	color5.style.backgroundColor = "maroon";
	color5.onclick = function(){
		wikismartInsertSmartColor("maroon");
		smartEditCloseColors();
	}

	var color6 = document.createElement("TD");
	color6.style.backgroundColor = "red";
	color6.onclick = function(){
		wikismartInsertSmartColor("red");
		smartEditCloseColors();
	}

	var color7 = document.createElement("TD");
	color7.style.backgroundColor = "purple";
	color7.onclick = function(){
		wikismartInsertSmartColor("purple");
		smartEditCloseColors();
	}

	var color8 = document.createElement("TD");
	color8.style.backgroundColor = "pink";
	color8.onclick = function(){
		wikismartInsertSmartColor("pink");
		smartEditCloseColors();
	}

	
	sssecondLine.appendChild(color5);
	sssecondLine.appendChild(color6);
	sssecondLine.appendChild(color7);
	sssecondLine.appendChild(color8);
	
	var ssthirdLine = document.createElement("TR");
	var color9 = document.createElement("TD");
	color9.style.backgroundColor = "green";
	color9.onclick = function(){
		wikismartInsertSmartColor("green");
		smartEditCloseColors();
	}

	var color10 = document.createElement("TD");
	color10.style.backgroundColor = "lime";
	color10.onclick = function(){
		wikismartInsertSmartColor("lime");
		smartEditCloseColors();
	}

	var color11 = document.createElement("TD");
	color11.style.backgroundColor = "olive";
	color11.onclick = function(){
		wikismartInsertSmartColor("olive");
		smartEditCloseColors();
	}

	var color12 = document.createElement("TD");
	color12.style.backgroundColor = "yellow";
	color12.onclick = function(){
		wikismartInsertSmartColor("yellow");
		smartEditCloseColors();
	}

	ssthirdLine.appendChild(color9);
	ssthirdLine.appendChild(color10);
	ssthirdLine.appendChild(color11);
	ssthirdLine.appendChild(color12);
	
	var ssfourthLine = document.createElement("TR");
	var color13 = document.createElement("TD");
	color13.style.backgroundColor = "navy";
	color13.onclick = function(){
		wikismartInsertSmartColor("navy");
		smartEditCloseColors();
	}

	var color14 = document.createElement("TD");
	color14.style.backgroundColor = "blue";
	color14.onclick = function(){
		wikismartInsertSmartColor("blue");
		smartEditCloseColors();
	}

	var color15 = document.createElement("TD");
	color15.style.backgroundColor = "teal";
	color15.onclick = function(){
		wikismartInsertSmartColor("teal");
		smartEditCloseColors();
	}

	var color16 = document.createElement("TD");
	color16.style.backgroundColor = "aqua";
	color16.onclick = function(){
		wikismartInsertSmartColor("aqua");
		smartEditCloseColors();
	}
	
	ssfourthLine.appendChild(color13);
	ssfourthLine.appendChild(color14);
	ssfourthLine.appendChild(color15);
	ssfourthLine.appendChild(color16);
	
	theTBody.appendChild(ssfirstLine);
	theTBody.appendChild(sssecondLine);
	theTBody.appendChild(ssthirdLine);
	theTBody.appendChild(ssfourthLine);
	
	theTable.appendChild(theTBody);
	theDivToShow.appendChild(theTable);
	SmartEditInsertColorOpen = true;

	//document.body.appendChild(theDivToShow);
	wikismartTextarea.parentNode.appendChild(theDivToShow);
}

function smartEditCreateSmileyDivStringVersion(source){
	var theDivToShow = smartEditorGetDynamicDivision(source);

	theDivToShow.id = "SmartEditInsertSmiley";
	theDivToShow.className = "SmartEditInsertSmiley"+smartEditorIECssClass;
	var theTable = document.createElement("TABLE");
	theTable.cellSpacing = "0";
	var theTBody = document.createElement("TBODY");
	
	////// The new
	if(wikismartSiteIconsNames != null && wikismartSiteIconsNames.length > 0){

		for(var i=0;i<wikismartSiteIconsNames.length;i++){
			var seTheValue = wikismartSiteIcons[i];
			var seInnerHTML = wikismartSiteIconsNames[i];
			
			theTBody.appendChild(smartEditCreateInsertRowData(seInnerHTML, seTheValue, "smarteditSelectOption", theDivToShow.id));
		}
	}
	
	// Web custom functions
	if(wikismartWebIconsNames != null && wikismartWebIconsNames.length > 0){

		for(var i=0;i<wikismartWebIconsNames.length;i++){
			var seTheValue = wikismartWebIcons[i];
			var seInnerHTML = wikismartWebIconsNames[i];
			theTBody.appendChild(smartEditCreateInsertRowData(seInnerHTML, seTheValue, "smarteditSelectOption", theDivToShow.id));
		}
	}	
	
	// Customer functions
	if(wikismartCustomerIconsNames != null && wikismartCustomerIconsNames.length > 0){
		// Mettre le séparateur pour bien montrer les préférences utilisateur
		var CustomSeparatorRow = document.createElement("TR");
		var theleftColumn = smartEditCreateTD();
		theleftColumn.className = "smarteditSelectOptionImg";
		theleftColumn.style.width = "20px";
		var CustomSeparator = smartEditCreateTD();
		CustomSeparator.innerHTML = "<hr>";
		CustomSeparator.className = "CustomStringPreferencesTD"+smartEditorIECssClass;
		CustomSeparatorRow.appendChild(theleftColumn);
		CustomSeparatorRow.appendChild(CustomSeparator);
		theTBody.appendChild(CustomSeparatorRow);
		// Fin du séparateur
		
		for(var i=0;i<wikismartCustomerIconsNames.length;i++){
			var seTheValue = wikismartCustomerIcons[i];
			var seInnerHTML = wikismartCustomerIconsNames[i];
			
			theTBody.appendChild(smartEditCreateInsertRowData(seInnerHTML, seTheValue, "smarteditSelectOption", theDivToShow.id));
		}
	}	
	///// The end of new
	
	theTable.appendChild(theTBody);
	theDivToShow.appendChild(theTable);	
	
	SmartEditInsertSmileyOpen = true;
	//document.body.appendChild(theDivToShow);
	wikismartTextarea.parentNode.appendChild(theDivToShow);
}
