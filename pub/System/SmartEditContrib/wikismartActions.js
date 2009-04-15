/***************************
Copyright (C) 2006 Gaël Crova

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later version. 

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details. 

You should have received a copy of the GNU General Public License along with this program; if not, write to the Free Software Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
****************************/
var wikismartTextAreaRows = 0;
var wikismartEngineAction = false;
var wikismartListToInsert = false;
var wikismartListToDelete = false;
var wikismartSpaceToAdd = false;
var wikismartSpaceToAddText = "";
var wikismartListType = "";
var wikismartAdjustActivated = false;
var smartEditPopup="";
var smartEditFirstWikiLink = true;

function wikismartInsertBold(){
	wikismartInitializeAllAttributes();
	var wikismartStartSelectionAdd = 0;
	var wikismartEndSelectionAdd = 0; // Ce qu'il faudra retirer de la longueur de la chaine finale
	var lines = wikismartGetLines(wikismartSelection);
	if(wikismartSelection == null || wikismartIsEmptyString(wikismartSelection)){
		wikismartSelection = "Bold Text";
		lines[0] = wikismartSelection;
	}
	// Pour chaque ligne, inserer le tag avant le premier caractere en prenant en compte si on ajoute ou non un blanc
	
	var wikismartFinalText = "";
	if(lines != null && lines.length > 0){
		for(var i=0;i<lines.length;i++){
			var tmpline = lines[i];			
			
			// Prendre en compte le cas ou i=0 pour voir le premier caractere avant la selection ( blanc ou \n ou autre ......
			if(i==0 && tmpline.indexOf("\n") == -1){ // Cas d'une selection sans \n ou d'une premiere ligne de selection non complete
			
				// Tag ouvrant
				var fchr = wikismartIndexOfFirstCharacter(tmpline);
				if(fchr == 0){ // Si le premier caractere se trouve des le debut de la selection, il faut regarder si le caracter d'avant dans la textarea est un blanc
					var strbefore = wikismartTextareaContent.substring(0,wikismartStartIndex);
					if((strbefore.lastIndexOf(" ") == strbefore.length - 1) || (strbefore.lastIndexOf("\n") == strbefore.length - 1)){ // Il y a bien un blanc avant dc on insere juste la bullet
						lines[i] = "*"+lines[i];
						wikismartStartSelectionAdd = 1;
					}
					else{ // Pas de blanc, donc il faut en inserer un ! 
						lines[i] = " *"+lines[i];
						wikismartStartSelectionAdd = 2;
					}
				}
				else{ // Sinon, il suffit d'ajouter le bold juste avant le premier caractere
					lines[i] = lines[i].substring(0,fchr)+"*"+lines[i].substring(fchr,lines[i].length);
					wikismartStartSelectionAdd = fchr+1;
				}
				
				// Tag fermant
				
				tmpline = lines[i];
				var fechr = wikismartIndexOfLastCharacter(tmpline);				
				
				if(lines.length == 1){ // Cas ou il n'y aurait qu'une seule ligne de selectionnée
					if(fechr == (tmpline.length-1)){ // Le dernier caractere se trouve en derniere position de cette ligne ... il faut verifier le caractere suivant
						var strafter = wikismartTextareaContent.substring(wikismartEndIndex,wikismartTextareaContent.length);
						if(strafter.indexOf("\n") == 0 || strafter.indexOf(" ") == 0){ // Dans ce cas, pas besoin d'inserer d'espace
							lines[i]=lines[i]+"*";
							wikismartEndSelectionAdd = 1;
						}
						else{ // Sinon, il faut en rajouter un (d'espace)
							lines[i]=lines[i]+"* ";
							wikismartEndSelectionAdd = 2;
						}
	 				}
					else{ // Sinon, il suffit de rajouter la bullet apres le dernier caractere
						lines[i] = lines[i].substring(0,fechr+1)+"*"+lines[i].substring(fechr+1,lines[i].length);
						wikismartEndSelectionAdd = 2;
					}
				}
				else{
					// Sinon, il suffit d'inserer la bullet juste apres le dernier caractere de la ligne
					lines[i] = lines[i].substring(0,fechr+1)+"*"+ lines[i].substring(fechr+1,lines[i].length);
				}
			}
			// Ensuite gérer ces lignes de sélection pour bien insérer les bons tags aux bons endroits
			else{
				// Si la ligne est vide .. ne rien toucher
				if(!wikismartIsEmptyString(lines[i].substring(1,lines[i].length))){
				
					// Tag ouvrant
				
					var fchr = wikismartIndexOfFirstCharacter(tmpline.substring(1,tmpline.length));
					if(fchr == 0){ // Si le premier caractere se trouve des le debut de la selection, alors le caractere avant est un retour a la ligne dc pas besoin d'espace
						lines[i] = "\n*"+tmpline.substring(1,tmpline.length);
						if(i==0){
							wikismartStartSelectionAdd = 1;
						}
					}
					else{ // Sinon, il suffit d'ajouter le bold juste avant le premier caractere
						if( fchr >= 1){ // Si c'est ailleur, c'est qu'il y a un blanc avant donc juste inserer avant le premier caractere
							lines[i] = lines[i].substring(0,fchr+1)+"*"+lines[i].substring(fchr+1,lines[i].length);
							if(i==0){
								wikismartStartSelectionAdd = fchr;
							}
						}
						else{ // BUG
						}
					}
					
					// Tag fermant
					
					tmpline = lines[i];
					var fechr = wikismartIndexOfLastCharacter(tmpline);
					if(fechr < tmpline.length-1){ // Le dernier caractere ne se trouve pas a la fin de la ligne donc on peut inserer directement la bullet
						lines[i] = lines[i].substring(0,fechr+1)+"*"+lines[i].substring(fechr+1,lines[i].length);
						if(i==lines.length){
							wikismartEndSelectionAdd = 1;
						}
	 				}
					else{ // Sinon, le dernier caractere se trouve a la fin de la ligne ...
						if(i<(lines.length-1)){ // Si ce n'est pas la derniere ligne, alors il y a un retour a la ligne juste apres ... il suffit de rajouter la bullet	
							lines[i] = lines[i]+"*";
						}
						else{ // Sinon, il faut regarder le caracter se trouvant apres dans la textarea
							var strafter = wikismartTextareaContent.substring(wikismartEndIndex,wikismartTextareaContent.length);
							if(strafter.indexOf("\n") == 0 || strafter.indexOf(" ") == 0){ // Dans ce cas, pas besoin d'inserer d'espace
								lines[i]=lines[i]+"*";
								wikismartEndSelectionAdd = 1;
							}
							else{ // Sinon, il faut en rajouter un (d'espace)
								lines[i]=lines[i]+"* ";
								wikismartEndSelectionAdd = 2;
							}
						}
					}
				}
			}
			wikismartFinalText +=lines[i];
		}
		wikismartTextarea.value = wikismartTextareaContent.substring(0,wikismartStartIndex)+wikismartFinalText+wikismartTextareaContent.substring(wikismartEndIndex,wikismartTextareaContent.length);
		//if(navigator.userAgent.toLowerCase().indexOf("opera") == -1){
			wikismartSetSelectionRange(wikismartTextarea,wikismartStartIndex+wikismartStartSelectionAdd,wikismartStartIndex+wikismartFinalText.length-wikismartEndSelectionAdd);
			if(is_firefox){
				wikismartTextarea.scrollTop = wikismartTextareaScrollFirefox;
			}
		//}
		//else{ // Bug pour opera .. il faut rajouter un caractere pour chaque ligne !
			//var nblines = wikismartNbLinesBefore(wikismartStartIndex);
			//wikismartSetSelectionRange(wikismartTextarea,wikismartStartIndex+wikismartStartSelectionAdd+nblines,wikismartStartIndex+wikismartFinalText.length-wikismartEndSelectionAdd+nblines+lines.length-1);
		//}
	}
}

function wikismartInsertItalic(){
	wikismartInitializeAllAttributes();
	var wikismartStartSelectionAdd = 0;
	var wikismartEndSelectionAdd = 0; // Ce qu'il faudra retirer de la longueur de la chaine finale
	var lines = wikismartGetLines(wikismartSelection);
	if(wikismartSelection == null || wikismartIsEmptyString(wikismartSelection)){
		wikismartSelection = "Italic Text";
		lines[0] = wikismartSelection;
	}
	// Pour chaque ligne, inserer le tag avant le premier caractere en prenant en compte si on ajoute ou non un blanc
	
	var wikismartFinalText = "";
	if(lines != null && lines.length > 0){
		for(var i=0;i<lines.length;i++){
			var tmpline = lines[i];			
			
			// Prendre en compte le cas ou i=0 pour voir le premier caractere avant la selection ( blanc ou \n ou autre ......
			if(i==0 && tmpline.indexOf("\n") == -1){ // Cas d'une selection sans \n ou d'une premiere ligne de selection non complete
			
				// Tag ouvrant
				var fchr = wikismartIndexOfFirstCharacter(tmpline);
				if(fchr == 0){ // Si le premier caractere se trouve des le debut de la selection, il faut regarder si le caracter d'avant dans la textarea est un blanc
					var strbefore = wikismartTextareaContent.substring(0,wikismartStartIndex);
					if((strbefore.lastIndexOf(" ") == strbefore.length - 1) || (strbefore.lastIndexOf("\n") == strbefore.length - 1)){ // Il y a bien un blanc avant dc on insere juste la bullet
						lines[i] = "_"+lines[i];
						wikismartStartSelectionAdd = 1;
					}
					else{ // Pas de blanc, donc il faut en inserer un ! 
						lines[i] = " _"+lines[i];
						wikismartStartSelectionAdd = 2;
					}
				}
				else{ // Sinon, il suffit d'ajouter le bold juste avant le premier caractere
					lines[i] = lines[i].substring(0,fchr)+"_"+lines[i].substring(fchr,lines[i].length);
					wikismartStartSelectionAdd = fchr+1;
				}
				
				// Tag fermant
				
				tmpline = lines[i];
				var fechr = wikismartIndexOfLastCharacter(tmpline);				
				
				if(lines.length == 1){ // Cas ou il n'y aurait qu'une seule ligne de selectionnée
					if(fechr == (tmpline.length-1)){ // Le dernier caractere se trouve en derniere position de cette ligne ... il faut verifier le caractere suivant
						var strafter = wikismartTextareaContent.substring(wikismartEndIndex,wikismartTextareaContent.length);
						if(strafter.indexOf("\n") == 0 || strafter.indexOf(" ") == 0){ // Dans ce cas, pas besoin d'inserer d'espace
							lines[i]=lines[i]+"_";
							wikismartEndSelectionAdd = 1;
						}
						else{ // Sinon, il faut en rajouter un (d'espace)
							lines[i]=lines[i]+"_ ";
							wikismartEndSelectionAdd = 2;
						}
	 				}
					else{ // Sinon, il suffit de rajouter la bullet apres le dernier caractere
						lines[i] = lines[i].substring(0,fechr+1)+"_"+lines[i].substring(fechr+1,lines[i].length);
						wikismartEndSelectionAdd = 2;
					}
				}
				else{
					// Sinon, il suffit d'inserer la bullet juste apres le dernier caractere de la ligne
					lines[i] = lines[i].substring(0,fechr+1)+"_"+ lines[i].substring(fechr+1,lines[i].length);
				}
			}
			// Ensuite gérer ces lignes de sélection pour bien insérer les bons tags aux bons endroits
			else{
				// Si la ligne est vide .. ne rien toucher
				if(!wikismartIsEmptyString(lines[i].substring(1,lines[i].length))){
				
					// Tag ouvrant
				
					var fchr = wikismartIndexOfFirstCharacter(tmpline.substring(1,tmpline.length));
					if(fchr == 0){ // Si le premier caractere se trouve des le debut de la selection, alors le caractere avant est un retour a la ligne dc pas besoin d'espace
						lines[i] = "\n_"+tmpline.substring(1,tmpline.length);
						if(i==0){
							wikismartStartSelectionAdd = 1;
						}
					}
					else{ // Sinon, il suffit d'ajouter le bold juste avant le premier caractere
						if( fchr >= 1){ // Si c'est ailleur, c'est qu'il y a un blanc avant donc juste inserer avant le premier caractere
							lines[i] = lines[i].substring(0,fchr+1)+"_"+lines[i].substring(fchr+1,lines[i].length);
							if(i==0){
								wikismartStartSelectionAdd = fchr;
							}
						}
						else{ // BUG
						}
					}
					
					// Tag fermant
					
					tmpline = lines[i];
					var fechr = wikismartIndexOfLastCharacter(tmpline);
					if(fechr < tmpline.length-1){ // Le dernier caractere ne se trouve pas a la fin de la ligne donc on peut inserer directement la bullet
						lines[i] = lines[i].substring(0,fechr+1)+"_"+lines[i].substring(fechr+1,lines[i].length);
						if(i==lines.length){
							wikismartEndSelectionAdd = 1;
						}
	 				}
					else{ // Sinon, le dernier caractere se trouve a la fin de la ligne ...
						if(i<(lines.length-1)){ // Si ce n'est pas la derniere ligne, alors il y a un retour a la ligne juste apres ... il suffit de rajouter la bullet	
							lines[i] = lines[i]+"_";
						}
						else{ // Sinon, il faut regarder le caracter se trouvant apres dans la textarea
							var strafter = wikismartTextareaContent.substring(wikismartEndIndex,wikismartTextareaContent.length);
							if(strafter.indexOf("\n") == 0 || strafter.indexOf(" ") == 0){ // Dans ce cas, pas besoin d'inserer d'espace
								lines[i]=lines[i]+"_";
								wikismartEndSelectionAdd = 1;
							}
							else{ // Sinon, il faut en rajouter un (d'espace)
								lines[i]=lines[i]+"_ ";
								wikismartEndSelectionAdd = 2;
							}
						}
					}
				}
			}
			wikismartFinalText +=lines[i];
		}
		wikismartTextarea.value = wikismartTextareaContent.substring(0,wikismartStartIndex)+wikismartFinalText+wikismartTextareaContent.substring(wikismartEndIndex,wikismartTextareaContent.length);
		//if(navigator.userAgent.toLowerCase().indexOf("opera") == -1){
			wikismartSetSelectionRange(wikismartTextarea,wikismartStartIndex+wikismartStartSelectionAdd,wikismartStartIndex+wikismartFinalText.length-wikismartEndSelectionAdd);
			if(is_firefox){
				wikismartTextarea.scrollTop = wikismartTextareaScrollFirefox;
			}
		//}
		//else{ // Bug pour opera .. il faut rajouter un caractere pour chaque ligne !
			//var nblines = wikismartNbLinesBefore(wikismartStartIndex);
			//wikismartSetSelectionRange(wikismartTextarea,wikismartStartIndex+wikismartStartSelectionAdd+nblines,wikismartStartIndex+wikismartFinalText.length-wikismartEndSelectionAdd+nblines+lines.length-1);
		//}
	}
}

