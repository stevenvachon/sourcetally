import globals from "./globals";
import nwGUI from "./nwGUI";



var nwWin;

if ( globals.attr("env.desktop") )
{
	nwWin = nwGUI.Window.get();
}



function enter()
{
	if ( !isFullscreen() )
	{
		if ( globals.attr("env.desktop") )
		{
			nwWin.enterFullscreen();
		}
		else /*if ( globals.attr("env.web") )*/
		{
			var el = document.documentElement;
			
			if      (el.requestFullscreen)       el.requestFullscreen();
			else if (el.msRequestFullscreen)     el.msRequestFullscreen();
			else if (el.mozRequestFullScreen)    el.mozRequestFullScreen();
			else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
			
			document.addEventListener("keydown", keyListener);
		}
	}
}



function exit()
{
	if ( isFullscreen() )
	{
		var exitFunction;
		
		if ( globals.attr("env.desktop") )
		{
			exitFunction = nwWin.leaveFullscreen;
		}
		else /*if ( globals.attr("env.web") )*/
		{
			exitFunction = document.exitFullscreen || document.msExitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen;
		}
		
		if (exitFunction) exitFunction();
		
		document.removeEventListener("keydown", keyListener);
	}
}



function isFullscreen()
{
	if ( globals.attr("env.desktop") )
	{
		return nwWin.isFullscreen;
	}
	else /*if ( globals.attr("env.web") )*/
	{
		return !!(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
	}
}



function keyListener(event)
{
	if (event.keyCode == 13) toggleFullScreen();
}



export default { enter, exit };
