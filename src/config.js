//(function()
//{
	steal.config(
	{
		paths: {
			"can":    "vendors/canjs/can.js",
			"can/*":  "vendors/canjs/*.js",
			"jquery": "vendors/jquery/dist/jquery.js",
			"myth":   "vendors/myth/myth.js"
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
		
		lessOptions: {strictMath: true},
		
		// For jQuery plugins
		meta: { jquery:{exports:"jQuery"}, myth:{format:"cjs"} }
	});
//})();



System.buildConfig = {map: {"can/util/util" : "can/util/domless/domless"}};
