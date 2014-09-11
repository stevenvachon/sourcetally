/*import env from "./environment";

if ( env.isDesktop() )
{
	var nwWin = env.gui.Window.get();
	
	nwWin.on("blur", function()
	{
		document.body.className = "unfocused";
	});
	
	nwWin.on("focus", function()
	{
		document.body.className = "focused";
	});
}*/


// NATIVE APPROACH -- doesn't work in Chrome (?)

var focused;
visibility();

// Make sure that onblur gets called when the user doesn't first focus the document
if (focused) window.focus();



function visibility(newValue)
{
	if (newValue !== undefined)
	{
		focused = newValue;
	}
	else
	{
		focused = document.visibilityState == "visible";
	}
	
	document.body.className = focused ? "focused" : "unfocused";
}



document.addEventListener("visibilitychange", function(event){ visibility() });
window.addEventListener("blur",  function(event){ visibility(false) });
window.addEventListener("focus", function(event){ visibility(true) });
