/*
 * Module loader for XForms.
 *
 * Currently includes SMIL loading, but that will be separated out.
 * Currently mixes two approaches--the old one from the old 'loader.js', and the new one using
 * the YUI module loader.
 */

var g_pathToLib = "../lib/";
var g_sBehaviourDirectory = "../behaviours/";

var g_bUseDocumentDotWrite = true;
var g_bUseFormsPlayer = false;

try
{
	if (document.UseFormsPlayer)
		g_bUseFormsPlayer = true;
}
catch(e)
{
}


//for using the  faster versions of YUI libs
var sMin = "";//"-min"

//  var oLogReader = new YAHOO.widget.LogReader("fc-logger",{top:"50%",right:"10px"});
//  document.logger = new YAHOO.widget.LogWriter("ajaxfP");
document.logger = { log: function(sText, sContext) { } };


function AddScriptsToDocument_DW()
{

	var arrScriptElements = new Array();
	for(i in document.m_arrScripts)
	{
		arrScriptElements.push('<script src="'+ g_pathToLib + document.m_arrScripts[i] +'">/**/</script>');
	}
	
	if(document.all)
	{
		//Add the "Element Behaviours" to the list of stuff being added to the form for IE.
		var collNamespaces = document.namespaces;
		var arrImports = new Array();

		for(var i = 0; i < collNamespaces.length; ++i)
		{
			if(collNamespaces[i].urn == "http://www.w3.org/2002/xforms")
			{
				arrScriptElements.push('<?import  namespace="'+collNamespaces[i].name+'" implementation="'+g_sBehaviourDirectory+'instance.htc"?>');
				arrScriptElements.push('<?import  namespace="'+collNamespaces[i].name+'" implementation="'+g_sBehaviourDirectory+'xf-extension.htc" ?>');
			}
		}
	}

	document.write(arrScriptElements.join("\n"));
}

//In XHTML mode, firefox does not permit document.write()
function AddScriptsToDocument_DOM()
{
	var oHead =document.getElementsByTagName("head")[0];

	for(i in document.m_arrScripts)
	{
		var oScript = document.createElement('script');
		oScript.setAttribute("type","text/javascript");
		oScript.setAttribute("src",g_pathToLib + document.m_arrScripts[i]);
		oHead.appendChild(oScript);
	}	
}

function AddObjectTagAndImportInstructions()
{
	var sObjectTag = '<object classid="CLSID:4D0ABA11-C5F0-4478-991A-375C4B648F58" id="formsPlayer" height="0" width="0"><b>formsPlayer has failed to load! Please check your installation.</b></object>'
	var collNamespaces = document.namespaces;
	var arrImports = new Array();

	for(var i = 0; i < collNamespaces.length; ++i)
	{
		if(collNamespaces[i].urn == "http://www.w3.org/2002/xforms")
		{
			arrImports.push('<?import namespace="'+collNamespaces[i].name+'" implementation="#formsPlayer"?>');
		}
	}

	document.write(sObjectTag + arrImports.join('\n'));
}

function loadScripts()
{

if(!g_bUseFormsPlayer)
{
    document.m_arrScripts = [
 
         /*
          * For xf:message
          */

//        'third-party/yowl/yowl.js',
 
         /*
          * For xf:range
          */

//      'Scriptaculous/Prototype.js',
//      'Scriptaculous/scriptaculous.js',

        // ... 'Animation/Animate.js',
//        'Animation/AnimateImpl.js',
        // ... 'Animation/AnimateImplYUI.js',
//    	'Animation/AnimateImplScriptaculous.js',
    
    	// ... 'ajaxslt/misc.js',
    	// ... 'ajaxslt/dom.js',
    	// ... 'ajaxslt/xpath.js',
    
    	// ... 'xforms/ajaxslt-improvements.js',
    	// ... 'xforms/xforms-core-function-library.js',
    	// ... 'xforms/VertexTargets.js',
    	// ... 'xforms/xforms.js',
    
    	// ... 'xforms/conditional-invocation.js',
    	// ... 'xforms/context.js',
    	// ... 'xforms/Control.js',
    	// ... 'xforms/pds.js',
    	// ... 'xforms/model.js',
    	// ... 'xforms/state.js',
    	// ... 'xforms/modelObj.js',
    	// ... 'xforms/input-value.js',
    	// ... 'xforms/output-value.js',
    	'xforms/range-value.js',
    
    	// ... 'smil/smil-set.js',
    	// ... 'smil/smil-animate.js',
    
    	// ... 'xforms/Instance.js',
    	// ... 'xforms/xf-action.js',
    	'xforms/actions.js',
    	'xforms/hint.js',
    	'xforms/setvalue.js',

    	'xforms/Repeat.js',
    	'xforms/Group.js',
    
    	// ... 'xforms/Submission.js',
    	// ... 'xforms/xforms-submission.js',
    	// ... 'xforms/xforms-submission-yui.js',
    	
    	'xforms/Switch.js',
    	'_backplane/case.js',
    	'xforms/case.js',

    	// ... 'threads.js',
    
      // ... 'dom/listener.js',
      // ... 'dom/dom2events.js',
    	// ... 'dom/eventTargetProxy.js',
    
    	//'insertAdjacentHTML.js',

    	// ... 'decorate.js',
    	// ... 'smil/smil-defs.js',
    	// ... 'xforms/xforms-defs.js'
    ];
  }

  AddXFormsFunctionalityToDocument = g_bUseFormsPlayer&&document.all?AddObjectTagAndImportInstructions:g_bUseDocumentDotWrite?AddScriptsToDocument_DW:AddScriptsToDocument_DOM;
  AddXFormsFunctionalityToDocument();
  return;
}



