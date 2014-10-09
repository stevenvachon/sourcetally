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
		this.scope.filter();
	},
	
	scope:
	{
		edit: false,
		
		columns:
		[
			{ sorting:false, key:"path", name:"File Name" },
			{ sorting:false, key:"size", name:"Size" },
			{ sorting:false, key:"lastModifiedDate", name:"Modified" }
		],
		
		
		
		allSelected: can.compute( function()
		{
			var _allSelected = true;
			
			this.attr("globals.extensions.code").each( function(extension)
			{
				if ( !extension.attr("selected") )
				{
					_allSelected = false;
					return false;
				}
			});
			
			return _allSelected;
		}),
		
		
		
		cancel: function()
		{
			can.batch.start();
			this.attr("globals.extensions.code").restore(true);
			this.attr("edit", false);
			can.batch.stop();
		},
		
		
		
		filter: function()
		{
			can.batch.start();
			
			var count = 0;
			
			this.attr("globals.files").forEach( function(file)
			{
				var extension = this.attr("globals.extensions.code").attr(file.extension);
				var included = (extension && extension.selected);
				
				file.attr("included", included);
				
				if (included) count++;
			}, this);
			
			this.attr("globals").attr("numFilesFiltered", count);
			
			can.batch.stop();
		},
		
		
		
		numExtensionsSelected: can.compute( function()
		{
			var count = 0;
			
			this.attr("globals.extensions.code").each( function(extension)
			{
				if ( extension.attr("selected") ) count++;
			});
			
			return count;
		}),
		
		
		
		open: function()
		{
			can.batch.start();
			this.attr("globals.extensions.code").backup();
			this.attr("edit", true);
			can.batch.stop();
		},
		
		
		
		toggleAll: function()
		{
			can.batch.start();
			
			var newValue = !this.attr("allSelected");
			
			this.attr("globals.extensions.code").each( function(extension)
			{
				extension.attr("selected", newValue);
			});
			
			can.batch.stop();
		},
		
		
		
		update: function()
		{
			can.batch.start();
			
			this.attr("edit", false);
			
			if ( this.attr("globals.extensions.code").isDirty(true) )
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
