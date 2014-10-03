import can from "can";
import template from "./app.stache!";
import "./app.less!";

import "./lib/document-environment";
import "./lib/document-focus";
import "./lib/helper-switch";

import "components/filter/filter";
import "components/report/report";
import "components/start/start";
import "components/toolbar/toolbar";

import globals from "lib/globals";
import "lib/context-menu";



export default can.Component.extend(
{
	tag: "app-container",
	template: template,
	scope:
	{
		globals: globals,
		
		state: can.compute( function()
		{
			if ( this.attr("globals.files.all").attr("length") )
			{
				if ( this.attr("globals.states.filtered") || this.attr("globals.states.counted") )
				{
					return "report";
				}
				else
				{
					return "filter";
				}
			}
			
			return "start";
		})
	}
});