function wikismartInsertBoldItalic(){
	wikismartInitializeAllAttributes();
	var wikismartStartSelectionAdd = 0;
	var wikismartEndSelectionAdd = 0; // Ce qu'il faudra retirer de la longueur de la chaine finale
	var lines = wikismartGetLines(wikismartSelection);
	if(wikismartSelection == null || wikismartIsEmptyString(wikismartSelection)){
		wikismartSelection = "Bold Italic Text";
		lines[0] = wikismartSelection;
	}
	// Pour chaque ligne, inserer le tag avant le premier caractere en prenant en compte si on ajoute ou non un blanc
	
	var wikismartFinalText = "";
	if(lines != null && lines.length > 0){
		for(var i=0;i<lines.length;i++){
			var tmpline = lines[i];			
			
			// Prendre en compte le cas ou i=0 pour voir le premier caractere avant la selection ( blanc ou \n ou autre ......
			if(i==0 && tmpline.indexOf("\n") == -1){ // Cas d'une selection sans \n ou d'une premiere ligne de selection non complete
			
				// Tag ouvrant
				var fchr = wikismartIndexOfFirstCharacter(tmpline);
				if(fchr == 0){ // Si le premier caractere se trouve des le debut de la selection, il faut regarder si le caracter d'avant dans la textarea est un blanc
					var strbefore = wikismartTextareaContent.substring(0,wikismartStartIndex);
					if((strbefore.lastIndexOf(" ") == strbefore.length - 1) || (strbefore.lastIndexOf("\n") == strbefore.length - 1)){ // Il y a bien un blanc avant dc on insere juste la bullet
						lines[i] = "__"+lines[i];
						wikismartStartSelectionAdd = 2;
					}
					else{ // Pas de blanc, donc il faut en inserer un ! 
						lines[i] = " __"+lines[i];
						wikismartStartSelectionAdd = 3;
					}
				}
				else{ // Sinon, il suffit d'ajouter le bold juste avant le premier caractere
					lines[i] = lines[i].substring(0,fchr)+"__"+lines[i].substring(fchr,lines[i].length);
					wikismartStartSelectionAdd = fchr+2;
				}
				
				// Tag fermant
				
				tmpline = lines[i];
				var fechr = wikismartIndexOfLastCharacter(tmpline);				
				
				if(lines.length == 1){ // Cas ou il n'y aurait qu'une seule ligne de selectionnée
					if(fechr == (tmpline.length-1)){ // Le dernier caractere se trouve en derniere position de cette ligne ... il faut verifier le caractere suivant
						var strafter = wikismartTextareaContent.substring(wikismartEndIndex,wikismartTextareaContent.length);
						if(strafter.indexOf("\n") == 0 || strafter.indexOf(" ") == 0){ // Dans ce cas, pas besoin d'inserer d'espace
							lines[i]=lines[i]+"__";
							wikismartEndSelectionAdd = 2;
						}
						else{ // Sinon, il faut en rajouter un (d'espace)
							lines[i]=lines[i]+"__ ";
							wikismartEndSelectionAdd = 3;
						}
	 				}
					else{ // Sinon, il suffit de rajouter la bullet apres le dernier caractere
						lines[i] = lines[i].substring(0,fechr+1)+"__"+lines[i].substring(fechr+1,lines[i].length);
						wikismartEndSelectionAdd = 3;
					}
				}
				else{
					// Sinon, il suffit d'inserer la bullet juste apres le dernier caractere de la ligne
					lines[i] = lines[i].substring(0,fechr+1)+"__"+ lines[i].substring(fechr+1,lines[i].length);
				}
			}
			// Ensuite gérer ces lignes de sélection pour bien insérer les bons tags aux bons endroits
			else{
				// Si la ligne est vide .. ne rien toucher
				if(!wikismartIsEmptyString(lines[i].substring(1,lines[i].length))){
				
					// Tag ouvrant
				
					var fchr = wikismartIndexOfFirstCharacter(tmpline.substring(1,tmpline.length));
					if(fchr == 0){ // Si le premier caractere se trouve des le debut de la selection, alors le caractere avant est un retour a la ligne dc pas besoin d'espace
						lines[i] = "\n__"+tmpline.substring(1,tmpline.length);
						if(i==0){
							wikismartStartSelectionAdd = 2;
						}
					}
					else{ // Sinon, il suffit d'ajouter le bold juste avant le premier caractere
						if( fchr >= 1){ // Si c'est ailleur, c'est qu'il y a un blanc avant donc juste inserer avant le premier caractere
							lines[i] = lines[i].substring(0,fchr+1)+"__"+lines[i].substring(fchr+1,lines[i].length);
							if(i==0){
								wikismartStartSelectionAdd = fchr+1;
							}
						}
						else{ // BUG
						}
					}
					
					// Tag fermant
					
					tmpline = lines[i];
					var fechr = wikismartIndexOfLastCharacter(tmpline);
					if(fechr < tmpline.length-1){ // Le dernier caractere ne se trouve pas a la fin de la ligne donc on peut inserer directement la bullet
						lines[i] = lines[i].substring(0,fechr+1)+"__"+lines[i].substring(fechr+1,lines[i].length);
						if(i==lines.length){
							wikismartEndSelectionAdd = 2;
						}
	 				}
					else{ // Sinon, le dernier caractere se trouve a la fin de la ligne ...
						if(i<(lines.length-1)){ // Si ce n'est pas la derniere ligne, alors il y a un retour a la ligne juste apres ... il suffit de rajouter la bullet	
							lines[i] = lines[i]+"__";
						}
						else{ // Sinon, il faut regarder le caracter se trouvant apres dans la textarea
							var strafter = wikismartTextareaContent.substring(wikismartEndIndex,wikismartTextareaContent.length);
							if(strafter.indexOf("\n") == 0 || strafter.indexOf(" ") == 0){ // Dans ce cas, pas besoin d'inserer d'espace
								lines[i]=lines[i]+"__";
								wikismartEndSelectionAdd = 2;
							}
							else{ // Sinon, il faut en rajouter un (d'espace)
								lines[i]=lines[i]+"__ ";
								wikismartEndSelectionAdd = 3;
							}
						}
					}
				}
			}
			wikismartFinalText +=lines[i];
		}
		wikismartTextarea.value = wikismartTextareaContent.substring(0,wikismartStartIndex)+wikismartFinalText+wikismartTextareaContent.substring(wikismartEndIndex,wikismartTextareaContent.length);
		//if(navigator.userAgent.toLowerCase().indexOf("opera") == -1){
			wikismartSetSelectionRange(wikismartTextarea,wikismartStartIndex+wikismartStartSelectionAdd,wikismartStartIndex+wikismartFinalText.length-wikismartEndSelectionAdd);
			if(is_firefox){
				wikismartTextarea.scrollTop = wikismartTextareaScrollFirefox;
			}
		//}
		//else{ // Bug pour opera .. il faut rajouter un caractere pour chaque ligne !
		//	var nblines = wikismartNbLinesBefore(wikismartStartIndex);
		//	wikismartSetSelectionRange(wikismartTextarea,wikismartStartIndex+wikismartStartSelectionAdd+nblines,wikismartStartIndex+wikismartFinalText.length-wikismartEndSelectionAdd+nblines+lines.length-1);
		//}
	}
}

