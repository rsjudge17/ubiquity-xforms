/*
 * Copyright © 2008-2009 Backplane Ltd.
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

/*global NamespaceManager, UX, document, getProxyNode*/

/**
 * Retrieves the model to which the node <i>oNode</i> is bound. This is based
 * on the presence of model or bind attributes, or on context information gained
 * from the the node's position in the document.
 * 
 * @param {Object}
 *            oNode, node whose model is to be resolved.
 * @returns Node that corresponds to the appropriate model for oNode's binding.
 */

function getModelFor(oNode) {
  var models, oBind, sBindId, sModelId, oMightBeAModel;
  // If the node is null, this function is likely to have recursed up to the
  // document root and beyond, without encountering any specific directions 
  // for model resolution. return the document's
  // default model.
  
  if (!oNode || oNode.nodeType === 9/* DOCUMENT_TYPE */) {
    // TODO: The default model may be the implicit model. Implicit models
    // have not been implemented yet.
    // If the implicit model is generated by inserting a model element into
    // the DOM, then this function
    // will work out-of-the-box. Otherwise, this first branch will need to
    // be rewritten to use whatever
    // factory or repository exists for fetching potentially implicit
    // models.
    // Even if the above mechanism is used for generating the implicit
    // model, if this function is called
    // before the implicit model is otherwise generated then it must be
    // generated by this branch.
    if (!document.defaultModel) {
      models = NamespaceManager.getElementsByTagNameNS(document, "http://www.w3.org/2002/xforms", "model");
      if (models && models.length > 0) {
        document.defaultModel = models[0];
      }
    }
    return document.defaultModel;
  }
  
  if (oNode.nodeType === 11 /* FRAGMENT_TYPE */) {
    return null;
  } 
  
  if (oNode.ownerModel) {
    return oNode.ownerModel;
  }

  // if the node has a bind attribute,
  // then resolve model for that bind, copy to self, and return that.
  sBindId = oNode.getAttribute("bind");
      
  if (sBindId) {
		oBind = FormsProcessor.getBindObject(sBindId,oNode);

		if (oBind) {
      oNode.ownerModel = getModelFor(oBind);
    } 
    return oNode.ownerModel;
  }
      
  sModelId = oNode.getAttribute("model");
  // If the node has a model attribute return the corresponding node.
  // if the model attribute does not correspond to the ID of a model
  // throw (for now, invoke the debugger.                
  
  if (sModelId) {
    oMightBeAModel = document.getElementById(sModelId);
        
    if (oMightBeAModel && (oMightBeAModel.xformselement === "model")) {
      oNode.ownerModel = oMightBeAModel;
    } else {
      UX.dispatchEvent(oNode, "xforms-binding-exception", false, true, true);
    }            
    return oNode.ownerModel;            
  }

  // Only certain nodes within model take the model as context, others
  // follow the normal context resolution pattern.
  if (oNode.tagName === "bind" && oNode.parentNode.xformselement === "model") {
    oNode.ownerModel = oNode.parentNode;
  } else {
    // In the absence of more specific directions, get the model that is
    // defined for the parentNode, and return that.
    oNode.ownerModel = getModelFor(oNode.parentNode);
  }
  return oNode.ownerModel;
}


var g_DeferredUpdateDepth = 0;


function doUpdate() {
  var ns, len, m, i;
  ns = NamespaceManager.getElementsByTagNameNS(document, "http://www.w3.org/2002/xforms", "model");
  len = ns.length;
  
  for (i = 0; i < len; ++i) {
    m = ns[i];
    // There is a chance that a model has been inserted into the document
    // during the processing of this event, that has not had a chance to 
    // have its behaviour attached. It is not essential that it be caught 
    // in this deferred update phase, as 
    // A) It will be updated when as part of its initialisation
    // B) It can't have been modified during the processing of this event anyway.
    try {
      //only update if it is ready, otherwise, if there are multiple models, 
      // some may rebuild/recalculate etc. before its initial build/calculate, etc.
      if (m.m_bReady) {
        m.deferredUpdate();
      }
    } catch (e) {
       debugger;
    }
  }
}
function IncrementDeferredUpdate() {
  ++g_DeferredUpdateDepth;
}


function DecrementDeferredUpdate() {
  if (!--g_DeferredUpdateDepth) {
    doUpdate();
  }
}

function XFormsProcessor() {
  this.defaultHandlers = {};
  this.eventStack = [];
  this.hintOffCounter = 0;
  this.supportedVersions = ["1.1"];
  this.halted = false;
}

