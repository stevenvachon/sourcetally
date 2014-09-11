var env;
var gui = null;

try
{
	if (global && global.window && global.window.nwDispatcher)
	{
		env = "desktop";
		gui = global.window.nwDispatcher.requireNwGui();
	}
}
catch (error)
{
	env = "web";
}



function isDesktop()
{
	return env == "desktop";
}



/*function isMobile()
{
	return env == "mobile";
}*/



function isWeb()
{
	return env == "web";
}



export default { gui, isDesktop, isWeb };