function wikismartInsertFormatted(){
	wikismartInitializeAllAttributes();
	var wikismartStartSelectionAdd = 0;
	var wikismartEndSelectionAdd = 0; // Ce qu'il faudra retirer de la longueur de la chaine finale
	var lines = wikismartGetLines(wikismartSelection);
	if(wikismartSelection == null || wikismartIsEmptyString(wikismartSelection)){
		wikismartSelection = "Formatted Text";
		lines[0] = wikismartSelection;
	}
	// Pour chaque ligne, inserer le tag avant le premier caractere en prenant en compte si on ajoute ou non un blanc
	

	var wikismartFinalText = "";
	if(lines != null && lines.length > 0){
		for(var i=0;i<lines.length;i++){
			var tmpline = lines[i];			
			
			// Prendre en compte le cas ou i=0 pour voir le premier caractere avant la selection ( blanc ou \n ou autre ......
			if(i==0 && tmpline.indexOf("\n") == -1){ // Cas d'une selection sans \n ou d'une premiere ligne de selection non complete
			
				// Tag ouvrant
				var fchr = wikismartIndexOfFirstCharacter(tmpline);
				if(fchr == 0){ // Si le premier caractere se trouve des le debut de la selection, il faut regarder si le caracter d'avant dans la textarea est un blanc
					var strbefore = wikismartTextareaContent.substring(0,wikismartStartIndex);
					if((strbefore.lastIndexOf(" ") == strbefore.length - 1) || (strbefore.lastIndexOf("\n") == strbefore.length - 1)){ // Il y a bien un blanc avant dc on insere juste la bullet
						lines[i] = "="+lines[i];
						wikismartStartSelectionAdd = 1;
					}
					else{ // Pas de blanc, donc il faut en inserer un ! 
						lines[i] = " ="+lines[i];
						wikismartStartSelectionAdd = 2;
					}
				}
				else{ // Sinon, il suffit d'ajouter le bold juste avant le premier caractere
					lines[i] = lines[i].substring(0,fchr)+"="+lines[i].substring(fchr,lines[i].length);
					wikismartStartSelectionAdd = fchr+1;
				}
				
				// Tag fermant
				
				tmpline = lines[i];
				var fechr = wikismartIndexOfLastCharacter(tmpline);				
				
				if(lines.length == 1){ // Cas ou il n'y aurait qu'une seule ligne de selectionnée
					if(fechr == (tmpline.length-1)){ // Le dernier caractere se trouve en derniere position de cette ligne ... il faut verifier le caractere suivant
						var strafter = wikismartTextareaContent.substring(wikismartEndIndex,wikismartTextareaContent.length);
						if(strafter.indexOf("\n") == 0 || strafter.indexOf(" ") == 0){ // Dans ce cas, pas besoin d'inserer d'espace
							lines[i]=lines[i]+"=";
							wikismartEndSelectionAdd = 1;
						}
						else{ // Sinon, il faut en rajouter un (d'espace)
							lines[i]=lines[i]+"= ";
							wikismartEndSelectionAdd = 2;
						}
	 				}
					else{ // Sinon, il suffit de rajouter la bullet apres le dernier caractere
						lines[i] = lines[i].substring(0,fechr+1)+"="+lines[i].substring(fechr+1,lines[i].length);
						wikismartEndSelectionAdd = 2;
					}
				}
				else{
					// Sinon, il suffit d'inserer la bullet juste apres le dernier caractere de la ligne
					lines[i] = lines[i].substring(0,fechr+1)+"="+ lines[i].substring(fechr+1,lines[i].length);
				}
			}
			// Ensuite gérer ces lignes de sélection pour bien insérer les bons tags aux bons endroits
			else{
				// Si la ligne est vide .. ne rien toucher
				if(!wikismartIsEmptyString(lines[i].substring(1,lines[i].length))){
				
					// Tag ouvrant
				
					var fchr = wikismartIndexOfFirstCharacter(tmpline.substring(1,tmpline.length));
					if(fchr == 0){ // Si le premier caractere se trouve des le debut de la selection, alors le caractere avant est un retour a la ligne dc pas besoin d'espace
						lines[i] = "\n="+tmpline.substring(1,tmpline.length);
						if(i==0){
							wikismartStartSelectionAdd = 1;
						}
					}
					else{ // Sinon, il suffit d'ajouter le bold juste avant le premier caractere
						if( fchr >= 1){ // Si c'est ailleur, c'est qu'il y a un blanc avant donc juste inserer avant le premier caractere
							lines[i] = lines[i].substring(0,fchr+1)+"="+lines[i].substring(fchr+1,lines[i].length);
							if(i==0){
								wikismartStartSelectionAdd = fchr+1;
							}
						}
						else{ // BUG
						}
					}
					
					// Tag fermant
					
					tmpline = lines[i];
					var fechr = wikismartIndexOfLastCharacter(tmpline);
					if(fechr < tmpline.length-1){ // Le dernier caractere ne se trouve pas a la fin de la ligne donc on peut inserer directement la bullet
						lines[i] = lines[i].substring(0,fechr+1)+"="+lines[i].substring(fechr+1,lines[i].length);
						if(i==lines.length){
							wikismartEndSelectionAdd = 1;
						}
	 				}
					else{ // Sinon, le dernier caractere se trouve a la fin de la ligne ...
						if(i<(lines.length-1)){ // Si ce n'est pas la derniere ligne, alors il y a un retour a la ligne juste apres ... il suffit de rajouter la bullet	
							lines[i] = lines[i]+"=";
						}
						else{ // Sinon, il faut regarder le caracter se trouvant apres dans la textarea
							var strafter = wikismartTextareaContent.substring(wikismartEndIndex,wikismartTextareaContent.length);
							if(strafter.indexOf("\n") == 0 || strafter.indexOf(" ") == 0){ // Dans ce cas, pas besoin d'inserer d'espace
								lines[i]=lines[i]+"=";
								wikismartEndSelectionAdd = 1;
							}
							else{ // Sinon, il faut en rajouter un (d'espace)
								lines[i]=lines[i]+"= ";
								wikismartEndSelectionAdd = 2;
							}
						}
					}
				}
			}
			wikismartFinalText +=lines[i];
		}
		wikismartTextarea.value = wikismartTextareaContent.substring(0,wikismartStartIndex)+wikismartFinalText+wikismartTextareaContent.substring(wikismartEndIndex,wikismartTextareaContent.length);
		//if(navigator.userAgent.toLowerCase().indexOf("opera") == -1){
			wikismartSetSelectionRange(wikismartTextarea,wikismartStartIndex+wikismartStartSelectionAdd,wikismartStartIndex+wikismartFinalText.length-wikismartEndSelectionAdd);
			if(is_firefox){
				wikismartTextarea.scrollTop = wikismartTextareaScrollFirefox;
			}
		//}
		//else{ // Bug pour opera .. il faut rajouter un caractere pour chaque ligne !
			//var nblines = wikismartNbLinesBefore(wikismartStartIndex);
			//wikismartSetSelectionRange(wikismartTextarea,wikismartStartIndex+wikismartStartSelectionAdd+nblines,wikismartStartIndex+wikismartFinalText.length-wikismartEndSelectionAdd+nblines+lines.length-1);
		//}
	}
}


function wikismartInsertBullet(){
	wikismartInitializeAllAttributes();
	var lines = wikismartGetLines(wikismartSelection);
	var firstchange = false;
	var finaltext = "";
	if(wikismartSelection.length == 0){
		var indice = (wikismartTextareaContent.substring(0,wikismartStartIndex)).lastIndexOf("\n");
		var stringbefore = wikismartTextareaContent.substring(0,indice+1);
		var endindice = (wikismartTextareaContent.substring(wikismartStartIndex,wikismartTextareaContent.length)).indexOf("\n");
		if(endindice == -1){
			endindice = wikismartTextareaContent.length;
		}
		else{
			endindice=wikismartStartIndex+endindice;
		}
		var stringafter = wikismartTextareaContent.substring(endindice,wikismartTextareaContent.length);
		var texttotest = wikismartTextareaContent.substring(indice+1,endindice);
		var contains = wikismartTextContainsBullet(texttotest);
		if(contains){
			// Si la ligne contient une bullet .. il faut l'enlever
			wikismartTextareaContent = stringbefore+wikismartDeleteBulletInto(texttotest)+stringafter;
			//For selection parameters
			wikismartStartIndex=(stringbefore+wikismartDeleteBulletInto(texttotest)).length;
			// Else .. maybe bug but no bullet to delete
		}
		else{
			//Sinon il faut en rajouter une tout en gardant l'indentation existante ( pas de contexte par rapport aux lignes précédentes
			// Mais on regarde avant si il n'y a pas une liste d'un autre type
			var containsNumList = wikismartTextContainsNumBullet(texttotest);
			if(containsNumList){ // S'il y en a une, il faut l'enlever avant
				texttotest = wikismartDeleteBulletInto(texttotest);
			}
			 // puis il faut juste mettre la bullet
			var stringtoadd = wikismartInsertBulletInto(texttotest);
			wikismartTextareaContent = stringbefore+stringtoadd+stringafter;
			wikismartStartIndex=(stringbefore+stringtoadd).length;
			
		}
	}
	// Before copy paste
	else{
		if(lines != null && lines.length > 0){
			var contains = -2;
			var tmp ="";
			for(var i=0;i<lines.length;i++){
				if(i==0){
					var indice = (wikismartTextareaContent.substring(0,wikismartStartIndex)).lastIndexOf("\n");
					if(indice == -1){
						indice = 0;
					}
					lines[i] = wikismartTextareaContent.substring(indice,wikismartStartIndex)+lines[i];
					wikismartStartIndex = indice;
				}
				if(contains == -2){ // Initialize this variable just one time
					contains = wikismartContainsBullet(lines); 
				}
				if(lines[i].length != 0 && !(lines[i].length == 1 && lines[i].indexOf("\n") == 0)){
					if(i==0 && lines[i].indexOf("\n") == -1){
						if(contains == 0){
							// Delete bullet .... all list are bullet so no need to delete a num list
							var theindex = lines[i].indexOf("   * ");
							if(theindex != -1){
								lines[i] = wikismartDeleteBulletInto(lines[i]);
							}
						}
						else{
							if(contains == 1){
								//Search if there is a bullet -> if no add one 
								// If a numlist is detected, we have to delete it !
								var containsNumList = wikismartTextContainsNumBullet(lines[i]);
								if(containsNumList){ // S'il y en a une, il faut l'enlever avant
									lines[i] = wikismartDeleteBulletInto(lines[i]);
								}
								if(!wikismartTextContainsBullet(lines[i])){
									var oldL = lines[i].length;
									lines[i] = wikismartInsertBulletInto(lines[i]);
								}
								// Else don't touch
							}
							else{
								// Insert a bullet
								// Before, we have to delete num list if detected
								var containsNumList = wikismartTextContainsNumBullet(lines[i]);
								if(containsNumList){ // S'il y en a une, il faut l'enlever avant
									lines[i] = wikismartDeleteBulletInto(lines[i]);
								}
								var oldL = lines[i].length;
								lines[i] = wikismartInsertBulletInto(lines[i]);
							}
						}	
					}
					else{
						if(!wikismartIsEmptyString(lines[i].substring(1,lines[i].length))){
							if(contains == 0){
								// Delete bullet
								var theindex = lines[i].indexOf("   * ");
								if(theindex != -1){
									lines[i] = lines[i].substring(0,theindex+3)+lines[i].substring(theindex+5,lines[i].length);
								}
							}
							else{
								if(contains == 1){
									//Search if there is a bullet -> if no add one   wikismartTextContainsBullet
									var containsNumList = wikismartTextContainsNumBullet(lines[i].substring(1,lines[i].length));
									if(containsNumList){ 
										lines[i] = "\n"+wikismartDeleteBulletInto(lines[i].substring(1,lines[i].length));
									}
									if(!wikismartTextContainsBullet(lines[i].substring(1,lines[i].length))){
										lines[i] = lines[i].substring(0,1)+wikismartInsertBulletInto(lines[i].substring(1,lines[i].length));
									}
								}
								else{
									// Insert a bullet
									var containsNumList = wikismartTextContainsNumBullet(lines[i].substring(1,lines[i].length));
									if(containsNumList){ 
										lines[i] = "\n"+wikismartDeleteBulletInto(lines[i].substring(1,lines[i].length));
									}
									lines[i] = lines[i].substring(0,1)+wikismartInsertBulletInto(lines[i].substring(1,lines[i].length));
								}
							}
						}
					}
				}
				tmp+=lines[i];
			}
			finaltext = tmp;
		}
		wikismartTextareaContent = wikismartTextareaContent.substring(0,wikismartStartIndex)+finaltext+wikismartTextareaContent.substring(wikismartEndIndex,wikismartTextareaContent.length);
	}
	// After copy/paste
	wikismartTextarea.value = wikismartTextareaContent;
	wikismartStartIndex++;
	wikismartSetSelectionRange(wikismartTextarea,wikismartStartIndex,wikismartStartIndex+finaltext.length-1);
	if(is_firefox){
		wikismartTextarea.scrollTop = wikismartTextareaScrollFirefox;
	}
}

