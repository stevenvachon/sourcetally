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
		archives: ["zip"],
		code: sloc.extensions,
		codeFiltered: []	// Extensions filtered by user
	},
	
	files:
	{
		all: [],			// All imported files
		filtered: []		// Files filtered by extensions.codeFiltered
	},
	
	states:
	{
		counted: false,		// If all files have had their sloc counted
		filtered: false		// If an extension filter has been selected for files
	}
});
