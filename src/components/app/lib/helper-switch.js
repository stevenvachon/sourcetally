import can from "can";



can.stache.registerHelper("switch", function(param, options)
{
	var s = options.scope;
	
	s._switch = { is:true, done:false, param:param() };
	
	var fragment = options.fn(s, options.options);
	
	delete s._switch;
	return fragment;
});



can.stache.registerHelper("case", function()
{
	var options = Array.prototype.pop.apply(arguments);
	var s = options.scope;
	
	if (s._switch)
	{
		var containsParam = false;
		
		for (var i=0, numArgs=arguments.length; i<numArgs; i++)
		{
			if (arguments[i] == s._switch.param)
			{
				containsParam = true;
				break;
			}
		}
		
		if (containsParam)
		{
			return options.fn(s, options.options);
		}
	}
});
