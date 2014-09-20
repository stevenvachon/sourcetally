import can from "can";
import template from "./start.stache!";
import "./start.less!";

import getFiles from "./lib/getFiles/index";

import globals from "lib/globals";
import nwGUI from "lib/nwGUI";
import resizeWindow from "lib/resizeWindow";

var nwWin;



export default can.Component.extend(
{
	tag: "page-start",
	template: template,
	
	init: function()
	{
		/*if ( globals.attr("desktop") )
		{
			nwWin = nwGUI.Window.get();
			
			// Set window properties in case returning to this page
			nwWin.setResizable(false);
			
			// TODO :: disable fullscreen control
		}*/
	},
	
	scope:
	{
		dragging: false,
		globals: globals,
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
			
			getFiles.list(event, function(files)
			{
				console.log(files)
				alert( JSON.stringify(files,null,"  ") );
				/*if (!files.length)
				{
					if ( this.attr("globals.web") )
					{
						alert("Please select a single archive ("+ this.attr("globals.archiveExtensions").join() +") file containing your source code.");
					}
					else
					{
						alert("No compatible source code file(s) found.");
					}
				}
				else
				{
					this.attr("files", files);
					//this.resizeWindow();
				}*/
			}.bind(this));
			
			this.attr("dragging", false);
		},
		
		
		
		fileBrowser: function(scope, element, event)
		{
			element.find("input[type=file]").click();
		},
		
		
		
		filesPicked: function(scope, element, event)
		{
			getFiles.list(event, function(files)
			{
				console.log(files);
				alert( JSON.stringify(files,null,"  ") );
				/*if (!files.length)
				{
					if ( this.attr("globals.web") )
					{
						alert("Please select a single archive ("+ this.attr("globals.archiveExtensions").join() +") file containing your source code.");
					}
					else
					{
						alert("No compatible source code file(s) found.");
					}
				}
				else
				{
					this.attr("files", files);
					//this.resizeWindow();
				}*/
			}.bind(this));
		},
		
		
		
		fileTypes: function()
		{
			// TODO :: remove serialize() when this is resolved: https://forum.javascriptmvc.com/topic/each-within-attribute-value-prints-a-function
			return this.attr("globals.web") ? this.attr("globals.archiveExtensions").serialize() : this.attr("globals.sourceExtensions").serialize();
		},
		
		
		
		mouseDown: function()
		{
			this.attr("pressed", true);
			
			// Depress when mouse is outside document
			can.on.call(window, "mousemove", function(event)
			{
				var outBottom = event.clientY > window.innerHeight;
				var outLeft   = event.clientX < 0;
				var outRight  = event.clientX > window.innerWidth;
				var outTop    = event.clientY < 0;
				var out = outLeft || outRight || outTop || outBottom;
				this.attr("pressed", !out);
			}.bind(this));
			
			// Detect mouseup even outside document
			can.on.call(window, "mouseup", function(event)
			{
				this.attr("pressed", false);
				can.off.call(window, "mousemove");
				can.off.call(window, "mouseup");
			}.bind(this));
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
