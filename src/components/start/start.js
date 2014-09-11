import can from "can";
import template from "./start.stache!";
import "./start.less!";

//import env from "lib/environment";
import resizeWindow from "lib/resizeWindow";

//var nwWin = env.gui.Window.get();



export default can.Component.extend(
{
	tag: "page-start",
	template: template,
	
	init: function()
	{
		// Set window properties in case returning to this page
		//nwWin.setResizable(false);
		// TODO :: disable fullscreen control
	},
	
	scope:
	{
		dragging: false,
		pressed: false,
		
		dragOut: function()
		{
			this.attr("dragging", false);
		},
		
		dragOver: function(scope, element, event)
		{
			event.stopPropagation();
			event.preventDefault();
			
			this.attr("dragging", true);
		},
		
		drop: function(scope, element, event)
		{
			event.stopPropagation();
			event.preventDefault();
			
			var files = [];
			var items;
			
			if (event.cliboardData) items = event.originalEvent.cliboardData["items"];
			if (event.dataTransfer) items = event.originalEvent.dataTransfer["items"];
			
			console.log(items, event.originalEvent)
			
			for (var i=0, len=items.length; i<len; i++)
			{
				files.push( items[i].getAsFile().path );
			}
			
			this.attr("dragging", false);
			this.attr("files", files);
			//this.resizeWindow();
		},
		
		fileBrowser: function(scope, element, event)
		{
			element.find("input[type=file]").click();
		},
		
		filesPicked: function(scope, element, event)
		{
			var files = [];
			
			for (var i=0; i<event.originalEvent.srcElement.files.length; i++)
			{
				files.push( event.originalEvent.srcElement.files[i].path );
			}
			
			files.push("ASD")
			
			this.attr("files", files);
			//this.resizeWindow();
		},
		
		mouseDown: function()
		{
			this.attr("pressed", true);
			
			// Detect mouseup even outside document
			var that = this;
			can.on.call(window, "mouseup", function(event)
			{
				that.attr("pressed", false);
				can.off.call(window, "mouseup");
			});
		},
		
		resizeWindow: function()
		{
			resizeWindow(1070,680, 650, function()
			{
				//nwWin.setResizable(true);
				// TODO :: re-enable fullscreen control
				console.log( "DONE", this.attr("files") );
			}.bind(this));
		},
		
		stopPropagation: function(scope, element, event)
		{
			event.stopPropagation();
		}
	}
});
