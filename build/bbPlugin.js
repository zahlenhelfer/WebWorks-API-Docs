/*
 * Copyright 2010-2011 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * This is a JSDoc plugin for all of the BB necessary tags
 *
 * Put this file in <JSDoc dir>\app\plugins\ and it will be used whenever JSDoc is run.
 */

BBTag = {
    tableHeader : function(firstColumnName){
        return "<thead><tr><th>"+firstColumnName+"</th><th>BB5.0</th><th>BB6.0</th><th>BB7.0</th><th>PB1.0</th><th>PB2.0</th><th>Ripple</th></tr></thead>";
    }
};

BBTag.Support = function(symbolArray) {
    this.init();
    if(symbolArray){
        this.populateBySymbolArray(symbolArray);
    }
};

BBTag.Support.prototype.init = function() {
    this.bb50 = false;
    this.bb60 = false;
    this.bb70 = false;
    this.pb10 = false;
	this.pb20 = false;
	this.ripple = false;
    this.common = false;
    this.resetSupportAttributes();
};

BBTag.Support.prototype.resetSupportAttributes = function() {
    this.supportStrings = [];
    this.supportTag = "";
    this.supportTable = "";
    var tableYes = "<td class=\"apiYes\">Y</td>";
    var tableNo = "<td class=\"apiNo\">&nbsp;</td>";
    
    if(this.bb50 && this.bb60 && this.bb70){
        this.supportStrings.push("BlackBerry OS 5.0+");
        this.supportTag = "bb5.0|bb6.0|bb7.0";
        this.supportTable = tableYes + "\n" + tableYes + "\n" + tableYes + "\n";
    }else if(!this.bb50 && this.bb60 && this.bb70) {
	this.supportStrings.push("BlackBerry OS 6.0+");
	this.supportTag = "bb6.0|bb7.0";
	this.supportTable = tableNo + "\n" + tableYes + "\n" + tableYes + "\n";
    }else if(this.bb50 && !this.bb60 && !this.bb70){
        this.supportStrings.push("BlackBerry OS 5.0");
        this.supportTag = "bb5.0";
        this.supportTable = tableYes + "\n" + tableNo + "\n" + tableNo + "\n";
    }else if(!this.bb50 && this.bb60 && !this.bb70){
        this.supportStrings.push("BlackBerry OS 6.0");
        this.supportTag = "bb6.0";
        this.supportTable = tableNo + "\n" + tableYes + "\n" + tableNo + "\n";
    }else if(!this.bb50 && !this.bb60 && this.bb70){
	this.supportStrings.push("BlackBerry OS 7.0+");
	this.supportingTag = "bb7.0";
	this.supportTable = tableNo + "\n" + tableNo + "\n" + tableYes + "\n";
    } else {// This last else has no support
        this.supportTable = tableNo + "\n" + tableNo + "\n" + tableNo + "\n"; 
    }
    
	
    
    if(this.pb10 && this.pb20){
        this.supportStrings.push("BlackBerry PlayBook 1.0+");
        if(this.supportTag.length){
            this.supportTag += "|";
        }
        this.supportTag += "pb1.0|pb2.0";
        this.supportTable += tableYes + "\n" + tableYes + "\n";
    } else if(this.pb20){
        this.supportStrings.push("BlackBerry PlayBook 2.0");
        if(this.supportTag.length){
            this.supportTag += "|";
        }
        this.supportTag += "pb2.0";
        this.supportTable += tableNo+ "\n" + tableYes + "\n";;
	} else if(this.pb10){
        this.supportStrings.push("BlackBerry PlayBook 1.0");
        if(this.supportTag.length){
            this.supportTag += "|";
        }
        this.supportTag += "pb1.0";
        this.supportTable += tableYes + "\n" + tableNo + "\n";;
    }else{
        this.supportTable += tableNo + "\n" + tableNo + "\n";;
    }
	
	if(this.ripple){
        this.supportStrings.push("Ripple Emulator");
        if(this.supportTag.length){
            this.supportTag += "|";
        }
        this.supportTag += "ripple";
        this.supportTable += tableYes;
    }else{
        this.supportTable += tableNo;
    }
    
    if(this.common){
        this.supportTag += "|common";
    }
}

BBTag.Support.prototype.populateByBools = function(bb50, bb60, bb70, pb10, pb20, ripple) {
    this.bb50 |= bb50;
    this.bb60 |= bb60;
    this.bb70 |= bb70;
    this.pb10 |= pb10;
	this.pb20 |= pb20;
	this.ripple |= ripple;
    this.common |= bb50 && bb60 && bb70 && pb10 && pb20;
    this.resetSupportAttributes();
};

