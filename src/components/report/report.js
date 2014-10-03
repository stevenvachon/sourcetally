import can from "can";
import template from "./report.stache!";
import "./report.less!";

import getFiles from "lib/getFiles/index";

import accounting from "accounting";
import sloc from "sloc";
//import "can/map/sort/sort";



export default can.Component.extend(
{
	tag: "app-report",
	template: template,
	
	init: function()
	{
		// Give interface time to become visible before starting the (currently heavy) counting
		setTimeout( function()
		{
			this.scope.countFiles();
		}.bind(this));
	},
	
	scope:
	{
		ascending: false,
		count: 0,
		
		columns:
		[
			{ sorting:false, key:"path",          name:"File Name" },
			{ sorting:false, key:"sloc.total",    name:"Nominal Lines" },
			{ sorting:false, key:"sloc.source",   name:"Source Code Lines" },
			{ sorting:false, key:"sloc.source%",  name:"Source Code Lines (%)" },
			{ sorting:false, key:"sloc.comment",  name:"Comment Lines" },
			{ sorting:false, key:"sloc.comment%", name:"Comment Lines (%)" },
			{ sorting:false, key:"sloc.empty",    name:"Blank Lines" },
			{ sorting:false, key:"sloc.empty%",   name:"Blank Lines (%)" },
			{ sorting:false, key:"sloc.mixed",    name:"Mixed Lines" },
			{ sorting:false, key:"sloc.mixed%",   name:"Mixed Lines (%)" },
			{ sorting:false, key:"sloc.total",    name:"Total Lines" }
		],
		
		
		
		countFiles: function()
		{
			can.batch.start();
			
			getFiles.contents( this.attr("globals.files.filtered"), function(error, data, fileIndex)
			{
				var file = this.attr("globals.files.filtered").attr(fileIndex);
				
				this.attr( "count", this.attr("count")+1 );
				
				if (error)
				{
					console.log("error", file.attr("path"));
					file.attr("error", true);
				}
				else
				{
					var slocData = sloc( data, file.attr("extension") );
					
					slocData["comment%"] = this.percent(slocData.comment, slocData.total);
					slocData["empty%"]   = this.percent(slocData.empty,   slocData.total);
					slocData["mixed%"]   = this.percent(slocData.mixed,   slocData.total);
					slocData["source%"]  = this.percent(slocData.source,  slocData.total);
					
					file.attr("sloc", slocData);
				}
				
				if ( this.attr("count") >= this.attr("globals.files.filtered").attr("length") )
				{
					this.attr("globals.states").attr("counted", true);
					can.batch.stop();
				}
			}.bind(this));
		},
		
		
		
		percent: function(value, scale)
		{
			return value / scale * 100;
		},
		
		
		
		sortColumn: function(scope, element, event)
		{
			can.batch.start();
			
			if ( scope.attr("sorting") )
			{
				this.attr( "ascending", !this.attr("ascending") );
			}
			else
			{
				this.attr("columns").forEach( function(column)
				{
					column.attr("sorting", false);
				});
				
				scope.attr("sorting", true);
			}
			
			var comparator = scope.attr("key");
			
			// TODO :: switch to `can.List.prototype.sort` when possible
			this.attr("globals.files.filtered", Array.prototype.sort.apply( this.attr("globals.files.filtered"), [function(a,b)
			{
				a = a.attr(comparator);
				b = b.attr(comparator);
				
				// TODO :: if a===b, sort by path
				if ( this.attr("ascending") )
				{
					return a===b ? 0 : a<b ? -1 : 1;
				}
				else
				{
					return a===b ? 0 : a>b ? -1 : 1;
				}
			}.bind(this)]).slice(0));
			
			/*this.attr("files").sort( function(a, b)
			{
				a = a.attr(comparator);
				b = b.attr(comparator);
				
				// TODO :: if a===b, sort by path
				if ( this.attr("ascending") )
				{
					return a===b ? 0 : a<b ? -1 : 1;
				}
				else
				{
					return a===b ? 0 : a>b ? -1 : 1;
				}
			}.bind(this));*/
			
			can.batch.stop();
		},
		
		
		
		totals: can.compute( function()
		{
			var totals =
			{
				comment: 0,
				empty: 0,
				mixed: 0,
				source: 0,
				total: 0
			};
			
			this.attr("globals.files.filtered").forEach( function(file)
			{
				totals.comment += file.attr("sloc").attr("comment");
				totals.empty   += file.attr("sloc").attr("empty");
				totals.mixed   += file.attr("sloc").attr("mixed");
				totals.source  += file.attr("sloc").attr("source");
				totals.total   += file.attr("sloc").attr("total");
			});
			
			totals["comment%"] = this.percent(totals.comment, totals.total);
			totals["empty%"]   = this.percent(totals.empty,   totals.total);
			totals["mixed%"]   = this.percent(totals.mixed,   totals.total);
			totals["source%"]  = this.percent(totals.source,  totals.total);
			
			return totals;
		})
	},
	
	helpers:
	{
		formatInteger: function(value, options)
		{
			return accounting.formatNumber( value() );
		},
		
		
		
		formatNumber: function()
		{
			var output = "";
			
			var options = arguments[arguments.length-1];
			
			// `{{formatNumber deep.nested.value}}`
			var deepestNestedValue = arguments[arguments.length-2];
			
			if (deepestNestedValue)
			{
				output = deepestNestedValue();
				
				// Renders ##.##
				if (output !== 0)
				{
					output = accounting.toFixed(output, 2);
				}
				// Renders 0
				else
				{
					output = output.toString();
				}
			}
			
			return output;
		},
	}
});