(
  function(){
    var loader = new YAHOO.util.YUILoader();

    loader.addModule({ name: "xforms-listener",            type: "js",  fullpath: "http://ubiquity-xforms.googlecode.com/svn/branches/0.2/lib/dom/listener.js" });
    loader.addModule({ name: "xforms-threads",             type: "js",  fullpath: "http://ubiquity-xforms.googlecode.com/svn/branches/0.2/lib/threads.js" });
    loader.addModule({ name: "xforms-dom2events",          type: "js",  fullpath: "http://ubiquity-xforms.googlecode.com/svn/branches/0.2/lib/dom/dom2events.js",
      requires: [ "yahoo" ] });
    loader.addModule({ name: "xforms-insert-adjacent-html", type: "js",  fullpath: "http://ubiquity-xforms.googlecode.com/svn/branches/0.2/lib/insertAdjacentHTML.js" });

    loader.addModule({ name: "xforms-vertex-target",       type: "js",  fullpath: "http://ubiquity-xforms.googlecode.com/svn/branches/0.2/lib/xforms/VertexTargets.js",
      requires: [ "yahoo" ] });
    loader.addModule({ name: "xforms-state",               type: "js",  fullpath: "http://ubiquity-xforms.googlecode.com/svn/branches/0.2/lib/xforms/state.js" });

    loader.addModule({ name: "backplane-pds",              type: "js",  fullpath: "http://ubiquity-xforms.googlecode.com/svn/branches/0.2/lib/xforms/pds.js" });
    loader.addModule({ name: "backplane-model",            type: "js",  fullpath: "http://ubiquity-xforms.googlecode.com/svn/branches/0.2/lib/xforms/model.js",
      requires: [ "backplane-pds" ] });
    loader.addModule({ name: "xforms-model",               type: "js",  fullpath: "http://ubiquity-xforms.googlecode.com/svn/branches/0.2/lib/xforms/modelObj.js",
      requires: [ "backplane-model" ] });
    loader.addModule({ name: "xforms-submission-core",     type: "js",  fullpath: "http://ubiquity-xforms.googlecode.com/svn/branches/0.2/lib/xforms/xforms-submission.js" });
    loader.addModule({ name: "xforms-submission-core-yui", type: "js",  fullpath: "http://ubiquity-xforms.googlecode.com/svn/branches/0.2/lib/xforms/xforms-submission-yui.js",
      requires: [ "xforms-submission-core" ] });
    loader.addModule({ name: "xforms-submission",          type: "js",  fullpath: "http://ubiquity-xforms.googlecode.com/svn/branches/0.2/lib/xforms/Submission.js",
      requires: [ "xforms-processor", "xforms-submission-core-yui" ] });

    loader.addModule({ name: "xforms-processor",           type: "js",  fullpath: "http://ubiquity-xforms.googlecode.com/svn/branches/0.2/lib/xforms/xforms.js",
      requires: [ "xforms-model" ] });
    loader.addModule({ name: "xforms-conditional-invocation", type: "js", fullpath: "http://ubiquity-xforms.googlecode.com/svn/branches/0.2/lib/xforms/conditional-invocation.js",
      requires: [ "xforms-processor" ] });

    loader.addModule({ name: "libxh-decorator",            type: "js",  fullpath: "http://ubiquity-xforms.googlecode.com/svn/branches/0.2/decorate.js" });

    loader.addModule({ name: "xforms-dom-misc",            type: "js",  fullpath: "http://ubiquity-xforms.googlecode.com/svn/branches/0.2/lib/ajaxslt/misc.js" });
    loader.addModule({ name: "xforms-dom",                 type: "js",  fullpath: "http://ubiquity-xforms.googlecode.com/svn/branches/0.2/lib/ajaxslt/dom.js",
      requires: [ "xforms-dom-misc" ] });
    loader.addModule({ name: "xforms-xpath",               type: "js",  fullpath: "http://ubiquity-xforms.googlecode.com/svn/branches/0.2/lib/ajaxslt/xpath.js" });
    loader.addModule({ name: "xforms-ajaxslt-improvements", type: "js",  fullpath: "http://ubiquity-xforms.googlecode.com/svn/branches/0.2/lib/xforms/ajaxslt-improvements.js",
      requires: [ "xforms-dom", "xforms-xpath" ] });
    loader.addModule({ name: "xforms-core-function-library", type: "js",  fullpath: "http://ubiquity-xforms.googlecode.com/svn/branches/0.2/lib/xforms/xforms-core-function-library.js",
      requires: [ "xforms-xpath" ] });

    loader.addModule({ name: "xforms-instance",            type: "js",  fullpath: "http://ubiquity-xforms.googlecode.com/svn/branches/0.2/lib/xforms/Instance.js",
      requires: [ "xforms-dom", "xforms-dom2events", "xforms-ajaxslt-improvements", "xforms-core-function-library" ] });

    loader.addModule({ name: "xforms-input-value",         type: "js",  fullpath: "http://ubiquity-xforms.googlecode.com/svn/branches/0.2/lib/xforms/input-value.js" });
    loader.addModule({ name: "xforms-output-value",        type: "js",  fullpath: "http://ubiquity-xforms.googlecode.com/svn/branches/0.2/lib/xforms/output-value.js" });
    loader.addModule({ name: "xforms-control",             type: "js",  fullpath: "http://ubiquity-xforms.googlecode.com/svn/branches/0.2/lib/xforms/Control.js",
      requires: [ "xforms-model", "xforms-processor", "xforms-state", "xforms-insert-adjacent-html" ] });
    loader.addModule({ name: "xforms-context",             type: "js",  fullpath: "http://ubiquity-xforms.googlecode.com/svn/branches/0.2/lib/xforms/context.js" });
    loader.addModule({ name: "xforms-event-target-proxy",  type: "js",  fullpath: "http://ubiquity-xforms.googlecode.com/svn/branches/0.2/lib/dom/eventTargetProxy.js",
      requires: [ "xforms-dom2events" ] });
    loader.addModule({ name: "xforms-action",              type: "js",  fullpath: "http://ubiquity-xforms.googlecode.com/svn/branches/0.2/lib/xforms/xf-action.js",
      requires: [ "xforms-listener", "xforms-threads" ] });

    loader.addModule({ name: "xforms-defs",                type: "js",  fullpath: "http://ubiquity-xforms.googlecode.com/svn/branches/0.2/xforms/xforms-defs.js",
      requires: [
        "libxh-decorator",
        "xforms-listener",
        "xforms-conditional-invocation",
        "xforms-model", "xforms-instance", "xforms-submission",
        "xforms-action", "xforms-context", "xforms-control",
        "xforms-input-value", "xforms-output-value"
      ]
    });

    loader.addModule({ name: "animate-factory",            type: "js",  fullpath: "http://ubiquity-xforms.googlecode.com/svn/branches/0.2/Animation/Animate.js" });
    loader.addModule({ name: "smil-set",                   type: "js",  fullpath: "http://ubiquity-xforms.googlecode.com/svn/branches/0.2/lib/smil/smil-set.js",
      requires: [ "animate-factory" ] });
    loader.addModule({ name: "smil-animate",               type: "js",  fullpath: "http://ubiquity-xforms.googlecode.com/svn/branches/0.2/lib/smil/smil-animate.js",
      requires: [ "animate-factory" ] });
    loader.addModule({ name: "animate-impl-yui",           type: "js",  fullpath: "http://ubiquity-xforms.googlecode.com/svn/branches/0.2/lib/Animation/AnimateImplYUI.js",
      requires: [ "animate-factory" ] });
    loader.addModule({ name: "smil-defs",                  type: "js",  fullpath: "http://ubiquity-xforms.googlecode.com/svn/branches/0.2/smil/smil-defs.js",
      requires: [ "libxh-decorator", "xforms-listener", "xforms-conditional-invocation", "animate-impl-yui", "smil-set", "smil-animate" ] });

    loader.require( "dom", "event", "logger", "animation", "connection",
      "xforms-threads", "xforms-event-target-proxy", "xforms-dom2events", "xforms-vertex-target", "xforms-defs",
      "smil-defs"
    );

    loader.onSuccess = function(o) {
      YAHOO.util.Event.onDOMReady(
        function() {
        	if (document.all)
        	{
        		var collNamespaces = document.namespaces;
        		var arrImports = new Array();
    
        		for(var i = 0; i < collNamespaces.length; ++i)
        		{
        			if (collNamespaces[i].urn == "http://www.w3.org/2002/xforms")
        			{
        			  //ScriptDiv.insertAdjacentHTML("afterBegin",sHTML + sScript);
        			  //collNamespaces[i].doImport(g_sBehaviourDirectory + "xf-extension.htc");
        			  collNamespaces[i].doImport(g_sBehaviourDirectory + "instance.htc");
        			}
        		}
        	}
        }
      );
      alert("Successfully loaded Ubiquity XForms");
    };
    
    loader.insert();
  }()
);
