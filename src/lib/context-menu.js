import globals from "./globals";
import nwGUI from "./nwGUI";



// Node-WebKit has context menus disabled
if ( globals.attr("desktop") )
{
	var nwMenu = new nwGUI.Menu();
	var nwMenuItem = nwGUI.MenuItem;
	
	
	
	nwMenu.append( new nwMenuItem(
	{
		label: "Cut",
		click: function(){ document.execCommand("cut") }
	}));
	
	
	
	nwMenu.append( new nwMenuItem(
	{
		label: "Copy",
		click: function(){ document.execCommand("copy") }
	}));
	
	
	
	nwMenu.append( new nwMenuItem(
	{
		label: "Paste",
		click: function(){ document.execCommand("paste") }
	}));
	
	
	
	document.addEventListener("contextmenu", function(event)
	{
		event.preventDefault();
		nwMenu.popup(event.x, event.y);
	});
}
