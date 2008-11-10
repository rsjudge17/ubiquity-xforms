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
			objects:["EventTarget", "Context", "Group"]
		},

  /* Model */

		{
			selector:"xf|instance",
			objects:["EventTarget", "Instance"]
		},

		{
			selector:"xf|model",
			objects:["EventTarget", "Model"]
		},


		{
			selector:"xf|submission",
			objects:["EventTarget", "Context", "Submission"]
		},

    /* Controls */

    {
			selector:"xf|trigger",
			objects:["EventTarget", "Context", "Control"]
		},
		
		{
			selector:"xf|output >  pe-value",
			objects:["EventTarget", "XFormsOutputValue"]
		},

		{
			selector:" xf|value  > pe-value",
			objects:["EventTarget", "XFormsOutputValue"]
		},
/*
		{
			selector:"pe-value",
			objects:["EventTarget"]
		},
    */
		{
			selector:"xf|input",
			objects:["EventTarget", "Context", "Control"]
		},

		{
			selector:"xf|range",
			objects:["EventTarget", "Context", "Control"]
		},

    	{
			selector:"xf|output",
			objects:["EventTarget", "Context", "Control"]
		},

		{
			selector:"xf|textarea",
			objects:["EventTarget", "Context", "Control"]
		},
		
		{
			selector:"xf|secret",
			objects:["EventTarget", "Context", "Control"]
		},
		{
			selector:"xf|label",
			objects:["EventTarget", "Context", "Control"]
		},
		{
			selector:"xf|value",
			objects:["EventTarget", "Context", "Control","Value"]
		},
		{
			selector:"xf|item",
			objects:["EventTarget", "Context", "Item"]
		},

		{
			selector:"xf|input > pe-value",
			objects:["EventTarget", "XFormsInputValue"]
		},
		{
			selector:"xf|secret  > pe-value",
			objects:["EventTarget", "XFormsInputValue"]
		},
		{
			selector:"xf|textarea  > pe-value",
			objects:["EventTarget", "XFormsInputValue"]
		},
	
		{
			selector:"xf|select > pe-value",
			objects:["EventTarget", "XFormsInputValue"]
		},
		{
			selector:"xf|select1 >  pe-value ",
			objects:["EventTarget", "XFormsInputValue"]
		},
		{
			selector:"xf|range > pe-value",
			objects:["EventTarget", "RangeValue"]
		},

		{
			selector:"xf|range.geolocation > pe-value",
			objects:["EventTarget", "RangeValueGMAP"]
		},
		//HACK: re-override the value binding for rangemap/label, because IE does not support child selectors.
		{
			selector:"xf|range.geolocation > xf|label > pe-value",
			objects:["EventTarget", "XFormsOutputValue"]
		},

		{
			selector:"xf|select",
			objects:["EventTarget", "Context", "Control", "Select"]
		},				
		
		{
			selector:"xf|select1",
			objects:["EventTarget", "Context", "Control", "Select1"]
		},

    		{
			selector:"xf|repeat",
			objects:["EventTarget", "Context", "Repeat"]
		},

		{
			selector:"xf|group",
			objects:["EventTarget", "Context", "Group"]
		},

    		{
			selector:"xf|case",
			objects:["EventTarget", "XFormsCase"]
		},

		{
			selector:"xf|switch",
			objects:["EventTarget", "Switch"]
		},

    /* Actions */

		{
			selector:"xf|action",
			objects:["Listener", "XFAction"]
		},
		
		{
    		selector:"xf|message",
    		objects:["Listener", "Message"]
		},

		{
			selector:"xf|setvalue",
			objects:["Listener", "Context", "SetValue"]
		},

		{
			selector:"xf|send",
			objects:["Listener", "Send"]
		},

		{
			selector:"xf|toggle",
			objects:["Listener", "Toggle"]
		},

		{
			selector:"xf|rebuild",
			objects:["Listener", "Rebuild"]
		},
		{
			selector:"xf|recalculate",
			objects:["Listener", "Recalculate"]
		},
		{
			selector:"xf|revalidate",
			objects:["Listener", "Revalidate"]
		},
		{
			selector:"xf|refresh",
			objects:["Listener", "Refresh"]
		},
		{
			selector:"xf|reset",
			objects:["Listener", "Reset"]
		},
	//Common child elements
		{
			selector:"xf|label >  pe-value",
			objects:["EventTarget", "XFormsOutputValue"],
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
