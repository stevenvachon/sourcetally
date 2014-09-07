import can from "can";
import template from "./app.stache!";
import "./app.less!";



export default can.Component.extend(
{
	tag: "app-container",
	template: template,
	
	
	
	/*init: function(element, options)
	{
		can.route("", {section:""});
		can.route(":section/");
		can.route(":section/:sub/");
		can.route("assets/", false);
		can.route.ready();
	},*/
	
	
	
	scope:
	{
		
	},
	
	
	
	events:
	{
		/*"{can.route} section": function(route, event, newVal)
		{
			switch (newVal)
			{
				case "":
				{
					console.log("load home section");
					break;
				}
				case "fake-page1":
				case "fake-page2":
				{
					console.log("load "+newVal+" section");
					break;
				}
				default:
				{
					console.log("load error 404 page");
				}
			}
		}*/
	}
});
