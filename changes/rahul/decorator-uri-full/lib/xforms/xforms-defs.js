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

//[ISSUE 52] IE6 does not allow CSS attribute selectors. This means those
//  selectors that require attribute selection must conditionally leave
//  those out when the user agent is IE6 and use the mechanism specified in
//  ie6-css-selectors-fixer.js instead.

// UX.selectors below (initial value) must not contain any attribute selectors
UX.selectors = {
    input : {
        color : {
            value : "xf|input.yui-widget-color > pe-value",
            labelvalue : "xf|input.yui-widget-color > xf|label > pe-value"
        },
        date : {
            value : "xf|input.yui-widget-calendar > pe-value",
            labelvalue : "xf|input.yui-widget-calendar > xf|label > pe-value"
        },
        dateminimal : {
            value : "xf|input.minimal-date > pe-value",
            labelvalue : "xf|input.minimal-date > xf|label > pe-value"
        }
    }
};

// Attribute selectors are added if the user agent supports them
if (!UX.isIE6) {
    UX.selectors.input.color.value += ", xf|input[datatype='xhd:color'] > pe-value";
    UX.selectors.input.color.labelvalue += ", xf|input[datatype='xhd:color'] > xf| label > pe-value";
    UX.selectors.input.date.value += ", xf|input[datatype='xsd:date'] > pe-value, xf|input[datatype='xf:date'] > pe-value";
    UX.selectors.input.date.labelvalue += ", xf|input[datatype='xsd:date'] > xf|label > pe-value, xf|input[datatype='xf:date'] > xf|label > pe-value";
    UX.selectors.input.dateminimal.value += ", xf|input[datatype='xsd:date'][appearance='minimal'] > pe-value, xf|input[datatype='xf:date'][appearance='minimal'] > pe-value";
    UX.selectors.input.dateminimal.labelvalue += ", xf|input[datatype='xsd:date'][appearance='minimal'] > xf|label > pe-value, xf|input[datatype='xf:date'][appearance='minimal'] > xf|label > pe-value";
}
// else, we delegate selection to ie6-css-selectors-fixer.js

//[ISSUE 8] IE does not natively support child selectors, but will ignore ">"
//	if found in css, making a selector such as "x > y", behave as a descendent
//	selector "x y".  This means that the order of occurrence of some of these
//	definitions is critical.  Specifically, the "common child" elements *must*
//	come after any controls that might use them, as (at present, anyway) label
//	is implemented as a control.

NamespaceManager.addSelectionNamespace("xf","http://www.w3.org/2002/xforms");	

DECORATOR.setupDecorator(
	[
	  
	//Switch off bindings within repeat, during load-time (FF )
		{
			selector:"xf|repeat > * ",
			cssText:"-moz-binding:url();"
		},
		
	//Switch bindings repeat back on within repeat.  (FF )

		{
			selector:"xf|repeat.repeat-ready > xf|group",
			objects:[]
		},

  /* Model */

		{
			selector:"xf|instance",
			objects:[]
		},

		{
			selector:"xf|model",
			objects:[]
		},


		{
			selector:"xf|submission",
			objects:[]
		},

    /* Controls */
        {
			selector:"xf|submit",
			objects:[]
		},

        {
			selector:"xf|trigger",
			objects:[]
		},
		
		{
			selector:"xf|output >  pe-value",
			objects:[]
		},
/*
		{
			selector:"pe-value",
			objects:["EventTarget"]
		},
    */
		{
			selector:"xf|input",
			objects:[]
		},

		{
			selector:"xf|range",
			objects:[]
		},

    	{
			selector:"xf|output",
			objects:[]
		},

		{
			selector:"xf|textarea",
			objects:[]
		},
		
		{
			selector:"xf|secret",
			objects:[]
		},
		{
			selector:"xf|label",
			objects:[]
		},
		{
			selector:"xf|alert",
			objects:[]
		},

		{
			selector:"xf|input > pe-value",
			objects:[]
		},
		{
			selector:"xf|secret  > pe-value",
			objects:[]
		},
		{
			selector:"xf|textarea  > pe-value",
			objects:[]
		},
	
		{
			selector:"xf|select > pe-value",
			objects:[]
		},
		{
			selector:"xf|select1 >  pe-value ",
			objects:[]
		},
		{
			selector:"xf|range > pe-value",
			objects:[]
		},
		{
			selector:" xf|alert > pe-value",
			objects:[]
		},

		{
			selector:"xf|label",
			objects:[]
		},
		{
			selector:"xf|value",
			objects:[]
		},
		{
			selector:"xf|value > pe-value",
			objects:[]
		},
		{
			selector:"xf|item",
			objects:[]
		},
		{
			selector:"xf|range.geolocation > pe-value",
			objects:[]
		},
		//HACK: re-override the value binding for rangemap/label, because IE does not support child selectors.
		{
			selector:"xf|range.geolocation > xf|label > pe-value",
			objects:[]
		},

        // YUI ColorPicker as <xf:input>
        {
            selector: UX.selectors.input.color.value,
            objects:[]
        },
        //HACK: IE does not support child selectors.
        {
            selector: UX.selectors.input.color.labelvalue,
            objects:[]
        },

		// YUI Calendar as <xf:input>
		{
			selector: UX.selectors.input.date.value,
			objects:[]
		},
		//HACK: IE does not support child selectors.
		{
			selector: UX.selectors.input.date.labelvalue,
			objects:[]
		},
		// Calendar with "minimal" appearance resorts to regular xf:input appearance
		{
			selector: UX.selectors.input.dateminimal.value,
			objects:[]
		},
		//HACK: IE does not support child selectors.
		{
			selector: UX.selectors.input.dateminimal.labelvalue,
			objects:[]
		},

		{
			selector:"xf|select",
			objects:[]
		},				
		
		{
			selector:"xf|select1",
			objects:[]
		},

    		{
			selector:"xf|repeat",
			objects:[]
		},

		{
			selector:"xf|group",
			objects:[]
		},

    		{
			selector:"xf|case",
			objects:[]
		},

		{
			selector:"xf|switch",
			objects:[]
		},

    /* Actions */

		{
			selector:"xf|action",
			objects:[]
		},
		
		{
    		selector:"xf|message",
    		objects:[]
		},

		{
			selector:"xf|setvalue",
			objects:[]
		},

		{
			selector:"xf|send",
			objects:[]
		},

		{
			selector:"xf|toggle",
			objects:[]
		},

		{
			selector:"xf|rebuild",
			objects:[]
		},
		{
			selector:"xf|recalculate",
			objects:[]
		},
		{
			selector:"xf|revalidate",
			objects:[]
		},
		{
			selector:"xf|refresh",
			objects:[]
		},
		{
			selector:"xf|reset",
			objects:[]
		},
	//Common child elements
		{
			selector:"xf|label >  pe-value",
			objects:[],
			important:true
		},
	//Switch off bindings within repeat, during load-time (IE )
		{
			selector:"xf|repeat *",
			cssText:"-binding-ignore:true;"
		},
	//Switch bindings repeat back on within repeat.  (IE )
		{
			selector:"xf|repeat.repeat-ready *",
			cssText:"-binding-ignore:false;"
		}

	],
	"http://www.w3.org/2002/xforms"); //to tell the decorator so that it doesn't need to write these definitions again

