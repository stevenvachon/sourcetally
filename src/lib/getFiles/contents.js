import globals from "lib/globals";

import zip from "zip";
import "zip/inflate";

var fs;

if ( !globals.attr("env.web") )
{
	fs = window.requireNode("fs");
}


zip.useWebWorkers = false;



function contents(files, callback)
{
	var count = 0;
	
	files.forEach( function(file, i)
	{
		if ( !file.attr("excluded") && !file.attr("error") )
		{
			if ( file.attr("archive") )
			{
				// TODO :: for safety, find way to work with file.attr("data") statically without can.Map wrapping
				file.data.getData(new zip.TextWriter(), function(data)
				{
					callback(null, data, i);
					
					if ( ++count >= files.attr("length") )
					{
						// TODO :: don't store reader on file
						// can't store on `files` as it gets removed once turned into a can.List
						file.attr("reader").close();
						
						// TODO :: figure out why getData() still works even after running close()
					}
				},
				function(){});	// Progress callback.. errors without it
				
				// TODO :: figure out how to capture errors.. it's currently back in list/archive on the reader
			}
			else
			{
				fs.readFile( file.attr("path"), {encoding:"utf8"}, function(error, data)
				{
					callback(error, data, i);
				});
			}
		}
	});
}


// Don't remove just in case FileReader is ever needed
/*function read(files, callback)
{
	files.forEach( function(file, i)
	{
		var reader = new FileReader();
		
		reader.onload = function(event)
		{
			var newValue =
			{
				name: file.name,
				contents: event.target.result
			};
			
			if (file.path) newValue.path = file.path;
			
			files[i] = newValue;
			
			if (++count>=files.length && callback)
			{
				callback(files);
			}
			
			//reader.onload = null;
		};
		
		reader.readAsText(file);
	});
}*/



export default contents;