function wikismartInsertBulletInto(thetext){
	if(thetext != null && thetext.length > 0){
		var fchar = wikismartIndexOfFirstCharacter(thetext);
		// nb of three spaces :
		var fcharreste = fchar%3; // nb d'espaces restant apres les groupes de 3 espaces
		var fcharint = (fchar-fcharreste)/3;
		if(fcharint==0){
			thetext = thetext.substring(0,fchar-fcharreste)+"   * "+thetext.substring(fchar,thetext.length);
		}
		else{
			thetext = thetext.substring(0,fchar-fcharreste)+"* "+thetext.substring(fchar,thetext.length);
		}
	}
	else{
		if(thetext.length == 0){
			return "   * ";
		}
	}
	return thetext;
}

function wikismartInsertNumBulletInto(thetext){
	if(thetext != null && thetext.length > 0){
		var fchar = wikismartIndexOfFirstCharacter(thetext);
		// nb of three spaces :
		var fcharreste = fchar%3; // nb d'espaces restant apres les groupes de 3 espaces
		var fcharint = (fchar-fcharreste)/3;
		if(fcharint==0){
			thetext = thetext.substring(0,fchar-fcharreste)+"   1 "+thetext.substring(fchar,thetext.length);
		}
		else{
			thetext = thetext.substring(0,fchar-fcharreste)+"1 "+thetext.substring(fchar,thetext.length);
		}
	}
	else{
		if(thetext.length == 0){
			return "   1 ";
		}
	}
	return thetext;
}

function wikismartDeleteBulletInto(thetext){
	var begin = 3*wikismartIndexOfBullet(thetext);
	begin+=3;
	if(begin >= 0){ // Index of the bullet
		thetext = thetext.substring(0,begin)+ thetext.substring(begin+2,thetext.length);
	}
	return thetext;
}

// Test a string that contains \n character at the first place
function wikismartTextContainsBullet(texttotest){
	if(texttotest != null && texttotest.length > 0){
		if(texttotest.indexOf("   * ") >= 0){
			if(wikismartIsEmptyString(texttotest.substring(1,texttotest.indexOf("   * ")))){
				return true;
			}
		}
	}

	return false; // aucune bullet détectée, il faut donc les mettre
}

function wikismartTextContainsNumBullet(texttotest){
	if(texttotest != null && texttotest.length > 0){
		if(texttotest.indexOf("   1 ") >= 0){
			if(wikismartIsEmptyString(texttotest.substring(1,texttotest.indexOf("   1 ")))){
				return true;
			}
		}
	}

	return false; // aucune bullet détectée, il faut donc les mettre
}

function wikismartContainsBullet(list){
	if(list != null && list.length > 0){
		var all = 0;
		var avlines = 0;
		if(list.length == 1){
			if(wikismartTextContainsBullet(list[0])){
				return 0;
			}
			else{
				return -1;
			}
		}
		for(var i=0;i<list.length;i++){
			var tmp = list[i];
			if(tmp.indexOf("   * ") >= 0){
				if(wikismartIsEmptyString(tmp.substring(1,tmp.indexOf("   * ")))){
					all++;
				}
			}
			if(tmp.length > 1 || (tmp.length == 1 && tmp.indexOf("\r") != 0 && tmp.indexOf("\n") != 0 )){
				avlines++;
			}
		}
		if(all == avlines){ // all lines are bullet -> we can delete the bullet !
			return 0;
		}
		else{ // some lines are bullet, others none ... on met donc les bullet ds les lignes ki n'en contiennent pas
			return 1;
		}
	}
	return -1; // aucune bullet détectée, il faut donc les mettre
}

function wikismartContainsNumBullet(list){
	if(list != null && list.length > 0){
		var all = 0;
		var avlines = 0;
		if(list.length == 1){
			if(wikismartTextContainsNumBullet(list[0])){
				return 0;
			}
			else{
				return -1;
			}
		}
		for(var i=0;i<list.length;i++){
			var tmp = list[i];
			if(tmp.indexOf("   1 ") >= 0){
				if(wikismartIsEmptyString(tmp.substring(1,tmp.indexOf("   1 ")))){
					all++;
				}
			}
			if(tmp.length > 1 || (tmp.length == 1 && tmp.indexOf("\r") != 0 && tmp.indexOf("\n") != 0 )){
				avlines++;
			}
		}
		if(all == avlines){ // all lines are bullet -> we can delete the bullet !
			return 0;
		}
		else{ // some lines are bullet, others none ... on met donc les bullet ds les lignes ki n'en contiennent pas
			return 1;
		}
	}
	return -1; // aucune bullet détectée, il faut donc les mettre
}

function wikismartIndexOfBullet(text){
	var result = -1;
	wikismartListType = "";
	wikismartListToDelete = false;
	if(text.indexOf("   1 ") >= 0){
		while(text.indexOf("   ") == 0){
			text = text.substring(3,text.length);
			wikismartListType+="   ";
			result++;
		}
		wikismartListType+="1 ";
		if(text.indexOf("1 ") == 0){
			if(wikismartIsEmptyString(text.substring(2,text.length))){
				wikismartListToDelete = true;
				return -1;
			}
			else{
				wikismartListToDelete = false;
			}
			return result;
		}
	}
	else{
		if(text.indexOf("   * ") >= 0){
			while(text.indexOf("   ") == 0){
				text = text.substring(3,text.length);
				wikismartListType+="   ";
				result++;
			}
			wikismartListType+="* ";
			if(text.indexOf("* ") == 0){
				
				if(wikismartIsEmptyString(text.substring(1,text.length))){
					wikismartListToDelete = true;
					return -1;
				}
				else{
					wikismartListToDelete = false;
				}
				return result;
			}
		}
	}
	return result;
}

function wikismartInsertNumList(){
	wikismartInitializeAllAttributes();
	var lines = wikismartGetLines(wikismartSelection);
	var firstchange = false;
	var finaltext = "";
	if(wikismartSelection.length == 0){
		var indice = (wikismartTextareaContent.substring(0,wikismartStartIndex)).lastIndexOf("\n");
		var stringbefore = wikismartTextareaContent.substring(0,indice+1);
		var endindice = (wikismartTextareaContent.substring(wikismartStartIndex,wikismartTextareaContent.length)).indexOf("\n");
		if(endindice == -1){
			endindice = wikismartTextareaContent.length;
		}
		else{
			endindice=wikismartStartIndex+endindice;
		}
		var stringafter = wikismartTextareaContent.substring(endindice,wikismartTextareaContent.length);
		var texttotest = wikismartTextareaContent.substring(indice+1,endindice);
		var contains = wikismartTextContainsNumBullet(texttotest);
		if(contains){
			// Si la ligne contient une bullet .. il faut l'enlever
			wikismartTextareaContent = stringbefore+wikismartDeleteBulletInto(texttotest)+stringafter;
			//For selection parameters
			wikismartStartIndex=(stringbefore+wikismartDeleteBulletInto(texttotest)).length;
			// Else .. maybe bug but no bullet to delete
		}
		else{
			var containsBulletList = wikismartTextContainsBullet(texttotest);
			if(containsBulletList){ // S'il y en a une, il faut l'enlever avant
				texttotest = wikismartDeleteBulletInto(texttotest);
			}
			//Sinon il faut en rajouter une tout en gardant l'indentation existante ( pas de contexte par rapport aux lignes précédentes
			var stringtoadd = wikismartInsertNumBulletInto(texttotest);
			wikismartTextareaContent = stringbefore+stringtoadd+stringafter;
			wikismartStartIndex=(stringbefore+stringtoadd).length;
		}
	}
	// Before copy paste
	else{
		if(lines != null && lines.length > 0){
			var contains = -2;
			var tmp ="";
			for(var i=0;i<lines.length;i++){
				if(i==0){
					var indice = (wikismartTextareaContent.substring(0,wikismartStartIndex)).lastIndexOf("\n");
					if(indice == -1){
						indice = 0;
					}
					lines[i] = wikismartTextareaContent.substring(indice,wikismartStartIndex)+lines[i];
					wikismartStartIndex = indice;
				}
				if(contains == -2){ // Initialize this variable just one time
					contains = wikismartContainsNumBullet(lines); // added ... 
				}
				if(lines[i].length != 0 && !(lines[i].length == 1 && lines[i].indexOf("\n") == 0)){
					if(i==0 && lines[i].indexOf("\n") == -1){
						if(contains == 0){
							// Delete bullet
							var theindex = lines[i].indexOf("   1 ");
							if(theindex != -1){
								lines[i] = wikismartDeleteBulletInto(lines[i]);
							}
						}
						else{
							if(contains == 1){
								//Search if there is a bullet -> if no add one 
								var containsBulletList = wikismartTextContainsBullet(lines[i]);
								if(containsBulletList){ // S'il y en a une, il faut l'enlever avant
									lines[i] = wikismartDeleteBulletInto(lines[i]);
								}
								if(!wikismartTextContainsNumBullet(lines[i])){
									var oldL = lines[i].length;
									lines[i] = wikismartInsertNumBulletInto(lines[i]);
								}
								// Else don't touch
							}
							else{
								// Insert a bullet
								var containsBulletList = wikismartTextContainsBullet(lines[i]);
								if(containsBulletList){ // S'il y en a une, il faut l'enlever avant
									lines[i] = wikismartDeleteBulletInto(lines[i]);
								}
								var oldL = lines[i].length;
								lines[i] = wikismartInsertNumBulletInto(lines[i]);
							}
						}	
					}
					else{
						if(!wikismartIsEmptyString(lines[i].substring(1,lines[i].length))){
							if(contains == 0){
								// Delete bullet
								var theindex = lines[i].indexOf("   1 ");
								if(theindex != -1){
									lines[i] = lines[i].substring(0,theindex+3)+lines[i].substring(theindex+5,lines[i].length);
								}
							}
							else{
								if(contains == 1){
									//Search if there is a bullet -> if no add one
									var containsBulletList = wikismartTextContainsBullet(lines[i].substring(1,lines[i].length));
									if(containsBulletList){ // S'il y en a une, il faut l'enlever avant
										lines[i] = "\n"+wikismartDeleteBulletInto(lines[i].substring(1,lines[i].length));
									}									
									if(!wikismartTextContainsNumBullet(lines[i].substring(1,lines[i].length))){
										lines[i] = lines[i].substring(0,1)+wikismartInsertNumBulletInto(lines[i].substring(1,lines[i].length));
									}
								}
								else{
									// Insert a bullet
									var containsBulletList = wikismartTextContainsBullet(lines[i].substring(1,lines[i].length));
									if(containsBulletList){ // S'il y en a une, il faut l'enlever avant
										lines[i] = "\n"+wikismartDeleteBulletInto(lines[i].substring(1,lines[i].length));
									}
									lines[i] = lines[i].substring(0,1)+wikismartInsertNumBulletInto(lines[i].substring(1,lines[i].length));
								}
							}
						}
					}
				}
				tmp+=lines[i];
			}
			finaltext = tmp;
		}
		wikismartTextareaContent = wikismartTextareaContent.substring(0,wikismartStartIndex)+finaltext+wikismartTextareaContent.substring(wikismartEndIndex,wikismartTextareaContent.length);
	}
	// After copy/paste
	wikismartTextarea.value = wikismartTextareaContent;
	wikismartStartIndex++;
	wikismartSetSelectionRange(wikismartTextarea,wikismartStartIndex,wikismartStartIndex+finaltext.length-1);
	if(is_firefox){
		wikismartTextarea.scrollTop = wikismartTextareaScrollFirefox;
	}
}

