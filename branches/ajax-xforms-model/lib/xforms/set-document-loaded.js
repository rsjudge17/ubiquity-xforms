var g_bDocumentLoaded = false;

function RegisterDocumentLoaded() {
  g_bDocumentLoaded = true;
}

if (document.all) {
  window.attachEvent("onload",RegisterDocumentLoaded);
}
else 
{
// If the scripts are loaded during the load of the document, then this line
//	should be uncommented, so that initialisation can occur on load
// If, however, the scripts are to be loaded only after the document has otherwise 
//	been fully loaded, then the document should not be considered "loaded" for the 
//	purposes of this processor, until much later.  This is handled by the "second-onload"
//	module.
//window.addEventListener("load",RegisterDocumentLoaded,false);
}