var nwGUI = null;



try
{
	if (global && global.window && global.window.nwDispatcher)
	{
		nwGUI = global.window.nwDispatcher.requireNwGui();
	}
}
catch (error){}



export default nwGUI;
