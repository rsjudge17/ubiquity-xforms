/**
Inserts htc instruction to prevent IE mangling instancedata markup.
@returns if an instancedata guard was successfully added, false, if no instancedata guard is implemented for the current environment.
*/
if(document.all)
{
  var collNamespaces = document.namespaces;
  for(var i = 0; i < collNamespaces.length; ++i)
  {
    if(collNamespaces[i].urn == "http://www.w3.org/2002/xforms") {
      document.write('<?import  namespace="'+collNamespaces[i].name+'" implementation="'+g_sBehaviourDirectory+'instance.htc"?>')		
    }
  }
}
