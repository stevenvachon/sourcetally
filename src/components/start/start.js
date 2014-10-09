import can from "can";
import template from "./start.stache!";
import "./start.less!";

import fullscreen from "lib/fullscreen";
import getFiles from "lib/getFiles/index";
import nwGUI from "lib/nwGUI";
import resizeWindow from "lib/resizeWindow";

var nwWin;



export default can.Component.extend(
{
	tag: "app-start",
	template: template,
	
	init: function()
	{
		// When not first run
		fullscreen.exit();
		
		if ( this.scope.attr("globals.env.desktop") )
		{
			// If first run
			if (!nwWin) nwWin = nwGUI.Window.get();
			
			// When not first run
			nwWin.setResizable(false);
			// TODO :: disable fullscreen control
			resizeWindow(400, 480);
		}
	},
	
	scope:
	{
		dragging: false,
		pressed: false,
		
		
		
		browse: function(scope, element, event)
		{
			element.find("input[type=file]").click();
		},
		
		
		
		change: function(scope, element, event)
		{
			this.getFiles(scope, element, event);
		},
		
		
		
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
			
			this.getFiles(scope, element, event);
			
			this.attr("dragging", false);
		},
		
		
		
		fileTypes: function()
		{
			var output = "";
			
			if ( !this.attr("globals.env.web") )
			{
				this.attr("globals.extensions.code").each( function(value, key)
				{
					if (output) output += ",";
					output += key;
				});
			}
			
			this.attr("globals.extensions.archives").each( function(value, key)
			{
				if (output) output += ",";
				output += key;
			});
			
			return output;
		},
		
		
		
		getFiles: function(scope, element, event)
		{
			getFiles.list(event, function(error, files)
			{
				if (error)
				{
					alert(error);
				}
				else if (!files.length)
				{
					if ( this.attr("globals.env.web") )
					{
						var archiveTypes = can.Map.keys( this.attr("globals.extensions.archives") ).join();
						
						alert("Please select a single archive ("+ archiveTypes +") file containing your source code.");
					}
					else
					{
						alert("No compatible source code file(s) found.");
					}
				}
				else
				{
					if ( this.attr("globals.env.desktop") )
					{
						resizeWindow(1070, 680, null, function()
						{
							nwWin.setResizable(true);
							// TODO :: re-enable fullscreen control
							this.attr("globals.files", files);
						}.bind(this));
					}
					else
					{
						this.attr("globals.files", files);
					}
				}
			}.bind(this));
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
		
		
		
		stopPropagation: function(scope, element, event)
		{
			event.stopPropagation();
		}
	}
});
