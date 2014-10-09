import can from "can";
import sloc from "sloc";

import nwGUI from "./nwGUI";



var DESKTOP = "desktop";
var env;
//var MOBILE = "mobile";
var WEB = "web";



if (nwGUI)
{
	env = DESKTOP;
}
/*else if ()
{
	env = MOBILE;
}*/
else
{
	env = WEB;
}



var codeExtensions = {};

sloc.extensions.forEach( function(extension)
{
	codeExtensions[extension] = { selected:true };
});



export default new can.Map(
{
	env:
	{
		envString: env,
		
		desktop: (env == DESKTOP),
		//mobile:  (env == MOBILE),
		web:     (env == WEB)
	},
	
	extensions:
	{
		archives: { zip:true },
		code: codeExtensions
	},
	
	files: [],
	numFilesFiltered: 0,
	
	states:
	{
		counted: false,		// If all files have had their sloc counted
		filtered: false		// If an extension filter has been selected for files
	}
});
