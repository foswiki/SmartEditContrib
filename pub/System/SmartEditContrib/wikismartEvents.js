/***************************
Copyright (C) 2006 Gaël Crova

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later version. 

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details. 

You should have received a copy of the GNU General Public License along with this program; if not, write to the Free Software Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
****************************/
var wikismartCtrlPressed = false;
var wikismartControlScrollTop = 0;

var smartIELimitation = 13000;
var smartFFLimitation = 180000;
var infoHided = false;

/* timeoutID = window.setTimeout("window.ouvre()",3000); */

KeyEvents = {
    handled: false,
    updateModifiers: function(e) {
        var modifiers = e.modifier();
		wikismartShiftPressed = modifiers.shift;
		wikismartCtrlPressed = modifiers.ctrl;
		if(is_firefox && wikismartCtrlPressed){
			wikismartControlScrollTop = wikismartTextarea.scrollTop;
		}
		if(wikismartTextareaHasFocus && wikismartShiftPressed && !is_firefox && !wikismartCtrlPressed){
			wikismartInitializeAllAttributes();
			wikismartTextarea.value = wikismartTextareaContent;
			wikismartSetSelectionRange(wikismartTextarea, wikismartStartIndex, wikismartEndIndex);
			wikismartTextarea.focus();
		}
    }
};

connect(document, 'onkeydown', 
    function(e) {
        // We're storing a handled flag to work around a Safari bug: 
        // http://bugzilla.opendarwin.org/show_bug.cgi?id=3387
	        if (!KeyEvents.handled) {
	            var key = e.key();
				if((wikismartTextareaHasFocus && key.code == 9) || (wikismartCtrlPressed && wikismartTextareaHasFocus && key.code == 90 )){
					//e.preventDefault();
					if((key.code == 90 && wikismartCtrlPressed)){
					    if(is_firefox){
							wikismartInitializeAllAttributes();
							wikismartTextarea.value = wikismartTextareaContent;
							wikismartSetSelectionRange(wikismartTextarea, wikismartStartIndex, wikismartStartIndex);
							smartSetTexScrollForControlZ(wikismartStartIndex);
							wikismartTextarea.focus();
						}
					}
					else{
						e.preventDefault();
					}
					
				}
				if(key.code == 13){	
					if(wikismartTextareaHasFocus){
						if((is_firefox && wikismartTextarea.value.length <= smartFFLimitation) || (!is_firefox && wikismartTextarea.value.length <= smartIELimitation)){
							wikismartDetectListContext();
							if(document.getElementById("infDiv") != null){
								document.getElementById("infDiv").style.display = "none";
							}
						}
						else{
							// The textarea contains too much characters ... I disable this functionnality
							wikismartDetectListContext();
							if(document.getElementById("infDiv") == null){
								var okinfo = document.createElement("BUTTON");
								okinfo.innerHTML = "OK";
								okinfo.onclick = function(){document.getElementById("infDiv").style.display = "none";infoHided=true;};
								
								var infDiv = document.createElement("DIV");
								infDiv.innerHTML = "Warning - You are editing a big page - You may encounter some performance problems";
								infDiv.id = "infDiv";
								infDiv.className = "LimitationExceededDiv";
								infDiv.appendChild(okinfo);
								document.getElementById("smartEditorTopToolbarID").appendChild(infDiv);
							}
							else{
								if(!infoHided){
									document.getElementById("infDiv").style.display = "";
								}
							}
						}
					}
				}
	            KeyEvents.updateModifiers(e);
	        }
	        KeyEvents.handled = false;
			
    });
    