function wikismartInsertExlink(link, text){
	if(wikismartSelection.length == 0){
		wikismartSelection = "Your text";
	}
	var sfchar = wikismartIndexOfFirstCharacter(text);
	var sToAddBefore = "";
	var sToAddAfter = "";
	if(sfchar != 0 && sfchar != -1){
		text = text.substring(sfchar, text.length);
		for(var i=0;i<sfchar;i++){
			sToAddBefore = sToAddBefore+" ";
		}
	}
	else{
		sfchar = 0;
	}
	var slchar = wikismartIndexOfLastCharacter(text);
	if(slchar != 0 && slchar != -1){
		if(text.length != (slchar+1)){
			var bToAdd = text.length - (slchar+1);
			for(var i=0;i<bToAdd;i++){
				sToAddAfter = sToAddAfter+" ";
			}
		}
		text = text.substring(0, (slchar+1));
	}
	document.getElementById("smarteditorExternalLinkTextInput").value = "";
	wikismartTextareaContent = wikismartTextareaContent.substring(0,wikismartStartIndex)+sToAddBefore+"[["+link+"]["+text+"]]"+sToAddAfter+wikismartTextareaContent.substring(wikismartEndIndex,wikismartTextareaContent.length);
	wikismartTextarea.value = wikismartTextareaContent;
	
	wikismartSetSelectionRange(wikismartTextarea,wikismartStartIndex+sToAddBefore.length,wikismartStartIndex+sToAddBefore.length+("[["+link+"]["+text+"]]").length);
	if(is_firefox){
		wikismartTextarea.scrollTop = wikismartTextareaScrollFirefox;
	}
}

function wikismartInsertExlinkButInit(link, text){
	wikismartInitializeAllAttributes();
	text = wikismartSelection;
	if(wikismartSelection.length == 0){
		wikismartSelection = "Your text";
	}
	var sfchar = wikismartIndexOfFirstCharacter(text);
	var sToAddBefore = "";
	var sToAddAfter = "";
	if(sfchar != 0 && sfchar != -1){
		text = text.substring(sfchar, text.length);
		for(var i=0;i<sfchar;i++){
			sToAddBefore = sToAddBefore+" ";
		}
	}
	else{
		sfchar = 0;
	}
	var slchar = wikismartIndexOfLastCharacter(text);
	if(slchar != 0 && slchar != -1){
		if(text.length != (slchar+1)){
			var bToAdd = text.length - (slchar+1);
			for(var i=0;i<bToAdd;i++){
				sToAddAfter = sToAddAfter+" ";
			}
		}
		text = text.substring(0, (slchar+1));
	}
	wikismartTextareaContent = wikismartTextareaContent.substring(0,wikismartStartIndex)+sToAddBefore+"[["+link+"]["+text+"]]"+sToAddAfter+wikismartTextareaContent.substring(wikismartEndIndex,wikismartTextareaContent.length);
	wikismartTextarea.value = wikismartTextareaContent;
	
	wikismartSetSelectionRange(wikismartTextarea,wikismartStartIndex+sToAddBefore.length,wikismartStartIndex+sToAddBefore.length+("[["+link+"]["+text+"]]").length);
	if(is_firefox){
		wikismartTextarea.scrollTop = wikismartTextareaScrollFirefox;
	}
}

function wikismartIndent(){
	wikismartInitializeAllAttributes();
	var lines = wikismartGetLines(wikismartSelection);
	var finaltext = "";
	var tmp = "";
	
	if(wikismartSelection.length == 0){
		var indice = (wikismartTextareaContent.substring(0,wikismartStartIndex)).lastIndexOf("\n");
		wikismartTextareaContent = wikismartTextareaContent.substring(0,indice+1)+"   "+wikismartTextareaContent.substring(indice+1,wikismartTextareaContent.length);
	}
	else{
		if(lines != null && lines.length > 0){
			for(var i=0;i<lines.length;i++){
				if(i==0){
					var indice = (wikismartTextareaContent.substring(0,wikismartStartIndex)).lastIndexOf("\n");
					if(indice == -1){
						indice = 0;
					}
					lines[i] = wikismartTextareaContent.substring(indice,wikismartStartIndex)+lines[i];
					wikismartStartIndex = indice;
				}
				if(lines[i].length != 0 && !(lines[i].length == 1 && lines[i].indexOf("\n") == 0)){
					if(i==0 && lines[i].indexOf("\n") == -1){
						tmp+="   "+lines[i];
						
					}
					else{
						if(!wikismartIsEmptyString(lines[i].substring(1,lines[i].length))){
							tmp+=lines[i].substring(0,1)+"   "+lines[i].substring(1,lines[i].length);
							
						}
						else{
							tmp+=lines[i];
						}
					}
				}
				else{
					tmp+=lines[i];
				}
			}
			finaltext = tmp;
		}
		wikismartTextareaContent = wikismartTextareaContent.substring(0,wikismartStartIndex)+finaltext+wikismartTextareaContent.substring(wikismartEndIndex,wikismartTextareaContent.length);
	}
	// Selection
	wikismartTextarea.value = wikismartTextareaContent;
	var tsleft = wikismartStartIndex+1;
	var tsright = wikismartStartIndex+finaltext.length;
	if(wikismartSelection.length == 0){
		tsleft = wikismartStartIndex+3;
		tsright = tsleft;
	}
	wikismartSetSelectionRange(wikismartTextarea,tsleft,tsright);
	if(is_firefox){
		wikismartTextarea.scrollTop = wikismartTextareaScrollFirefox;
	}
}

function wikismartOutdent(){
	wikismartInitializeAllAttributes();
	var lines = wikismartGetLines(wikismartSelection);
	var finaltext = "";
	var tmp = "";
	var tsdeleted = false;
	if(wikismartSelection.length == 0){
		var indice = (wikismartTextareaContent.substring(0,wikismartStartIndex)).lastIndexOf("\n");
		var indiceFin = (wikismartTextareaContent.substring(wikismartStartIndex,wikismartTextareaContent.length)).indexOf("\n");
		if(indiceFin == -1){
			indiceFin = wikismartTextareaContent.length;
		}
		else{
			indiceFin+=wikismartStartIndex;
		}
		var lineToTest = wikismartTextareaContent.substring(indice+1,indiceFin);
		if(wikismartIndexOfBullet(lineToTest) != 0){
			if(((lineToTest.length > 5) && wikismartListToDelete) || (!wikismartListToDelete) ){
					if(wikismartTextareaContent.substring(indice+1,wikismartTextareaContent.length).indexOf("   ") == 0){
						wikismartTextareaContent = wikismartTextareaContent.substring(0,indice+1)+wikismartTextareaContent.substring(indice+4,wikismartTextareaContent.length);
					tsdeleted = true;
					}
				else{
					
				}
			}	
		}
	}
	else{
		if(lines != null && lines.length > 0){
			for(var i=0;i<lines.length;i++){
				if(i==0){
					var indice = (wikismartTextareaContent.substring(0,wikismartStartIndex)).lastIndexOf("\n");
					if(indice == -1){
						indice = 0;
					}
					lines[i] = wikismartTextareaContent.substring(indice,wikismartStartIndex)+lines[i];
					wikismartStartIndex = indice;
				}
				
				if(lines[i].length != 0 && !(lines[i].length == 1 && lines[i].indexOf("\n") == 0)){
					if(i==0 && lines[i].indexOf("\n") == -1){
						if(wikismartIndexOfBullet(lines[i]) != 0){ // Added
							if(((lines[i].length > 5) && wikismartListToDelete) || (!wikismartListToDelete) ){ // Added
								if(lines[i].indexOf("   ") == 0){
									lines[i] = lines[i].substring(3,lines[i].length);
								}
							}
						}
						tmp+=lines[i];
					}
					else{
						if(!wikismartIsEmptyString(lines[i].substring(1,lines[i].length))){
							if(wikismartIndexOfBullet(lines[i].substring(1,lines[i].length)) != 0){ // Added
								if(((lines[i].substring(1,lines[i].length).length > 5) && wikismartListToDelete) || (!wikismartListToDelete) ){
									if(lines[i].indexOf("   ") == 1){
										lines[i] = lines[i].substring(0,1)+lines[i].substring(4,lines[i].length);
									}
								}
							}
							tmp+=lines[i];
						}
						else{
							tmp+=lines[i];
						}
					}
				}
				else{
					tmp+=lines[i];
				}
			}
			finaltext = tmp;
		}
		wikismartTextareaContent = wikismartTextareaContent.substring(0,wikismartStartIndex)+finaltext+wikismartTextareaContent.substring(wikismartEndIndex,wikismartTextareaContent.length);
	}
	wikismartTextarea.value = wikismartTextareaContent;
	var tsleft = wikismartStartIndex+1;
	var tsright = wikismartStartIndex+finaltext.length;
	if(wikismartSelection.length == 0 && tsdeleted){
		tsleft = wikismartStartIndex-3;
		tsright = tsleft;
	}
	wikismartSetSelectionRange(wikismartTextarea,tsleft,tsright);
	if(is_firefox){
		wikismartTextarea.scrollTop = wikismartTextareaScrollFirefox;
	}
}


function wikismartOutdent2(){
	var lines = wikismartGetLines(wikismartSelection);
	var finaltext = "";
	var tmp = "";
	var tsdeleted = false;
	if(wikismartSelection.length == 0){
		var indice = (wikismartTextareaContent.substring(0,wikismartStartIndex)).lastIndexOf("\n");
		var indiceFin = (wikismartTextareaContent.substring(wikismartStartIndex,wikismartTextareaContent.length)).indexOf("\n");
		if(indiceFin == -1){
			indiceFin = wikismartTextareaContent.length;
		}
		else{
			indiceFin+=wikismartStartIndex;
		}
		var lineToTest = wikismartTextareaContent.substring(indice+1,indiceFin);
		if(wikismartIndexOfBullet(lineToTest) != 0){
			if(((lineToTest.length > 5) && wikismartListToDelete) || (!wikismartListToDelete) ){
					if(wikismartTextareaContent.substring(indice+1,wikismartTextareaContent.length).indexOf("   ") == 0){
						wikismartTextareaContent = wikismartTextareaContent.substring(0,indice+1)+wikismartTextareaContent.substring(indice+4,wikismartTextareaContent.length);
					tsdeleted = true;
					}
				else{
					
				}
			}	
		}
	}
	else{
		if(lines != null && lines.length > 0){
			for(var i=0;i<lines.length;i++){
				if(i==0){
					var indice = (wikismartTextareaContent.substring(0,wikismartStartIndex)).lastIndexOf("\n");
					if(indice == -1){
						indice = 0;
					}
					lines[i] = wikismartTextareaContent.substring(indice,wikismartStartIndex)+lines[i];
					wikismartStartIndex = indice;
				}
				
				if(lines[i].length != 0 && !(lines[i].length == 1 && lines[i].indexOf("\n") == 0)){
					if(i==0 && lines[i].indexOf("\n") == -1){
						if(wikismartIndexOfBullet(lines[i]) != 0){ // Added
							if(((lines[i].length > 5) && wikismartListToDelete) || (!wikismartListToDelete) ){ // Added
								if(lines[i].indexOf("   ") == 0){
									lines[i] = lines[i].substring(3,lines[i].length);
								}
							}
						}
						tmp+=lines[i];
					}
					else{
						if(!wikismartIsEmptyString(lines[i].substring(1,lines[i].length))){
							if(wikismartIndexOfBullet(lines[i].substring(1,lines[i].length)) != 0){ // Added
								if(((lines[i].substring(1,lines[i].length).length > 5) && wikismartListToDelete) || (!wikismartListToDelete) ){
									if(lines[i].indexOf("   ") == 1){
										lines[i] = lines[i].substring(0,1)+lines[i].substring(4,lines[i].length);
									}
								}
							}
							tmp+=lines[i];
						}
						else{
							tmp+=lines[i];
						}
					}
				}
				else{
					tmp+=lines[i];
				}
			}
			finaltext = tmp;
		}
		wikismartTextareaContent = wikismartTextareaContent.substring(0,wikismartStartIndex)+finaltext+wikismartTextareaContent.substring(wikismartEndIndex,wikismartTextareaContent.length);
	}
	wikismartTextarea.value = wikismartTextareaContent;
	var tsleft = wikismartStartIndex+1;
	var tsright = wikismartStartIndex+finaltext.length;
	if(wikismartSelection.length == 0 && tsdeleted){
		tsleft = wikismartStartIndex-3;
		tsright = tsleft;
	}
	wikismartSetSelectionRange(wikismartTextarea,tsleft,tsright);
	if(is_firefox){
		wikismartTextarea.scrollTop = wikismartTextareaScrollFirefox;
	}
}


