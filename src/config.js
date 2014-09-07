//(function()
//{
	steal.config(
	{
		//main: "init",
		
		paths: {
			// v2.2.0-pre (dev version)
			"can":    "vendors/canjs/can.js",
			"can/*":  "vendors/canjs/*.js",
			
			//"can":    "vendors/canjs/amd/can.js",
			//"can/*":  "vendors/canjs/amd/can/*.js",
			"jquery": "vendors/jquery/dist/jquery.js"
		},
		
		// Until CanJS v2.2 is released
		map: {
			//"can/util/util": "can/util/jquery/jquery",
			"jquery/jquery": "jquery"
		},
		
		// Until can.stache becomes default
		ext: {
			stache: "can/view/stache/system"
		},
		
		// For jQuery plugins
		meta: {jquery: {exports : "jQuery"}}
	});
//})();



System.buildConfig = {map: {"can/util/util" : "can/util/domless/domless"}};