BBTag.Support.prototype.populateBySymbol = function(symbol) {
    // BlackBerry Support Tags
    if(symbol){
        if(symbol.support){
            this.populateBySupport(symbol.support);
        }else if(symbol.comment){
            var BB50 = symbol.comment.getTag("BB50").length;
            var BB50P = symbol.comment.getTag("BB50+").length;
            var BB60 = symbol.comment.getTag("BB60").length;
            var BB60P = symbol.comment.getTag("BB60+").length;
            var BB70 = symbol.comment.getTag("BB70").length;
            var BB70P = symbol.comment.getTag("BB70+").length;
            var PB10 = symbol.comment.getTag("PB10").length;
			var PB20 = symbol.comment.getTag("PB20").length;
            var PB10P = symbol.comment.getTag("PB10+").length;
			var RIPPLE = symbol.comment.getTag("RIPPLE").length;

            symbol.support = new BBTag.Support();
            symbol.support.populateByBools((BB50 || BB50P), 
		(BB50P || BB60P || BB60), (BB50P || BB60P || BB60 || BB70P || BB70), 
		(PB10 || PB10P), (PB20 || PB10P), RIPPLE);
            this.populateBySupport(symbol.support);
        }
    }
};

BBTag.Support.prototype.populateByString = function(string) {
    // BlackBerry Support Tags
    if(string){
        var BB50 = string.equals("BB50");
        var BB50P = string.equals("BB50+");
        var BB60 = string.equals("BB60");
        var BB60P = string.equals("BB60+");
        var BB70 = string.equals("BB70");
        var BB70P = string.equals("BB70+");
        var PB10 = string.equals("PB10");
        var PB10P = string.equals("PB10+");
		var PB20 = string.equals("PB20");
		var RIPPLE = string.equals("RIPPLE");

        this.populateByBools((BB50 || BB50P), (BB50P || BB60P || BB60), 
		(BB50P || BB60P || BB60 || BB70P || BB70), (PB10 || PB10P),(PB20 || PB10P), RIPPLE);
    }
};

BBTag.Support.prototype.populateBySupport = function(support) {
    this.bb50 |= support.bb50;
    this.bb60 |= support.bb60;
    this.bb70 |= support.bb70;
    this.pb10 |= support.pb10;
	this.pb20 |= support.pb20;
	this.ripple |= support.ripple;
    this.common |= support.common;
    this.resetSupportAttributes();
};

BBTag.Support.prototype.populateBySymbolArray = function(symbolArray) {
    for ( var i = 0, l = symbolArray.length; i < l; i++){
        var symbol = symbolArray[i];
        this.populateBySymbol(symbol);
    }
};

BBTag.PlaybookSupport = function(){
    var pbSupport = new BBTag.Support();
    pbSupport.populateByBools(false, false, false, true, false);
    return pbSupport;
}

function isaClass($) {
    return ($.is("CONSTRUCTOR") || $.isNamespace) && !($.alias == "_global_")
}

/** Fetch and remove additional { foo } parameters from a string * */
function GetType(src) {
    var type = null;

    if(typeof src != "string")
        throw "src must be a string not " + (typeof src);

    if(src.indexOf('{') >= 0){
        var typeRange = src.balance("{", "}");
        if(typeRange[1] == -1)
            throw "Malformed comment tag ignored. Tag type requires an opening { and a closing }: " +
                  src;
        type = src.substring(typeRange[0] + 1, typeRange[1]).trim();
        src = src.substring(typeRange[1] + 1);
    }

    return {type : type, remainder : src};
}

