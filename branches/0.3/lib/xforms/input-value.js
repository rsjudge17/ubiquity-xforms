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

function XFormsInputValue(elmnt)
{
	this.element = elmnt;
	this.currValue = "";
	this.m_bFirstSetValue = true;
	//this.ctor();
}

function valueChangedIE(pThis,evt)
{
	/*
	 * [ISSUE] Not really suitable to use mutation events.
	 */

	var oEvt = pThis.element.ownerDocument.createEvent("MutationEvents");
	
	oEvt.initEvent("control-value-changed", true, true,
		null, pThis.currValue, evt.srcElement.value, null, null);

	spawn(function(){FormsProcessor.dispatchEvent(pThis.element,oEvt);});

	/*
	 * Cancel bubbling but don't cancel the event itself
	 * otherwise we never get the value actually changed.
	 */

	 evt.cancelBubble = true;

}

function valueChangedFF(pThis,evt)
{
	/*
	 * [ISSUE] Not really suitable to use mutation events.
	 */
	var oEvt = pThis.element.ownerDocument.createEvent("MutationEvents");
	
	oEvt.initMutationEvent("control-value-changed", true, true,
		null, pThis.currValue, evt.target.value, null, null);

	FormsProcessor.dispatchEvent(pThis.element,oEvt);
	/*
	 * Cancel bubbling but don't cancel the event itself
	 * otherwise we never get the value actually changed.
	 */

	 evt.cancelBubble = true;

}

function getNamespaceFreeNodeName(node)
{
	var sNodeName = node.nodeName;
	return sNodeName.slice(sNodeName.indexOf(":")+1,sNodeName.length).toLowerCase();
}

XFormsInputValue.prototype.onDocumentReady = function()
{
	if (this.element.ownerDocument.media != "print")
	{
		var sTagNameLC = getNamespaceFreeNodeName(this.element.parentNode);
		var sElementToCreate = (sTagNameLC == "textarea")?"textarea":"input"; 
		var oInput = document.createElement(sElementToCreate);
	
		oInput.style.backgroundColor = "transparent";
	//	oInput.style.width = "100%";
		oInput.style.padding = "0";
		oInput.style.margin = "0";
		oInput.style.border = "0";

		var pThis = this;
		if(document.all)
		{
			oInput.attachEvent("onchange", function(e){valueChangedIE(pThis,e);});
		}
		else
		{
			oInput.addEventListener("change",function(e){valueChangedFF(pThis,e);},false);
		}

			
		if(sTagNameLC== "secret")
		{
			oInput.type="password";
		}
		else if(sTagNameLC !== "textarea")
		{
			oInput.setAttribute("type","text");
		}
			
		this.element.appendChild(oInput);

		/*
			* [ISSUE] Stick with other method of always
			* 'locating' things just when we need them?
			*/

		this.m_value = oInput;
		//this.m_value.value = "null value";		

	}
};

XFormsInputValue.prototype.setValue = function(sValue)
{
	var bRet = false;

	if (this.m_value.value != sValue)
	{
		this.m_value.value = sValue;
		this.currValue = sValue;
		bRet = true;
	}
	else if(m_bFirstSetValue)
	{
		bRet = true;
		m_bFirstSetValue = false;
	}
	
	return bRet;
};