connect(document, 'onkeyup', 
    function(e) {
	        var key = e.key();
			var stopEvent = false;
			if((wikismartTextareaHasFocus && key.code == 9) || (wikismartCtrlPressed && wikismartTextareaHasFocus && key.code == 90 )){
				if((key.code == 90 && wikismartCtrlPressed)){
					if(is_firefox){
						wikismartInitializeAllAttributes();
						wikismartTextarea.value = wikismartTextareaContent;
						wikismartSetSelectionRange(wikismartTextarea, wikismartStartIndex, wikismartStartIndex);
						smartSetTexScrollForControlZ(wikismartStartIndex);
						wikismartTextarea.focus();
					}
				}
				else{
					e.preventDefault();
				}
				
			}
			else{
				var tsTextFound = false;
				// Wiki smart Search Engine
				if(wikismartTopSearchHasFocus || wikismartBottomSearchHasFocus){
					wikismartTextToSearch = "";
					// Si c'est celui du haut, alors le texte a chercher est celui la
					if(wikismartTopSearchHasFocus){
						wikismartTextToSearch = wikismartTopSearch.value;
						wikismartTopSearch.focus();
					}
					if(wikismartTextToSearch != null && wikismartTextToSearch.length >0){
						wikismartTextOccurence = -1;
						wikismartSearchTextFromLeft();
						if(wikismartTextOccurence == -1){
							wikismartTopSearch.className = "wikismartSearchNotFound"+smartEditorIECssClass;
							document.getElementById("smartEditSearchNextButton").className = "smarteditButtonTDDisabled"+smartEditorIECssClass;
							var theButton2 = document.getElementById("smartEditSearchNextButton");
							theButton2.onmouseover = function(){
								theButton2.className = "smarteditButtonTDDisabled"+smartEditorIECssClass;
							};
							theButton2.onmouseout = function(){
								theButton2.className = "smarteditButtonTDDisabled"+smartEditorIECssClass;
							};
							
							
							document.getElementById("smartEditSearchPreviousButton").className = "smarteditButtonTDDisabled"+smartEditorIECssClass;
							var theButton4 = document.getElementById("smartEditSearchPreviousButton");
							theButton4.onmouseover = function(){
								theButton4.className = "smarteditButtonTDDisabled"+smartEditorIECssClass;
							};
							theButton4.onmouseout = function(){
								theButton4.className = "smarteditButtonTDDisabled"+smartEditorIECssClass;
							};
							
							
							var imgwarning = "<img src=\""+wikismartScriptURL+"warning.gif\">";
							document.getElementById("smartEditSearchInfoTD").innerHTML = imgwarning+" No match";
							tsTextFound = false;
						}
						else{
							wikismartTopSearch.className = "wikismartSearchFound"+smartEditorIECssClass;
							document.getElementById("smartEditSearchNextButton").className = "smarteditButtonTD"+smartEditorIECssClass;
							var theButton = document.getElementById("smartEditSearchNextButton");
							theButton.onmouseover = function(){
								theButton.className = "smarteditButtonTDPressed"+smartEditorIECssClass;
							};
							theButton.onmouseout = function(){
								theButton.className = "smarteditButtonTD"+smartEditorIECssClass;
							};
							tsTextFound = true;
						}
						wikismartTextOccurence = -1; // reset value
					}
					else{
						wikismartTopSearch.className = "wikismartSearch"+smartEditorIECssClass;
						document.getElementById("smartEditSearchNextButton").className = "smarteditButtonTDDisabled"+smartEditorIECssClass;
						var theButton5 = document.getElementById("smartEditSearchNextButton");
						theButton5.onmouseover = function(){
							theButton5.className = "smarteditButtonTDDisabled"+smartEditorIECssClass;
						};
						theButton5.onmouseout = function(){
							theButton5.className = "smarteditButtonTDDisabled"+smartEditorIECssClass;
						};
						document.getElementById("smartEditSearchPreviousButton").className = "smarteditButtonTDDisabled"+smartEditorIECssClass;
						var theButton3 = document.getElementById("smartEditSearchPreviousButton");
						theButton3.onmouseover = function(){
							theButton3.className = "smarteditButtonTDDisabled"+smartEditorIECssClass;
						};
						theButton3.onmouseout = function(){
							theButton3.className = "smarteditButtonTDDisabled"+smartEditorIECssClass;
						};
						document.getElementById("smartEditSearchInfoTD").innerHTML = "";
						tsTextFound = false;
					}
					if(key.code == 13 && tsTextFound){
						wikismartHighLightNextOccurenceFromTop();
						stopEvent = true;
					}
				}
			}
			if(!stopEvent){
				if(wikismartShiftPressed && key.code == 9){
					// Désindenter
					if(!is_opera){
						wikismartOutdent();
					}
				}
				else{
					// Indenter
					if(key.code == 9){
						if(!is_opera){
							wikismartIndent();
						}
					}
					else{
						
						if(key.code == 13){
							textlength = wikismartTextarea.value.length;
							if((is_firefox && wikismartTextarea.value.length <= smartFFLimitation) || (!is_firefox && wikismartTextarea.value.length <= smartIELimitation)){
								wikismartReturnKeyAction();
								if(wikismartShiftPressed){
									// Si c'est le cas ..... trouver l'indentation de la ligne précédente et insérer le br à cet endroit dans la nouvelle ligne
									wikismartInsertSimpleTagAndNoSelect(wikismartSpaceToAddText+"<br>");
								}
							}
							else{
								// On effectue quand meme l'action, fonction non desactivee
								wikismartReturnKeyAction();								
								if(wikismartShiftPressed){
									// Si c'est le cas ..... trouver l'indentation de la ligne précédente et insérer le br à cet endroit dans la nouvelle ligne
									wikismartInsertSimpleTagAndNoSelect(wikismartSpaceToAddText+"<br>");
								}
							}
						}
						else{
							
						}
					}
				}
			}
			if(theAutoCompletionIsFocused){
				if(key.code == 13){
					// La touche entrée est appuyée .. on insère la bonne valeur
					smartEditorWikiTopicCliked(document.getElementById(theSelectedItemId).innerHTML);
				}
				else{
					if(key.code == 38){ // Up
						smartEditorPreviousOccurence();
					}
					if(key.code == 40){ // Down
						smartEditorNextOccurence();
					}
					if((key.code != 38 && key.code != 40) || key.code == 8){
						smartEditUpdateDataList();
					}
				}
			}
			stopEvent = false;
	        KeyEvents.updateModifiers(e);
			KeyEvents.handled = false;
    });

connect(document, 'onkeypress', 
    function(e) {
		var key = e.key();
		if((wikismartTextareaHasFocus && key.code == 9)){
			e.preventDefault();
		}
		KeyEvents.updateModifiers(e);
    });
	
function smartSetTexScrollForControlZ(theIndex){
	if(is_firefox){
		wikismartTextarea.scrollTop = wikismartControlScrollTop;
	}
}