XFormsProcessor.prototype.find = function (array, value) {
    var i;
    if (!array || !value) {
        return false;
    }
    for (i = 0; i < array.length; i++) {
        if (array[i] === value) {
            return true;
        }
    }
    
    return false;
}

/**
	Function: getBindObject
	
	bindid - The id of the bind element that is to be returned
	notifyOnException - An EventTarget object that is to be notified in case of exception
	returns - If bindid refers to a bind object, the bind element referenced by bindid, otherwise, null.
	
	An xforms-binding-exception will be raised if there is no element referenced by bindid,
		or if the element with that id is not an xforms bind element.

*/
XFormsProcessor.prototype.getBindObject = function (bindid, notifyOnException) {
		var bindObject = null,
		notifyOnException = notifyOnException || document.defaultModel;
		
		if(bindid) {
		  bindObject = document.getElementById(bindid);
		
	    if (!bindObject || !NamespaceManager.compareFullName(bindObject, "bind", "http://www.w3.org/2002/xforms")) {
	      //bind not found with this ID
	      bindObject = null;
	    	if(notifyOnException) {
		      UX.dispatchEvent(notifyOnException, "xforms-binding-exception", true, false, false);
		    }
	      this.halted = true;
			}
		}
		return bindObject;
}


XFormsProcessor.prototype.setVersion = function () {
    var defaultModelVersions, i, maxPos;
    
    if (!this.version) {
	    if (!document.defaultModel) {
	        if (!getModelFor(null)) {
	            return;
	        }
	    }
	    
	    defaultModelVersions = (document.defaultModel.getAttribute("version") || "").split(" ");
	    
	    // Search for the highest supported version that meets the version requirements
	    // of the default model, if any
	    maxPos = -1;
	    for (i = 0; i < this.supportedVersions.length; i++) {
	        if (defaultModelVersions.length === 1 && defaultModelVersions[0].length === 0 ||
	            this.find(defaultModelVersions, this.supportedVersions[i])) {
                if (maxPos === -1 || Number(this.supportedVersions[i]) > Number(this.supportedVersions[maxPos])) {
                    maxPos = i;
                }
	        }
	    }
	    	    
	    // If an acceptable version was found, assign it to the processor    
        if (maxPos >= 0) {
            this.version = this.supportedVersions[maxPos];
        }
	}
}

XFormsProcessor.prototype.testModelVersion = function (pModel) {
    var evt, desiredVersion, exceptionMsg;
    
    // Degenerately fail version check if processor is already halted 
    if (this.halted) {
        return false;
    }
    
    // If the processor version has not already been selected based on 
    // the default model, then select it now.
    if (!this.version) {
        this.setVersion();
        // If we don't have a version number, then the version of the default model
        // is specified and has an error, so we switch to testing the default model 
        // so the xforms-version-exception is generated on the default model
        if (!this.version) {
            exceptionMsg = "Error in default model version"; 
            pModel = document.defaultModel || pModel;
        }
    }
    
    // Get the version attribute value
    desiredVersion = pModel.getAttribute("version") || "";

    // If a version preference is not expressed, then this model is
    // relaxed and therefore gets a pass
    if (desiredVersion.length === 0 && this.version) {
        return true;
    } 
    
    // Otherwise, we seek the processor's selected version in the desired version list
    if (this.find(desiredVersion.split(" "), this.version)) {
        return true;
    } else if (this.version) {
        exceptionMsg = "Unsupported version for model " + (pModel.getAttribute("id") || "");
    }

    // Either the processor has no selected version or the processor's selected version 
    // is not among the list of versions required by this model, so xforms-version-exception
    // The event goes to the default model, regardless of which model is in error
    evt = document.createEvent("Events");
    evt.initEvent("xforms-version-exception", true, false);
    evt.context = { "error-information": exceptionMsg || "" };
    FormsProcessor.dispatchEvent(document.defaultModel || pModel, evt);
    return false;
}

XFormsProcessor.prototype.inheritTrue = function (sMIP, oNode) {
  var retval, nodeProxy, parentProxy;
  nodeProxy = getProxyNode(oNode);
  //Get direct value of this MIP.
  retval = nodeProxy.getMIP(sMIP).value;
  //If direct value is not already true, check if any ancestors are true 
  if (!retval && oNode.parentNode) {
    parentProxy = getProxyNode(oNode.parentNode);
    if (parentProxy[sMIP].getValue()) {
      retval = true;
    }
  }
  return retval;
};
  