function wikismartNop(){
	wikismartInitializeAllAttributes();
	wikismartTextareaContent = wikismartTextareaContent.substring(0,wikismartStartIndex)+"<nop>"+wikismartSelection+wikismartTextareaContent.substring(wikismartEndIndex,wikismartTextareaContent.length);
	wikismartTextarea.value = wikismartTextareaContent;
	wikismartSetSelectionRange(wikismartTextarea,wikismartStartIndex+"<nop>".length,wikismartStartIndex+"<nop>".length+wikismartSelection.length);
	if(is_firefox){
		wikismartTextarea.scrollTop = wikismartTextareaScrollFirefox;
	}
}

// You must have an item with the id wikismartsig containing page signature - change it in your edit template file
function wikismartSign(){
	wikismartInitializeAllAttributes();
	var sign = document.getElementById("sig");
	if(sign != null){
		wikismartTextareaContent = wikismartTextareaContent.substring(0,wikismartStartIndex)+sign.value+wikismartTextareaContent.substring(wikismartEndIndex,wikismartTextareaContent.length);
	}
	wikismartTextarea.value = wikismartTextareaContent;
	wikismartSetSelectionRange(wikismartTextarea,wikismartStartIndex,wikismartStartIndex+sign.value.length);
	if(is_firefox){
		wikismartTextarea.scrollTop = wikismartTextareaScrollFirefox;
	}

}

function wikismartInsertGMTDate(){
	wikismartInitializeAllAttributes();
	var date = new Date();
	wikismartTextareaContent = wikismartTextareaContent.substring(0,wikismartStartIndex)+date.toGMTString()+wikismartTextareaContent.substring(wikismartEndIndex,wikismartTextareaContent.length);
	wikismartTextarea.value = wikismartTextareaContent;
	wikismartSetSelectionRange(wikismartTextarea,wikismartStartIndex,wikismartStartIndex+date.toGMTString().length);
	if(is_firefox){
		wikismartTextarea.scrollTop = wikismartTextareaScrollFirefox;
	}

}

function wikismartInsertSimpleTOC(){
	wikismartInitializeAllAttributes();
	var wikismartTOC = "%TOC%";
	wikismartTextareaContent = wikismartTextareaContent.substring(0,wikismartStartIndex)+wikismartTOC+wikismartTextareaContent.substring(wikismartEndIndex,wikismartTextareaContent.length);
	wikismartTextarea.value = wikismartTextareaContent;
	wikismartSetSelectionRange(wikismartTextarea,wikismartStartIndex,wikismartStartIndex+wikismartTOC.length);
	if(is_firefox){
		wikismartTextarea.scrollTop = wikismartTextareaScrollFirefox;
	}

}

function wikismartInsertSimpleTag(ttsTag){

		wikismartInitializeAllAttributes();

	var wikismartTag = ttsTag;

	wikismartTextareaContent = wikismartTextareaContent.substring(0,wikismartStartIndex)+wikismartTag+wikismartTextareaContent.substring(wikismartEndIndex,wikismartTextareaContent.length);
	wikismartTextarea.value = wikismartTextareaContent;
	wikismartSetSelectionRange(wikismartTextarea,wikismartStartIndex,wikismartStartIndex+wikismartTag.length);
	if(is_firefox){
		wikismartTextarea.scrollTop = wikismartTextareaScrollFirefox;
	}

}

function wikismartInsertSimpleTagButNotInit(ttsTag){

	var wikismartTag = ttsTag;

	wikismartTextareaContent = wikismartTextareaContent.substring(0,wikismartStartIndex)+wikismartTag+wikismartTextareaContent.substring(wikismartEndIndex,wikismartTextareaContent.length);
	wikismartTextarea.value = wikismartTextareaContent;
	wikismartSetSelectionRange(wikismartTextarea,wikismartStartIndex,wikismartStartIndex+wikismartTag.length);
	if(is_firefox){
		wikismartTextarea.scrollTop = wikismartTextareaScrollFirefox;
	}

}

function wikismartInsertSimpleTagAndNoSelect(ttsTag){
	wikismartInitializeAllAttributes();
	var wikismartTag = ttsTag;
	wikismartTextareaContent = wikismartTextareaContent.substring(0,wikismartStartIndex)+wikismartTag+wikismartTextareaContent.substring(wikismartEndIndex,wikismartTextareaContent.length);
	wikismartTextarea.value = wikismartTextareaContent;
	wikismartSetSelectionRange(wikismartTextarea,wikismartStartIndex+wikismartTag.length,wikismartStartIndex+wikismartTag.length);
	if(is_firefox){
		wikismartTextarea.scrollTop = wikismartTextareaScrollFirefox;
	}
}

function wikismartInsertHRTag(){
	wikismartInitializeAllAttributes();
	var wikismartTag = "---";
	var tsindbefore = wikismartTextareaContent.substring(0,wikismartStartIndex).lastIndexOf("\n");
	if(!wikismartIsEmptyString(wikismartTextareaContent.substring(tsindbefore+1,wikismartStartIndex))){
		wikismartTag = "\n"+wikismartTag;
	}
	else{
		wikismartStartIndex = tsindbefore+1;
	}
	var tsindafter = wikismartTextareaContent.substring(wikismartEndIndex,wikismartTextareaContent.length).indexOf("\n");
	if(tsindafter == -1){
		tsindafter = wikismartTextareaContent.length-1;
	}
	else{
		tsindafter+=wikismartEndIndex;
	}
	if(!wikismartIsEmptyString(wikismartTextareaContent.substring(wikismartEndIndex,tsindafter))){
		wikismartTag = wikismartTag+"\n";
	}	
	wikismartTextareaContent = wikismartTextareaContent.substring(0,wikismartStartIndex)+wikismartTag+wikismartTextareaContent.substring(wikismartEndIndex,wikismartTextareaContent.length);
	wikismartTextarea.value = wikismartTextareaContent;
	wikismartSetSelectionRange(wikismartTextarea,wikismartStartIndex,wikismartStartIndex+wikismartTag.length);
	if(is_firefox){
		wikismartTextarea.scrollTop = wikismartTextareaScrollFirefox;
	}

}

// Increase textarea rows value
function wikismartIncreaseSize(){
	wikismartTextarea.rows = wikismartTextarea.rows+1;
	wikismartTextAreaRows = wikismartTextarea.rows;

}

// Decrease textarea rows value
function wikismartDecreaseSize(){
	if(wikismartTextarea.rows-1 > 0){
		wikismartTextarea.rows = wikismartTextarea.rows-1;
		wikismartTextAreaRows = wikismartTextarea.rows;	
	}
}

// Adjust textarea rows value to lines
function wikismartAdjustSize(){
	if(!wikismartEngineAction){
		wikismartEngineAction = true;
		if(wikismartTextarea.rows == wikismartTextAreaRows){
			wikismartInitializeAllAttributes();
			var cursorbefore = wikismartStartIndex;
			var cursorafter = wikismartEndIndex;
			wikismartSetSelectionRange(wikismartTextarea,0,wikismartTextarea.value.length);
			wikismartInitializeAllAttributes();
			var wikismartnblines = wikismartGetLines(wikismartTextareaContent).length;
			wikismartTextarea.rows = wikismartnblines;
			wikismartTextarea.value = wikismartTextareaContent;
			wikismartAdjustActivated = true;
			wikismartSetSelectionRange(wikismartTextarea,cursorbefore,cursorafter);
		}
		else{
			wikismartInitializeAllAttributes();
			wikismartTextarea.rows = wikismartTextAreaRows;
			wikismartAdjustActivated = false;
			wikismartTextarea.value = wikismartTextareaContent;
			wikismartSetSelectionRange(wikismartTextarea,wikismartStartIndex,wikismartEndIndex);
		}
		wikismartEngineAction = false;
	}
}

function wikismartAutoAdjust(){
	if(wikismartAdjustActivated){
		wikismartInitializeAllAttributes();
		var cursorbefore = wikismartStartIndex;
		var cursorafter = wikismartEndIndex;
		wikismartSetSelectionRange(wikismartTextarea,0,wikismartTextarea.value.length);
		wikismartInitializeAllAttributes();
		var wikismartnblines = wikismartGetLines(wikismartTextareaContent).length;
		wikismartTextarea.rows = wikismartnblines;
		wikismartTextarea.value = wikismartTextareaContent;
		wikismartAdjustActivated = true;
		wikismartSetSelectionRange(wikismartTextarea,cursorbefore,cursorafter);
	}
}

function wikismartInsertHeading(wikismartLine, wikismartHeadingValue, multiline){
	if(wikismartLine != null && wikismartHeadingValue != null){
		var containsHd = -2;
		var tsindex = 0; // If the line begin with \n, we have to test string without \n
		var teststartindice = wikismartLine.indexOf("\n");
		if(teststartindice == 0){
			tsindex = 1;
		}
		containsHd = wikismartContainsHeading(wikismartLine.substring(tsindex,wikismartLine.length));

		if(containsHd != -1){ // Si la ligne contient un heading, alors il faut le remplacer par celui qui est demandé
			var tsendline = wikismartLine.substring((tsindex+containsHd+3),wikismartLine.length);
			var tsindexOf = wikismartIndexOfFirstCharacter(tsendline);
			if(tsindexOf != -1){
				tsendline = tsendline.substring(tsindexOf,tsendline.length);
			}
			wikismartLine = wikismartLine.substring(0,tsindex)+wikismartHeadingValue+tsendline;
		}
		else{ // Sinon, il suffit de le rajouter
			if((!wikismartIsEmptyString(wikismartLine.substring(tsindex,wikismartLine.length))) || (!multiline)){
				var tsendline = wikismartLine.substring(tsindex,wikismartLine.length);
				var tsindexOf = wikismartIndexOfFirstCharacter(tsendline);
				if(tsindexOf != -1){
					tsendline = tsendline.substring(tsindexOf,tsendline.length);
				}
				wikismartLine = wikismartLine.substring(0,tsindex)+wikismartHeadingValue+tsendline;
			}
		}
	}
	return wikismartLine;
}

// Donner une ligne avec (a l'indice 0)  ou sans retour chariot
function smarteditNormalStyleIntoLine(wikismartLine){
	if(wikismartLine != null && wikismartLine.length > 0){
		var containsHd = -2;
		var tsindex = 0; // If the line begin with \n, we have to test string without \n
		var teststartindice = wikismartLine.indexOf("\n");
		if(teststartindice == 0){
			tsindex = 1;
		}
		containsHd = wikismartContainsHeading(wikismartLine.substring(tsindex,wikismartLine.length));
		if(containsHd != -1){ // Si la ligne contient un heading, alors il faut le remplacer par celui qui est demandé
			wikismartLine = wikismartLine.substring(0,tsindex)+wikismartLine.substring((tsindex+containsHd+3),wikismartLine.length);
			var tsfirstchar = wikismartIndexOfFirstCharacter(wikismartLine.substring(tsindex,wikismartLine.length));
			if(tsfirstchar != -1){
				wikismartLine = wikismartLine.substring(0,tsindex)+wikismartLine.substring(tsfirstchar,wikismartLine.length);
			}
		}
	}
	return wikismartLine;
}

