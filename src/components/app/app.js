import can from "can";
import template from "./app.stache!";
import "./app.less!";
import "./helper-switch";

import "components/report/report";
import "components/start/start";

import "lib/context-menu";
import "lib/document-focus";



export default can.Component.extend(
{
	tag: "app-container",
	template: template,
	scope:
	{
		files: [],
		
		state: can.compute( function()
		{
			if ( this.attr("files").attr("length") )
			{
				return "report";
			}
			
			return "start";
		})
	}
});
