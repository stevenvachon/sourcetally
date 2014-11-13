steal.config(
{
	paths: {
		"accounting":	"vendors/accounting.js/accounting.js",
		"can":			"vendors/canjs/can.js",
		"can/*":		"vendors/canjs/*.js",
		"filesize":		"vendors/filesize/lib/filesize.js",
		"jquery":		"vendors/jquery/dist/jquery.js",
		"moment":		"vendors/moment/moment.js",
		"myth":			"vendors/myth/myth.js",
		"sloc":			"vendors/sloc/lib/sloc.js",
		"zip":			"vendors/zip.js/WebContent/zip.js",
		"zip/*":		"vendors/zip.js/WebContent/*.js"
	},
	
	// Until CanJS v2.2 is released
	map: {
		"jquery/jquery": "jquery"
	},
	
	ext: {
		//css:  "vendors/steal-myth/steal-myth-css",
		less: "vendors/steal-myth/steal-myth-less",
		stache: "can/view/stache/system"	// Until can.stache becomes default
	},
	
	// When supported -- until then, vendors/steal/less.js must be monkey-patched
	//lessOptions: {strictMath: true},
	
	// For jQuery plugins
	meta: { jquery:{exports:"jQuery"}, myth:{format:"cjs"} }
});



System.buildConfig = {map: {"can/util/util" : "can/util/domless/domless"}};
