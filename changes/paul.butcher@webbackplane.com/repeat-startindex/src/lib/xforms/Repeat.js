/*
 * Copyright (C) 2008 Backplane Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*global DECORATOR, NamespaceManager, UX, document, window, getModelFor*/

function Repeat(elmnt) {
  this.element = elmnt;
  
  if (this.element) {
    this.element.iterationTagName = "group";

    var sStartIndex = elmnt.getAttribute("startindex");
    if (sStartIndex === null || isNaN(sStartIndex)) {
      this.m_nIndex = 1;
    } else {
      this.m_nIndex = Number(sStartIndex);
    }

  }
  
  this.m_CurrentIterationCount = 0;
  this.m_offset = 0;
  this.m_iterationNodesetLength = 0;
}    
    
Repeat.prototype.onDocumentReady = function () {
  this.storeTemplate();
  this.addcontroltomodel();
  this.element.addEventListener(
    "DOMActivate",
    {
      control: this,
      handleEvent: function (evt) {
        this.control.Activate(evt.target);
      }
    },
    true
  );
};

Repeat.prototype.Activate  = function (o) {
  var coll = this.element.childNodes,
  len = coll.length,
  i = 0;
  for (;i < len;++i) {
    if (coll[i].contains(o)) {
      this.m_nIndex = i + 1;
      break;
    }
  }
};

Repeat.prototype.storeTemplate = function () {
  this.sTemplate = this.element.cloneNode(true);
  while (this.element.childNodes.length) {
    this.element.removeChild(this.element.firstChild); 
  }
  UX.addClassName(this.element, "repeat-ready");
};

//register this element with the model
//
Repeat.prototype.addcontroltomodel = function ()	{
  if (!this.m_bAddedToModel) {
    var oModel = getModelFor(this);
    if (oModel) {
      oModel.addControl(this);
    } else {
      debugger;
    }
  } else { /* shouldn't be called twice */
    debugger;
  }    
};

Repeat.prototype.refresh = function () {

};

Repeat.prototype.getRequestedIterationCount = function () {
  //Alter the number of iterations, if appropriate
  var sNumber = this.getAttribute("number"),
  desiredIterationCount = 0;
  
  if (sNumber === null || isNaN(sNumber)) {
      //without a number attribute, vary the repeat with the size of the nodeset.
    desiredIterationCount = this.m_iterationNodesetLength;
  } else {
    desiredIterationCount =  Number(sNumber);
  }
  return desiredIterationCount;
};

Repeat.prototype.putIterations = function (desiredIterationCount) {

  var formerOffset, i, currentOrdinal, sDefaultPrefix, iterations, oIterationElement, templateClone;
  if (desiredIterationCount < this.m_CurrentIterationCount) {
    //Trim any superfluous iterations if desired.
    while (this.element.childNodes.length > desiredIterationCount) {
      this.element.removeChild(this.element.lastChild);
    }
    this.m_CurrentIterationCount = this.element.childNodes.length;
  }
  //hold the current offset, to determine whether it is necessary to change
  //  the ordinals of the various iterations.
  formerOffset = this.m_offset;
  
  //Fix the viewport so that the desired index will be visible.
  if (this.m_nIndex < this.m_offset) {
    //If offset is later than index, move the viewport such that index is the last visible iteration
    this.m_offset = 1 + this.m_nIndex - desiredIterationCount;
  } else if (this.m_nIndex > (desiredIterationCount + this.m_offset)) {
    //If there are fewer iterations than would allow the current index to be visible
    //Set the offset and index to match.
    this.m_offset = this.m_nIndex - 1;
  }
  
  //Offset has changed, iterate through extant iterations, altering their ordinals accordingly.
  if (formerOffset !== this.m_offset) {
    iterations = this.element.childNodes;
    
    for (i = 0; i < this.m_CurrentIterationCount; ++i) {
      currentOrdinal = i + this.m_offset;
      if (iterations[i]) {
        iterations[i].setAttribute("ordinal", currentOrdinal);
      } 
    }
  }
  
  sDefaultPrefix = NamespaceManager.getOutputPrefixesFromURI("http://www.w3.org/2002/xforms")[0] + ":";
  while (desiredIterationCount > this.m_CurrentIterationCount) {
    //In the absence of an iteration corresponding to this index, insert one.
    oIterationElement = (UX.isXHTML) ? 
      document.createElementNS("http://www.w3.org/2002/xforms", sDefaultPrefix + this.element.iterationTagName) :
      document.createElement(sDefaultPrefix + this.element.iterationTagName);
    oIterationElement.setAttribute("ref", ".");
    oIterationElement.setAttribute("ordinal", this.m_offset + this.m_CurrentIterationCount + 1);
    UX.addClassName(oIterationElement, "repeat-iteration");
    
    templateClone = this.element.sTemplate.cloneNode(true);
    while (templateClone.childNodes.length) {
      oIterationElement.appendChild(templateClone.firstChild);
    }
    this.element.appendChild(oIterationElement);
    window.status = "";
    //set the status bar, to fix the progress bar.
    //See: http://support.microsoft.com/default.aspx?scid=kb;en-us;Q320731 
    
    this.m_CurrentIterationCount++;
  }
  
  
};

Repeat.prototype.normaliseIndex  = function () {
    
  if (this.m_nIndex < 1) {
    this.m_nIndex = 1;
  }
  
  if (this.m_nIndex > this.m_iterationNodesetLength) {
    this.m_nIndex = this.m_iterationNodesetLength;
  }

};

Repeat.prototype.rewire = function () {
  var arrNodes = null,
  sExpr = this.element.getAttribute("nodeset"),
  sBind,
  oBind,
  oContext,
  r,
  desiredIterationCount;
  
  if (!sExpr) {
    sBind = this.element.getAttribute("bind");
    
    if (!sBind) {
        //debugger; /* the repeat has neither a @nodeset or a @bind */
    } else {
      oBind = this.element.ownerDocument.getElementById(sBind);
  
      if (!oBind) {
        debugger; /* bind not found with this ID */
      } else {
        arrNodes = oBind.boundNodeSet;
        this.m_model = oBind.ownerModel;
      }
    }
  } else {        
    document.logger.log("Rewiring: " + this.element.tagName + ":" + this.element.uniqueID + ":" + sExpr, "info");
    
    oContext = this.element.getEvaluationContext();
    this.m_model = oContext.model;
    r = this.m_model.EvaluateXPath(sExpr, oContext);
    
    arrNodes = r.value;
  }
  
  if (arrNodes) {
    this.m_iterationNodesetLength = arrNodes.length;
    desiredIterationCount = this.getRequestedIterationCount();
    this.normaliseIndex();
    this.putIterations(desiredIterationCount);

    if (!UX.hasDecorationSupport) {
      DECORATOR.applyDecorationRules(this.element);
    }
  }

  return false;
};


Repeat.prototype.getIndex = function () {
  return this.m_nIndex;
};