function wikismartFormatText(tagvalue){

	var lines = wikismartGetLines(wikismartSelection);
	var tsselectstart = wikismartStartIndex;
	var tsselectend = wikismartEndIndex;
	finaltext = "";
	var tmp = "";
	
	if(wikismartSelection.length == 0){ // Si la selection est nulle, on recupere la ligne (en entier)  ou se trouve le curseur pour la traiter
		var stringBefore = wikismartTextareaContent.substring(0,wikismartStartIndex);
		var stringAfter = wikismartTextareaContent.substring(wikismartStartIndex,wikismartTextareaContent.length);
		var startIndice = stringBefore.lastIndexOf("\n");
		if(startIndice == -1){ // Si on en trouve pas, c'est que l'on est sur la première ligne
			startIndice = 0;
		}
		
		var endIndice = stringAfter.indexOf("\n");
		if(endIndice == -1){ // Si on en trouve pas, c'est que l'on est sur la dernière ligne
			endIndice = wikismartTextareaContent.length;
		}
		if(endIndice != wikismartTextareaContent.length){
			endIndice+=wikismartStartIndex;
		}
		var tscurrentline = wikismartTextareaContent.substring(startIndice,endIndice);
		tscurrentline = wikismartInsertHeading(tscurrentline, tagvalue, false);
		wikismartTextareaContent = wikismartTextareaContent.substring(0,startIndice)+tscurrentline+wikismartTextareaContent.substring(endIndice,wikismartTextareaContent.length);
		tsselectstart = startIndice+tscurrentline.length;
		tsselectend = tsselectstart;
	}
	else{ // Si la sélection n'est pas vide, il faut bien sur récupérer toutes les lignes et les traiter
		var tsfinaltext = "";
		if(lines != null && lines.length > 0){
		
			// Récupération de la première ligne en entier
			var stringBefore = wikismartTextareaContent.substring(0,wikismartStartIndex);
			var startIndice = stringBefore.lastIndexOf("\n");
			if(startIndice == -1){
				startIndice = 0;
			}
			lines[0] = stringBefore.substring(startIndice,wikismartStartIndex)+lines[0];
			
			// Récupération de la dernière ligne en entier
			var stringAfter = wikismartTextareaContent.substring(wikismartEndIndex,wikismartTextareaContent.length);
			var endIndice = stringAfter.indexOf("\n");
			if(endIndice == -1){
				endIndice=wikismartTextareaContent.length;
			}
			if(endIndice != wikismartTextareaContent.length){
				endIndice+=wikismartEndIndex;
			}
			lines[lines.length-1] = lines[lines.length-1]+wikismartTextareaContent.substring(wikismartEndIndex,endIndice);
			for(var i=0;i<lines.length;i++){
				tsfinaltext += wikismartInsertHeading(lines[i], tagvalue, true);
			}
			wikismartTextareaContent = wikismartTextareaContent.substring(0,startIndice)+tsfinaltext+wikismartTextareaContent.substring(endIndice,wikismartTextareaContent.length);
			tsselectstart = startIndice+tagvalue.length;
			tsselectend = tsselectstart+tsfinaltext.length-tagvalue.length;
		}
	}
	wikismartTextarea.value = wikismartTextareaContent;
	wikismartSetSelectionRange(wikismartTextarea,tsselectstart,tsselectend);
	if(is_firefox){
		wikismartTextarea.scrollTop = wikismartTextareaScrollFirefox;
	}
}

function wikismartNormalizeFormat(){
	
	var lines = wikismartGetLines(wikismartSelection);
	var tsselectstart = wikismartStartIndex;
	var tsselectend = wikismartEndIndex;
	finaltext = "";
	var tmp = "";
	
	if(wikismartSelection.length == 0){ // Si la selection est nulle, on recupere la ligne (en entier)  ou se trouve le curseur pour la traiter
		var stringBefore = wikismartTextareaContent.substring(0,wikismartStartIndex);
		var stringAfter = wikismartTextareaContent.substring(wikismartStartIndex,wikismartTextareaContent.length);
		var startIndice = stringBefore.lastIndexOf("\n");
		if(startIndice == -1){ // Si on en trouve pas, c'est que l'on est sur la première ligne
			startIndice = 0;
		}
		
		var endIndice = stringAfter.indexOf("\n");
		if(endIndice == -1){ // Si on en trouve pas, c'est que l'on est sur la dernière ligne
			endIndice = wikismartTextareaContent.length;
		}
		if(endIndice != wikismartTextareaContent.length){
			endIndice+=wikismartStartIndex;
		}
		var tscurrentline = wikismartTextareaContent.substring(startIndice,endIndice);
		tscurrentline = smarteditNormalStyleIntoLine(tscurrentline);
		wikismartTextareaContent = wikismartTextareaContent.substring(0,startIndice)+tscurrentline+wikismartTextareaContent.substring(endIndice,wikismartTextareaContent.length);
		tsselectstart = startIndice+1;
		tsselectend = tsselectstart;
	}
	else{ // Si la sélection n'est pas vide, il faut bien sur récupérer toutes les lignes et les traiter
		var tsfinaltext = "";
		if(lines != null && lines.length > 0){
		
			// Récupération de la première ligne en entier
			var stringBefore = wikismartTextareaContent.substring(0,wikismartStartIndex);
			var startIndice = stringBefore.lastIndexOf("\n");
			if(startIndice == -1){
				startIndice = 0;
			}
			lines[0] = stringBefore.substring(startIndice,wikismartStartIndex)+lines[0];
			
			// Récupération de la dernière ligne en entier
			var stringAfter = wikismartTextareaContent.substring(wikismartEndIndex,wikismartTextareaContent.length);
			var endIndice = stringAfter.indexOf("\n");
			if(endIndice == -1){
				endIndice=wikismartTextareaContent.length;
			}
			if(endIndice != wikismartTextareaContent.length){
				endIndice+=wikismartEndIndex;
			}
			lines[lines.length-1] = lines[lines.length-1]+wikismartTextareaContent.substring(wikismartEndIndex,endIndice);
			for(var i=0;i<lines.length;i++){
				tsfinaltext += smarteditNormalStyleIntoLine(lines[i]);
			}
			wikismartTextareaContent = wikismartTextareaContent.substring(0,startIndice)+tsfinaltext+wikismartTextareaContent.substring(endIndice,wikismartTextareaContent.length);
			tsselectstart = startIndice+1;
			tsselectend = tsselectstart+tsfinaltext.length;
		}
	}
	wikismartTextarea.value = wikismartTextareaContent;
	wikismartSetSelectionRange(wikismartTextarea,tsselectstart,tsselectend);
	if(is_firefox){
		wikismartTextarea.scrollTop = wikismartTextareaScrollFirefox;
	}
}

function wikismartVerbatim(){
	
	var tstoadd = "\n<verbatim>\n"+wikismartSelection+"\n</verbatim>\n";
	
	wikismartTextareaContent = wikismartTextareaContent.substring(0,wikismartStartIndex)+tstoadd+wikismartTextareaContent.substring(wikismartEndIndex,wikismartTextareaContent.length);
	wikismartTextarea.value = wikismartTextareaContent;
	wikismartSetSelectionRange(wikismartTextarea,wikismartStartIndex+12,wikismartStartIndex+12+wikismartSelection.length);
	if(is_firefox){
		wikismartTextarea.scrollTop = wikismartTextareaScrollFirefox;
	}
	
}

function wikismartBlockquote(){
	
	var tstoadd = "\n<blockquote>\n"+wikismartSelection+"\n</blockquote>\n";
	
	wikismartTextareaContent = wikismartTextareaContent.substring(0,wikismartStartIndex)+tstoadd+wikismartTextareaContent.substring(wikismartEndIndex,wikismartTextareaContent.length);
	wikismartTextarea.value = wikismartTextareaContent;
	wikismartSetSelectionRange(wikismartTextarea,wikismartStartIndex+14,wikismartStartIndex+14+wikismartSelection.length);
	if(is_firefox){
		wikismartTextarea.scrollTop = wikismartTextareaScrollFirefox;
	}
	
}

function wikismartInsertParapraph(){
	wikismartInitializeAllAttributes();
	var tstoadd = "\n"+wikismartSelection;
	
	wikismartTextareaContent = wikismartTextareaContent.substring(0,wikismartStartIndex)+tstoadd+wikismartTextareaContent.substring(wikismartEndIndex,wikismartTextareaContent.length);
	wikismartTextarea.value = wikismartTextareaContent;
	wikismartSetSelectionRange(wikismartTextarea,wikismartStartIndex+1,wikismartStartIndex+tstoadd.length);
	if(is_firefox){
		wikismartTextarea.scrollTop = wikismartTextareaScrollFirefox;
	}
	
}

// This function is called when the return key is pressed
// Automatic indentation - Automatic detection of bullet in previous line
function wikismartReturnKeyAction(){
	wikismartInitializeAllAttributes();
	var smartKeyAct = false;
	if(wikismartShiftPressed){
		wikismartListToInsert = false;
		wikismartListToDelete = false;
	}
	if(wikismartListToInsert){
		smartKeyAct = true;
		wikismartListToInsert = false;
		wikismartTextareaContent = wikismartTextareaContent.substring(0,wikismartEndIndex)+wikismartListType+wikismartTextareaContent.substring(wikismartEndIndex,wikismartTextareaContent.length);
		wikismartEndIndex+=wikismartListType.length;
		wikismartStartIndex+=wikismartListType.length;
		wikismartListType = "";
	}
	if(wikismartListToDelete){
		wikismartListToDelete = false;
		smartKeyAct = true;
		var toreplace = wikismartTextareaContent.substring(0,wikismartEndIndex);

		var i = toreplace.lastIndexOf("\n");
		if(i == -1){
			i=0;
		}
		
		
		var tsreplace = toreplace.substring(0,i);
		var tslastIndex = tsreplace.lastIndexOf("\n");
		if(tslastIndex == -1){
			tslastIndex = 0;
		}
		var tsStringToReplace = tsreplace.substring(0,tslastIndex+1);
		wikismartTextareaContent = tsStringToReplace+"\n"+wikismartTextareaContent.substring(wikismartEndIndex,wikismartTextareaContent
.length);
		wikismartStartIndex = tsStringToReplace.length+1;
	}
	if(wikismartSpaceToAdd && wikismartSpaceToAddText != null && wikismartSpaceToAddText.length > 0){
		smartKeyAct = true;
		wikismartSpaceToAdd = false;      
		wikismartTextareaContent = wikismartTextareaContent.substring(0,wikismartEndIndex)+wikismartSpaceToAddText+wikismartTextareaContent.substring(wikismartEndIndex,wikismartTextareaContent.length);
		wikismartEndIndex+=wikismartSpaceToAddText.length;
		wikismartStartIndex+=wikismartSpaceToAddText.length;
		wikismartSpaceToAddText = "";
	}
	if(navigator.userAgent.toLowerCase().indexOf("opera") == -1 || smartKeyAct){
		wikismartTextarea.value = wikismartTextareaContent;
		wikismartSetSelectionRange(wikismartTextarea,wikismartStartIndex,wikismartStartIndex);
	}
	if(is_firefox){
		 wikismartTextarea.scrollTop = wikismartTextareaScrollFirefox;
	}
}

