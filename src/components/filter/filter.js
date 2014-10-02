import can from "can";
import template from "./filter.stache!";
import "./filter.less!";

import "can/map/backup/backup";

import globals from "lib/globals";

import filesize from "filesize";
import moment from "moment";



export default can.Component.extend(
{
	tag: "page-filter",
	template: template,
	
	init: function(element)
	{
		var extensions = [];
		
		globals.sourceExtensions.forEach( function(sourceExtension)
		{
			extensions.push({ extension:sourceExtension, selected:true });
		});
		
		can.batch.start();
		this.scope.attr("extensions", extensions);
		this.scope.filter();
		can.batch.stop();
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
			this.attr("extensions").restore(true);
			this.attr("edit", false);
			can.batch.stop();
		},
		
		
		
		filter: function()
		{
			var filteredFiles = [];
			
			this.attr("files").forEach( function(file)
			{
				this.attr("extensions").each( function(extension)
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
			this.attr("filteredFiles", filteredFiles);
		},
		
		
		
		numExtensionsSelected: can.compute( function()
		{
			var count = 0;
			
			this.attr("extensions").forEach( function(extension)
			{
				if ( extension.attr("selected") ) count++;
			});
			
			return count;
		}),
		
		
		
		open: function()
		{
			can.batch.start();
			this.attr("extensions").backup();
			this.attr("edit", true);
			can.batch.stop();
		},
		
		
		
		report: function()
		{
			this.attr("states").attr("filtered", true);
		},
		
		
		
		update: function()
		{
			can.batch.start();
			
			this.attr("edit", false);
			
			if ( this.attr("extensions").isDirty() )
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
			
			var size = filesize(bytes, {output:Object, round:2, suffixes:{kB:"KB"}});
			var unitLong = units[size.suffix];
			var unitShort = size.suffix;
			var value = parseFloat(size.value);
			
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
