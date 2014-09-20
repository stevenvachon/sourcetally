import util from "../util";

import globals from "lib/globals";

var fs;
var path;
var walk;

if ( !globals.attr("web") )
{
	fs   = window.requireNode("fs");
	path = window.requireNode("path");
	walk = window.requireNode("walk").walk;
}



function expanddir(dir, callback)
{
	var expandedFiles = [];
	
	walk(dir.path)
		.on("file", function(root, stats, next)
		{
			var file = root+"/"+stats.name;
			
			if ( supportedExtension(file) )
			{
				expandedFiles.push({ path:file, stats:stats });
			}
			
			next();
		})
		/*.on("errors", function(root, statsArray, next)
		{
			console.log("errors");
			next();
		})*/
		.on("end", function()
		{
			callback(null, expandedFiles);
		})
	;
}



function expandDirs(files, callback)
{
	function doneCheck()
	{
		if (count>=files.length && callback)
		{
			callback( null, mergeAdditions(additions,files) );
		}
	}
	
	var additions = [];
	var count = 0;
	
	files.forEach( function(file, i, array)
	{
		fs.stat(file.path, function(statError, stats)
		{
			if (statError)
			{
				// Mark for removal
				files[i] = false;
				
				count++;
				doneCheck();
			}
			else if ( !stats.isDirectory() )
			{
				// For later
				file.stats = stats;
				
				count++;
				doneCheck();
			}
			else
			{
				expanddir(file, function(error, expandedFiles)
				{
					count++;
					
					// Mark for removal
					files[i] = false;
					
					if (!error && expandedFiles.length)
					{
						// For mergeAdditions()
						additions.push({ files:expandedFiles, index:i });
					}
					
					doneCheck();
				});
			}
		});
	});
}



function mergeAdditions(additions, files)
{
	var additionsIndex = 0;
	var additionOffset = 0;
	var removalOffset = 0;
	
	// Each file
	for (var i=0, numFiles=files.length; i<numFiles; i++)
	{
		var currentAddition = additionsIndex<additions.length ? additions[additionsIndex] : false;
		var offset = additionOffset - removalOffset;
		
		// If any additions
		if (currentAddition)
		{
			// If files to add to this index
			if (i == currentAddition.index)
			{
				var spliceArgs = [i+offset, 1];
				Array.prototype.push.apply(spliceArgs, currentAddition.files);
				
				Array.prototype.splice.apply(files, spliceArgs);
				
				additionOffset += currentAddition.files.length;
				additionsIndex++;
			}
		}
		
		// If marked for removal
		if ( !files[i+offset] )
		{
			files.splice(i+offset, 1);
			removalOffset++;
		}
	}
	
	return files;
}



function supportedExtension(file)
{
	return util.supportedExtension( path.extname(file), globals.attr("sourceExtensions") );
}



export default { expandDirs };
