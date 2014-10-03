import can from "can";
import template from "./filter.stache!";
import "./filter.less!";

import "can/map/backup/backup";

import filesize from "filesize";
import moment from "moment";



export default can.Component.extend(
{
	tag: "app-filter",
	template: template,
	
	init: function(element)
	{
		// On first run, have no filter
		if ( !this.scope.attr("globals.extensions.codeFiltered.length") )
		{
			var extensions = [];
			
			this.scope.attr("globals.extensions.code").forEach( function(codeExtension)
			{
				extensions.push({ extension:codeExtension, selected:true });
			});
			
			can.batch.start();
			this.scope.attr("globals.extensions").attr("codeFiltered", extensions);
			this.scope.filter();
			can.batch.stop();
		}
		// Second+ run, use previous filter
		else
		{
			this.scope.filter();
		}
	},
	
	scope:
	{
		edit: false,
		extensions: [],
		
		columns:
		[
			{ sorting:false, key:"path", name:"File Name" },
			{ sorting:false, key:"size", name:"Size" },
			{ sorting:false, key:"lastModifiedDate", name:"Modified" }
		],
		
		
		
		cancel: function()
		{
			can.batch.start();
			this.attr("globals.extensions.codeFiltered").restore(true);
			this.attr("edit", false);
			can.batch.stop();
		},
		
		
		
		filter: function()
		{
			var filteredFiles = [];
			
			this.attr("globals.files.all").forEach( function(file)
			{
				this.attr("globals.extensions.codeFiltered").each( function(extension)
				{
					if (extension.selected && file.extension==extension.extension)
					{
						filteredFiles.push(file);
						return false;
					}
				});
			}, this);
			
			// TODO :: try using can.List.prototype.filter
			// TODO :: or figure out if it's faster to first set to [] then push(file)
			this.attr("globals.files.filtered", filteredFiles);
		},
		
		
		
		numExtensionsSelected: can.compute( function()
		{
			var count = 0;
			
			this.attr("globals.extensions.codeFiltered").forEach( function(extension)
			{
				if ( extension.attr("selected") ) count++;
			});
			
			return count;
		}),
		
		
		
		open: function()
		{
			can.batch.start();
			this.attr("globals.extensions.codeFiltered").backup();
			this.attr("edit", true);
			can.batch.stop();
		},
		
		
		
		update: function()
		{
			can.batch.start();
			
			this.attr("edit", false);
			
			if ( this.attr("globals.extensions.codeFiltered").isDirty() )
			{
				this.filter();
			}
			
			can.batch.stop();
		}
	},
	
	helpers:
	{
		// {{formatDate 'unix offset, Date() instance, date string or timestamp' 'mm-dd-yy'}}
		formatDate: function(value, format, options)
		{
			if ( can.isFunction(value) ) value = value();
			
			value = moment(value);
			
			return (format == "iso") ? value.toISOString() : value.format(format);
		},
		
		
		
		// {{#formatFileSize size}} {{value}} {{unitShort}} {{/formatFileSize}}
		formatFileSize: function(bytes, options)
		{
			if ( can.isFunction(bytes) ) bytes = bytes();
			var size = filesize(bytes, {suffixes:{kB:"KB"}});
			var space = size.indexOf(" ");
			
			var units = {
				B: "Bytes",
				KB: "Kilobytes",
				MB: "Megabytes",
				GB: "Gigabytes",
				TB: "Terabytes",
				PB: "Petabytes",
				EB: "Exabytes",
				ZB: "Zettabytes",
				YB: "Yottabytes"
			};
			
			var value = parseFloat( size.substring(0,space) );
			var unitShort = size.substring(space+1);
			var unitLong = units[unitShort];
			
			switch (unitShort)
			{
				case "MB":
				{
					value = Math.round(value * 10) / 10;
					break;
				}
				case "KB":
				{
					value = Math.round(value);
					break;
				}
				case "B":
				{
					unitShort = "";
					break;
				}
			}
			
			return options.fn({ unitLong, unitShort, value });
		}
	}
});
