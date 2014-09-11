import env from "./environment";



if ( env.isDesktop() )
{
	var nwMenu = new env.gui.Menu();
	
	
	
	nwMenu.append( new env.gui.MenuItem(
	{
		label: "Cut",
		click: function(){ document.execCommand("cut") }
	}));
	
	
	
	nwMenu.append( new env.gui.MenuItem(
	{
		label: "Copy",
		click: function(){ document.execCommand("copy") }
	}));
	
	
	
	nwMenu.append( new env.gui.MenuItem(
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
