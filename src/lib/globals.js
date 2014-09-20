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
	env: env,
	
	archiveExtensions: ["zip"],
	sourceExtensions: sloc.extensions,
	
	desktop: (env == DESKTOP),
	//mobile:  (env == MOBILE),
	web:     (env == WEB)
});
