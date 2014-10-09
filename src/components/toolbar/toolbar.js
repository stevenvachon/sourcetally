import can from "can";
import template from "./toolbar.stache!";
import "./toolbar.less!";



export default can.Component.extend(
{
	tag: "app-toolbar",
	template: template,
	scope:
	{
		filter: function()
		{
			can.batch.start();
			this.attr("globals.states").attr("counted", false);
			this.attr("globals.states").attr("filtered", false);
			can.batch.stop();
		},
		
		
		
		report: function()
		{
			this.attr("globals.states").attr("filtered", true);
		},
		
		
		
		start: function()
		{
			can.batch.start();
			this.attr("globals.states").attr("counted", false);
			this.attr("globals.states").attr("filtered", false);
			this.attr("globals").attr("files", []);
			can.batch.stop();
		}
	}
});
