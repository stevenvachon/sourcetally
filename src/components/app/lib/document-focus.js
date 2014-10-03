import $ from "jquery";
import globals from "lib/globals";
import nwGUI from "lib/nwGUI";



function visibility(newValue)
{
	if (newValue !== undefined)
	{
		focused = newValue;
	}
	else
	{
		// Minimized/hidden or not
		focused = document.visibilityState == "visible";
	}
	
	//document.body.className = focused ? "focused" : "unfocused";
	$(document.body).toggleClass("focused",focused).toggleClass("unfocused",!focused);
}



var focused;
visibility();

// Make sure that onblur gets called when the user doesn't first focus the document
if (focused) window.focus();



// Web version doesn't work in node-webkit (?)
switch (true)
{
	case globals.attr("env.desktop"):
	{
		var nwWin = nwGUI.Window.get();
		
		nwWin.on("blur",  function(){ visibility(false) });
		nwWin.on("focus", function(){ visibility(true) });
		
		break;
	}
	case globals.attr("web"):
	{
		document.addEventListener("visibilitychange", function(){ visibility() });
		window.addEventListener("blur",  function(){ visibility(false) });
		window.addEventListener("focus", function(){ visibility(true) });
		
		break;
	}
}