JSDOC.PluginManager.registerPlugin("JSDOC.BBTag", {
    onSymbol : function(symbol) {

        if(symbol.comment){
            // If its a class/namespace
            if(isaClass(symbol)){

                var toc = symbol.comment.getTag("toc");
                if(toc.length){
                    // MUST get the original TOC tag ...WHO KNOWS WHY???
                    for ( var i = 0; i < symbol.comment.tags.length; i++){
                        if(symbol.comment.tags[i].title == "toc"){
                            symbol.toc = symbol.comment.tags[i];
                            break;
                        }
                    }
                }

                var notice = symbol.comment.tags.filter(function($, index){$.itemIndex = index; return $.title=="notice" && $.type});
                if(notice.length){
                    // reparse the .type attribute as jsDocs as modifies characters
                    for ( var i = 0; i < notice.length; i++){
                        var n = notice[i];
                        var parts = GetType(symbol.comment.tagTexts[n.itemIndex]);
                        if(parts && parts.type){
                            n.title = parts.type;
                        }
                        n.desc = parts.remainder;
                    }
                    symbol.notice = notice;
                }

                var constructorTag = symbol.comment.getTag("constructor");
                if(constructorTag.length == 0){
                    symbol.noConstructor = true;
                }

                //FeatureID has an optional type attribute
                //If it is missing then the feature is fully supported
                //If it is present than it will represent the limited support
                var featureID = symbol.comment.getTag("featureID");
                if(featureID.length){
                    symbol.featureID = featureID;
                }

                var permission = symbol.comment.getTag("permission");
                if(permission.length){
                    symbol.permission = permission;
                }

                var betaTag = symbol.comment.getTag("beta");
                if(betaTag.length){
                    symbol.betaTag = betaTag;
                }

                var learnTag = symbol.comment.getTag("learns");
                if(learnTag.length){
                    symbol.learnTag = learnTag;
                }
            }else{ // Its a property or method

                var readOnly = symbol.comment.getTag("readOnly");
                if(readOnly.length){
                    symbol.readOnly = readOnly;
                }

                var uri = symbol.comment.getTag("uri");
                if(uri.length){
                    symbol.uri = uri;
                }

                var squareAccessor = symbol.comment.getTag("squareAccessor");
                if(squareAccessor.length){
                    symbol.squareAccessor = squareAccessor;
                }

                var constructedBy = symbol.comment.getTag("constructedBy");
                if(constructedBy.length){
                    symbol.constructedBy = constructedBy;
                }
            }

            var paramCallbacks = symbol.comment.tags.filter(function($){return $.isCallback && $.title == "param"});
            // Mark all parameters as callback based on their tags
            if(paramCallbacks.length){
                for ( var i = 0; i < paramCallbacks.length; i++){
                    var currentCallback = paramCallbacks[i];
                    // There should only be 1 matching param
                    var matchingParams = symbol.params
                    .filter(function($) {
                        return ($.type == currentCallback.type)
                        && ($.name == currentCallback.name)
                        && ($.desc == currentCallback.desc)
                        && ($.isOptional == currentCallback.isOptional)
                        && ($.defaultValue == currentCallback.defaultValue)
                    });
                    // Mark the param a callback
                    if(matchingParams && matchingParams[0]){
                        matchingParams[0].isCallback = true;
                    }
                }
            }
    
            var fieldCBs = symbol.comment.tags.filter(function($){return $.isCallback && $.title == "field"});
            // Mark all properties as callback based on their tags
            if(fieldCBs.length){
                symbol.isCallback = true;
                for ( var i = 0; i < fieldCBs; i++){
                    currentCB = fieldCBs[i];
                }
            }
        }
    },

    onDocCommentTags : function(comment) {
        if(comment){
            //The name must be nibbled so we get a name property like a normal param
            // They are marked as callbacks for future processing.
            // We mark the items as fields and set the description accordingly
            var propertyCBTags = comment.tags.filter(function($){return $.title == "propertyCB"});
            if(propertyCBTags.length){
                for ( var i = 0; i < propertyCBTags.length; i++){
                    var currentPropertyCBTag = propertyCBTags[i];
                    currentPropertyCBTag.desc = currentPropertyCBTag.nibbleName(currentPropertyCBTag.desc);
                    currentPropertyCBTag.isCallback = true;
                    var fieldTag = new JSDOC.DocTag("field");
                    fieldTag.isCallback = true;
                    fieldTag.name = currentPropertyCBTag.name;
                    comment.tags.push(fieldTag);
                    comment.tags.push(new JSDOC.DocTag("type " + currentPropertyCBTag.type));
                    comment.tags.push(new JSDOC.DocTag("desc " + currentPropertyCBTag.desc));
                }
            }else if(comment.getTag("squareAccessor").length){
                // Push a function tag because we only support [] functions
                comment.tags.push(new JSDOC.DocTag("function"));
            }
        }
    },

    onDocTag : function(docTag) {
        if(docTag.title){
            // Callbacks pretend to be parameters so that their order is preserved
            // The name must be nibbled so we get a name property like a normal param
            // They are marked as callbacks for future processing.
            if(docTag.title == "callback"){
                docTag.desc = docTag.nibbleName(docTag.desc);
                docTag.title = "param";
                docTag.isCallback = true;
            }else if(docTag.title == "learns"){
                docTag.desc = docTag.nibbleName(docTag.desc);
            } else if(docTag.title == "permission"){
                docTag.desc = docTag.nibbleName(docTag.desc);
            }
        }
    },

    onFinishedParsing : function(symbolSet) {
        if(symbolSet){
            var symbols = symbolSet.toArray();
            var classes = symbols.filter(isaClass);
            // create each of the class pages
            for ( var i = 0, l = classes.length; i < l; i++){
                var symbol = classes[i];
                if(symbol){
                    var symbolSupport = new BBTag.Support();
                    symbolSupport.populateBySymbol(symbol);
                    var children = [].concat(symbol.methods,symbol.properties,symbol.events);
                    var childSupport = new BBTag.Support(children);
                    symbol.support.populateBySupport(childSupport);
                }
            }
        }
    } 
});