function wikismartDetectListContext(){
	wikismartInitializeAllAttributes();
	var textBefore = wikismartTextareaContent.substring(0,wikismartStartIndex);
	var index = textBefore.lastIndexOf("\n");
	var currentLine = textBefore.substring(index+1,wikismartStartIndex);
	
	
	// Raccourci demandé par Sandra et Colas
	var listAdded = false;
	if(currentLine.indexOf("* ") == 0){
		currentLine = "   "+currentLine;
		wikismartTextareaContent = wikismartTextareaContent.substring(0,index+1)+currentLine+wikismartTextareaContent.substring(wikismartEndIndex, wikismartTextareaContent.length);
		wikismartTextarea.value = wikismartTextareaContent;
		var theNewIndex = (wikismartTextareaContent.substring(0,index+1).length)+(currentLine.length);
		wikismartSetSelectionRange(wikismartTextarea, theNewIndex, theNewIndex);
		listAdded = true;
	}
	var indexbullet = wikismartIndexOfBullet(currentLine);
	if(indexbullet >= 0){
		wikismartListToInsert = true;
	}
	
	if(((!listAdded && !wikismartListToInsert) || wikismartShiftPressed) && !wikismartListToDelete){ 
		// Si rien n'a été touché et que rien ne va etre ajouté, on peut maintenant regarder s'il faut ou non conserver une certaine indentation	
		var tsIndexOfChar = wikismartIndexOfFirstCharacter(currentLine);
		if(tsIndexOfChar != -1){
			
			if(!wikismartIsEmptyString(currentLine.substring(tsIndexOfChar, currentLine.length))){
				wikismartSpaceToAdd = true;
				wikismartSpaceToAddText = currentLine.substring(0,tsIndexOfChar);
				
			}
		}
	}

}

function wikismartSearchTextFromLeft(){
	if(wikismartTextToSearch != null && wikismartTextToSearch.length > 0){
		wikismartTextareaContent = wikismartTextarea.value;
		wikismartTextareaContent = wikismartReplaceAll(wikismartTextareaContent);
		wikismartTextareaContent = wikismartTextareaContent.toUpperCase();
		wikismartTextToSearch = wikismartTextToSearch.toUpperCase();
		var tsIndexOfFirst = wikismartTextOccurence;
		if(tsIndexOfFirst == -1){ // S'il n'y a pas encore d'occurence surlignée alors on cherche la première
			tsIndexOfFirst = wikismartTextareaContent.indexOf(wikismartTextToSearch);
			if(tsIndexOfFirst != -1){
				wikismartTextOccurence = tsIndexOfFirst;
			}
		}
		else{ // Sinon, on cherche a partir de l'ancien index + 1
			var tsIndexOfFirstBis = wikismartTextareaContent.substring(tsIndexOfFirst+1,wikismartTextareaContent.length).indexOf(wikismartTextToSearch);
			if(tsIndexOfFirstBis != -1){ // Initialisation de la valeur
				wikismartTextOccurence = tsIndexOfFirst+tsIndexOfFirstBis+1;
				// Il y avait une occurence avant .. on peut donc activer le bouton previous
				document.getElementById("smartEditSearchPreviousButton").className = "smarteditButtonTD"+smartEditorIECssClass;
				var theButton7 = document.getElementById("smartEditSearchPreviousButton");
				theButton7.onmouseover = function(){
					theButton7.className = "smarteditButtonTDPressed"+smartEditorIECssClass;
				};
				theButton7.onmouseout = function(){
					theButton7.className = "smarteditButtonTD"+smartEditorIECssClass;
				};
			}
		}
		// maintenant on teste si il y encore des elements apres pour pouvoir en informer l'utilisateur
		if(wikismartTextOccurence != -1){ // On regarde d'abord si une occurence a été trouvée
			// Si c'est le cas, on peut alors chercher plus loin
			var tsIndexOfFirstInfo = wikismartTextareaContent.substring(wikismartTextOccurence+1,wikismartTextareaContent.length).indexOf(wikismartTextToSearch);
			if(tsIndexOfFirstInfo != -1){
				// Ce n'est pas le dernier, pas besoin de griser le bouton
				document.getElementById("smartEditSearchInfoTD").innerHTML = "";
			}
			else{
				// Sinon, c'est le dernier élément ... il faut donc griser le bouton next et indiquer l'info à l'utilisateur
				var imginfo = "<img src=\""+wikismartScriptURL+"info.gif\">";
				
				document.getElementById("smartEditSearchNextButton").className = "smarteditButtonTDDisabled"+smartEditorIECssClass;
				var theButton = document.getElementById("smartEditSearchNextButton");
				theButton.onmouseover = function(){
					theButton.className = "smarteditButtonTDDisabled"+smartEditorIECssClass;
				};
				theButton.onmouseout = function(){
					theButton.className = "smarteditButtonTDDisabled"+smartEditorIECssClass;
				};
			}
		}
	}
	else{
		wikismartTextOccurence = -1;
	}
}

function wikismartSearchTextFromRight(){
	if(wikismartTextToSearch != null && wikismartTextToSearch.length > 0){
		wikismartTextareaContent = wikismartTextarea.value;
		wikismartTextareaContent = wikismartReplaceAll(wikismartTextareaContent);
		wikismartTextareaContent = wikismartTextareaContent.toUpperCase();
		wikismartTextToSearch = wikismartTextToSearch.toUpperCase();
		var tsIndexOfFirst = wikismartTextOccurence;
		if(tsIndexOfFirst == -1){
			tsIndexOfFirst = wikismartTextareaContent.lastIndexOf(wikismartTextToSearch);
			if(tsIndexOfFirst != -1){
				wikismartTextOccurence = tsIndexOfFirst;
			}
		}
		else{
			tsIndexOfFirst = wikismartTextareaContent.substring(0,tsIndexOfFirst).lastIndexOf(wikismartTextToSearch);
			if(tsIndexOfFirst != -1){
				wikismartTextOccurence = tsIndexOfFirst;
			}
		}
		// On regarde s'il y a encore un élément avant celui que l'on vient de trouver....
		// Si c'est le cas, on peut laisser les 2 boutons activés
		if(wikismartTextOccurence != -1){ // Il faut au moins qu'un élément existe pour voir s'il y en a un avant !
			tsIndexOfFirstInfo = wikismartTextareaContent.substring(0,wikismartTextOccurence).lastIndexOf(wikismartTextToSearch);
			if(tsIndexOfFirstInfo != -1){
				document.getElementById("smartEditSearchNextButton").className = "smarteditButtonTD"+smartEditorIECssClass;
				var theButton = document.getElementById("smartEditSearchNextButton");
				theButton.onmouseover = function(){
					theButton.className = "smarteditButtonTDPressed"+smartEditorIECssClass;
				};
				theButton.onmouseout = function(){
					theButton.className = "smarteditButtonTD"+smartEditorIECssClass;
				};
				
				document.getElementById("smartEditSearchPreviousButton").className = "smarteditButtonTD"+smartEditorIECssClass;
				var theButton2 = document.getElementById("smartEditSearchPreviousButton");
				theButton2.onmouseover = function(){
					theButton2.className = "smarteditButtonTDPressed"+smartEditorIECssClass;
				};
				theButton2.onmouseout = function(){
					theButton2.className = "smarteditButtonTD"+smartEditorIECssClass;
				};
				
				
				document.getElementById("smartEditSearchInfoTD").innerHTML = "";
			}
			else{ // Sinon, on se trouve sur le premier élément, il faut donc désactiver le bouton previous 
				document.getElementById("smartEditSearchPreviousButton").className = "smarteditButtonTDDisabled"+smartEditorIECssClass;
				var theButton2 = document.getElementById("smartEditSearchPreviousButton");
				theButton2.onmouseover = function(){
					theButton2.className = "smarteditButtonTDDisabled"+smartEditorIECssClass;
				};
				theButton2.onmouseout = function(){
					theButton2.className = "smarteditButtonTDDisabled"+smartEditorIECssClass;
				};
				
				document.getElementById("smartEditSearchNextButton").className = "smarteditButtonTD"+smartEditorIECssClass;
				var theButton = document.getElementById("smartEditSearchNextButton");
				theButton.onmouseover = function(){
					theButton.className = "smarteditButtonTDPressed"+smartEditorIECssClass;
				};
				theButton.onmouseout = function(){
					theButton.className = "smarteditButtonTD"+smartEditorIECssClass;
				};

			}
		}
	}
	else{
		wikismartTextOccurence = -1;
	}
}

function wikismartHighLightNextOccurenceFromTop(){
	wikismartSearchTextFromLeft();
	if(wikismartTextOccurence != -1 && wikismartTextToSearch != null && wikismartTextToSearch.length > 0){
		wikismartSetSelectionRange(wikismartTextarea,wikismartTextOccurence,wikismartTextOccurence+wikismartTextToSearch.length);
		if(is_firefox){
			var scrH = wikismartCalculateScroll();
			var nblbefore = wikismartGetLines(wikismartTextareaContent.substring(0,wikismartTextOccurence)).length;
			nblbefore = nblbefore+5;
			if(nblbefore > wikismartTextarea.rows){
				nblbefore = nblbefore-(wikismartTextarea.rows);
			}
			else{
				nblbefore = 0;
			}
			wikismartTextarea.scrollTop = (scrH*nblbefore);
		}
	}
}

function wikismartHighLightNextOccurenceFromBottom(){
	wikismartSearchTextFromRight(); 
	if(wikismartTextOccurence != -1 && wikismartTextToSearch != null && wikismartTextToSearch.length > 0){
		wikismartSetSelectionRange(wikismartTextarea,wikismartTextOccurence,wikismartTextOccurence+wikismartTextToSearch.length);
		if(is_firefox){
			var scrH = wikismartCalculateScroll();
			var nblbefore = wikismartGetLines(wikismartTextareaContent.substring(0,wikismartTextOccurence)).length;
			nblbefore = nblbefore+5;
			if(nblbefore > wikismartTextarea.rows){
				nblbefore = nblbefore-(wikismartTextarea.rows);
			}
			else{
				nblbefore = 0;
			}
			wikismartTextarea.scrollTop = (scrH*nblbefore);
		}
	}
}

function smartEditorInsertWikiLink(){
	smartEditPopup = open(wikismartScriptURL+"html/index.html",'popup','width=570,height=430,toolbar=no,scrollbars=no,resizable=yes');
	smartEditPopup.document.close();
}


function wikismartInsertSmartColor(smartColor){
	
	var sstagBeg = "%"+smartColor.toUpperCase()+"%";
	var sstagEnd = "%ENDCOLOR%";
	var tstoadd = sstagBeg+wikismartSelection+sstagEnd;
	
	
	
	wikismartTextareaContent = wikismartTextareaContent.substring(0,wikismartStartIndex)+tstoadd+wikismartTextareaContent.substring(wikismartEndIndex,wikismartTextareaContent.length);
	wikismartTextarea.value = wikismartTextareaContent;
	wikismartSetSelectionRange(wikismartTextarea,wikismartStartIndex+sstagBeg.length,wikismartStartIndex+sstagBeg.length+wikismartSelection.length);
	if(is_firefox){
		wikismartTextarea.scrollTop = wikismartTextareaScrollFirefox;
	}
	
}

function wikismartSelectEntireLine(){
	wikismartInitializeAllAttributes();
	var selectLineBegin = (wikismartTextareaContent.substring(0,wikismartStartIndex)).lastIndexOf("\n");
	selectLineBegin+=1;// Ne pas prendre le \n trouvé et si c'est = à -1 ... alors le premier caractere est automatiquement le premier de la textarea
	var selectLineEnd = (wikismartTextareaContent.substring(selectLineBegin,wikismartTextareaContent.length)).indexOf("\n");
	if(selectLineEnd == -1){
		selectLineEnd = wikismartTextareaContent.length;
	}
	else{
		selectLineEnd = selectLineBegin+selectLineEnd;
	}
	wikismartTextarea.value = wikismartTextareaContent;
	wikismartSetSelectionRange(wikismartTextarea,selectLineBegin,selectLineEnd);
	if(is_firefox){
		wikismartTextarea.scrollTop = wikismartTextareaScrollFirefox;
	}
	
	
}