XFormsProcessor.prototype.inheritFalse = function (sMIP, oNode) {
  var retval, nodeProxy, parentProxy;
  nodeProxy = getProxyNode(oNode);
  
  //Get direct value of this MIP.
  retval = nodeProxy.getMIP(sMIP).value;
  //If direct value is not already false, check if any ancestors are false 
  if (retval && oNode.parentNode) {
    parentProxy = getProxyNode(oNode.parentNode);
    if (!parentProxy[sMIP].getValue()) {
      retval = false;
    }
  }
  return retval;
};

XFormsProcessor.prototype.addDefaultEventListener = function (oTarget, sType, oListener) {

  if (!oTarget.uniqueID) {
    oTarget.uniqueID = "uuid:" + Math.random() + Math.random();
  }
  
  if (!this.defaultHandlers[oTarget.uniqueID]) {
    this.defaultHandlers[oTarget.uniqueID] = {};
  }

  if (!this.defaultHandlers[oTarget.uniqueID][sType]) {
    this.defaultHandlers[oTarget.uniqueID][sType] = [];
  }

  this.defaultHandlers[oTarget.uniqueID][sType].push(oListener);
};


XFormsProcessor.prototype.removeDefaultEventListener = function (oTarget, sType, oListener) {
  var arrHandlers, i;
  if (this.defaultHandlers[oTarget.uniqueID]) {
    arrHandlers = this.defaultHandlers[oTarget.uniqueID][sType];
    
    if (arrHandlers) {
      for (i = 0; i < arrHandlers.length; i++) {
        if (arrHandlers[i] === oListener) {
          arrHandlers[i] = null;
        }
      }
    }
  }
};


XFormsProcessor.prototype.addDefaultEventListenerFor = function(target, event, scopeParam, methodName) {
 this.addDefaultEventListener(target, event, {
    scope: scopeParam,
    handleEvent: function () {
      this.scope[methodName]();
    }
  });
};

XFormsProcessor.prototype.dispatchEvent = function (oTarget, oEvent, bForceInlineExecution) {    
  var eventExecuted = false;
  try {
    IncrementDeferredUpdate();
    this.eventStack.push(oEvent);
      //This is only required for IE.  Conformant browsers despatch events at the correct time without prompting
      eventExecuted = (UX.isIE && bForceInlineExecution)? oTarget._dispatchEvent(oEvent): oTarget.dispatchEvent(oEvent);
    
    if (eventExecuted) {
      this.invokeDefault(oTarget, oEvent);
      this.eventStack.pop();
    }
  } catch (e) {
    // TODO: Need to do something to notify user fatal 
    // error such as xforms-binding-exception
    // alert(e);
  } finally {
    DecrementDeferredUpdate();        
  }
};


XFormsProcessor.prototype.invokeDefault = function (oTarget, e) {
  var arrListeners, i;
  if (this.defaultHandlers[oTarget.uniqueID]) {
    arrListeners = this.defaultHandlers[oTarget.uniqueID][e.type];
    
    if (arrListeners) {
      for (i = 0; i < arrListeners.length; ++i) {
        if (arrListeners[i]) {
          arrListeners[i].handleEvent(e);
        }
      }
    }
  }
};

XFormsProcessor.prototype.getCurrentEvent = function () {
  var ret = null;
  if (this.eventStack) {
    ret = this.eventStack[this.eventStack.length - 1];
  }
  return ret;
};

XFormsProcessor.prototype.listenForXFormsFocus = function (target, listener) {
	target.addEventListener("xforms-focus", { handleEvent : function(evt) { listener.giveFocus(); } }, false);
};

XFormsProcessor.prototype.hasProxyNode = function (element) {
	return element && element.m_proxy && element.m_proxy.m_oNode;
};

XFormsProcessor.prototype.getProxyNode = function (element) {
	if (this.hasProxyNode(element)) {
		return element.m_proxy;
	}

	return null;
};

var FormsProcessor = new XFormsProcessor();

//override of DOM flushEventQueue, to ensure that deferred update, 
//  and appropriate default invocation are respected.
 var flushEventQueue = function() {
      var oPendingEvent = g_pendingEvents.pop();
      while (oPendingEvent) {
          FormsProcessor.dispatchEvent(oPendingEvent.target, oPendingEvent.evt, true);                       
          oPendingEvent = g_pendingEvents.pop();
      }
  }

