import can from "can";
import template from "./app.stache!";
import "./app.less!";

import "./lib/document-environment";
import "./lib/document-focus";
import "./lib/helper-switch";

import "components/filter/filter";
import "components/report/report";
import "components/start/start";

import globals from "lib/globals";
import "lib/context-menu";



export default can.Component.extend(
{
	tag: "app-container",
	template: template,
	scope:
	{
		counted: false,
		files: [],
		filtered: false,
		globals: globals,
		
		state: can.compute( function()
		{
			if ( this.attr("files").attr("length") )
			{
				/*if ( this.attr("filtered") || this.attr("counted") )
				{*/
					return "report";
				/*}
				else
				{
					return "filter";
				}*/
			}
			
			return "start";
		})
	}
});
