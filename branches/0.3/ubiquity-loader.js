arrScripts = [
	  "http://yui.yahooapis.com/2.5.2/build/yuiloader/yuiloader-beta-min.js",
	  "http://ubiquity-xforms.googlecode.com/svn/branches/0.3/lib/xforms/ie-instance-fixer.js",
	  "http://ubiquity-xforms.googlecode.com/svn/branches/0.3/lib/xforms/set-document-loaded.js",
	  "http://ubiquity-xforms.googlecode.com/svn/branches/0.3/lib/xforms/loader-begin.js",
	  "http://ubiquity-xforms.googlecode.com/svn/branches/0.3/lib/xforms/main.js",
	  "http://ubiquity-xforms.googlecode.com/svn/branches/0.3/lib/xforms/loader-end.js"
];

var arrScriptElements = [];
var l = arrScripts.length;
//for (var i = l-1;i >=0;--i) {
arrScriptElements.push("<script>alert('loading')</script>");
for (var i = 0 ; i < l ; ++i) {
  arrScriptElements.push('<script src="' + arrScripts[i] +'" type="text/javascript">/**/</script>');
}

document.write(arrScriptElements.join("\n"));


