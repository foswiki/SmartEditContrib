/***************************
Copyright (C) 2006 Gaël Crova

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later version. 

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details. 

You should have received a copy of the GNU General Public License along with this program; if not, write to the Free Software Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
****************************/
// Returns a division just under the source element
function smartEditorGetDynamicDivision(sourceElement){
	var theDivToReturn = document.createElement("DIV");
	theDivToReturn = setDynamicCompleteDivSize(theDivToReturn, sourceElement);
	return theDivToReturn;
}

// calcule le décalage à gauche
function calculateDynamicOffsetLeft(r){
  return calculateOffset(r,"offsetLeft");
}

// calcule le décalage vertical
function calculateDynamicOffsetTop(r){
  return calculateOffset(r,"offsetTop");
}

function calculateDynamicOffset(r,attr){
  var kb=0;
  while(r){
    kb+=r[attr];
    r=r.offsetParent;
  }
  return kb
}

// calcule la largeur du champ
function calculateDynamicWidth(){
  return document.getElementById("smartEditorInputTopic").offsetWidth-2*1;
}

function setDynamicCompleteDivSize(theElement, sourceElement){
  if(theElement){
	theElement.style.position = "absolute";
	theElement.style.backgroundColor = "white";
    theElement.style.left=calculateDynamicOffsetLeft(sourceElement)+"px";
    theElement.style.top=calculateDynamicOffsetTop(sourceElement)+sourceElement.offsetHeight-1+"px";
  }
  return theElement;
}