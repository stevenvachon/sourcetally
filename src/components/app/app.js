import can from "can";
import template from "./app.stache!";
import "./app.less!";

import "./lib/document-environment";
import "./lib/document-focus";
import "./lib/helper-switch";

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
		files: [],
		globals: globals,
		
		state: can.compute( function()
		{
			if ( this.attr("files").attr("length") )
			{
				var temp = this.attr("files").serialize();
				console.log(temp);
				alert(temp[0].path+" :: "+temp[0].contents);
				
				return "report";
			}
			
			return "start";
		})
	}
});
