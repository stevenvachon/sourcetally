import can from "can";
import template from "./report.stache!";
import "./report.less!";

import getFiles from "lib/getFiles/index";
import sloc from "sloc";



export default can.Component.extend(
{
	tag: "page-report",
	template: template,
	
	init: function()
	{
		this.scope.countFiles();
	},
	
	scope:
	{
		ascending: false,
		count: 0,
		
		columns:
		[
			{ sorting:false, name:"File Name" },
			{ sorting:false, name:"Nominal Lines" },
			{ sorting:false, name:"Source Code Lines" },
			{ sorting:false, name:"Source Code Lines (%)" },
			{ sorting:false, name:"Comment Lines" },
			{ sorting:false, name:"Comment Lines (%)" },
			{ sorting:false, name:"Blank Lines" },
			{ sorting:false, name:"Blank Lines (%)" },
			{ sorting:false, name:"Mixed Lines" },
			{ sorting:false, name:"Mixed Lines (%)" },
			{ sorting:false, name:"Total Lines" }
		],
		
		
		
		countFiles: function()
		{
			getFiles.contents( this.attr("files"), function(error, data, fileIndex)
			{
				var file = this.attr("files").attr(fileIndex);
				
				this.attr( "count", this.attr("count")+1 );
				
				if (error)
				{
					console.log("error", file.attr("path"));
					file.attr("error", true);
				}
				else
				{
					var slocData = sloc( data, file.attr("extension") );
					
					slocData["comment%"] = this.round(slocData.comment / slocData.total * 100, 2);
					slocData["empty%"]   = this.round(slocData.empty   / slocData.total * 100, 2);
					slocData["mixed%"]   = this.round(slocData.mixed   / slocData.total * 100, 2);
					slocData["source%"]  = this.round(slocData.source  / slocData.total * 100, 2);
					
					file.attr("sloc", slocData);
				}
				
				if ( this.attr("count") >= this.attr("files").attr("length") )
				{
					this.attr("counted", true);
				}
			}.bind(this));
		},
		
		
		
		round: function(value, decimals)
		{
			// http://www.jacklmoore.com/notes/rounding-in-javascript/
			return Number( Math.round(value+"e"+decimals) + "e-"+decimals );
		},
		
		
		
		sortColumn: function(scope, element, event)
		{
			if ( scope.attr("sorting") )
			{
				this.attr( "ascending", !this.attr("ascending") );
			}
			else
			{
				can.batch.start();
				
				this.attr("columns").forEach( function(column)
				{
					column.attr("sorting", false);
				});
				
				scope.attr("sorting", true);
				
				can.batch.stop();
			}
		}
	}/*,
	
	helpers:
	{
		calculations: function(options)
		{
			var slocData = options.scope.attr("sloc");
			
			console.log(slocData);
		}
	}*/
});
