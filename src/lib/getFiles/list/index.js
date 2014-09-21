import archive from "./archive";
import fileSystem from "./fileSystem";
import util from "../util";

import globals from "lib/globals";



function filter(files)
{
	var filtered = [];
	
	files.forEach( function(file)
	{
		// If not empty (paranoid)
		if (file.path.length)
		{
			// If not root dir
			if (file.path!="/" && file.path!="\\")
			{
				// If not dir
				if (file.path.indexOf("/") != file.path.length && file.path.indexOf("\\") != file.path.length)
				{
					if ( util.supportedExtension( file.extension, globals.attr("sourceExtensions") ) )
					{
						filtered.push(file);
					}
				}
			}
		}
	});
	
	return filtered;
}



function list(inputFiles, callback)
{
	// Only one archive allowed
	if ( inputFiles.length===1 && archive.isArchive(inputFiles[0]) )
	{
		populateFromArchive(inputFiles[0], callback);
	}
	// Web cannot access path to file
	// Web cannot distinguish files from dirs
	else if ( !globals.attr("web") )
	{
		populateFromList(inputFiles, callback);
	}
	else
	{
		callback(null, []);
	}
}



function populateFromArchive(inputFile, callback)
{
	var files = [];
	
	// TODO :: fix for browser
	archive.getEntries(inputFile, function(error, entries, reader)
	{
		if (error)
		{
			callback(error);
		}
		else
		{
			entries.forEach( function(entry)
			{
				var name = util.filename(entry.filename);
				
				files.push(
				{
					extension: util.extname(name),
					lastModifiedDate: entry.lastModDate,
					name: name,
					path: entry.filename,
					size: entry.uncompressedSize,
					error: null,	// If file cannot be extracted, later
					
					data: entry,	// Removed later
					archive: true,	// Used later
					reader: reader	// Used later
				});
			});
		}
		
		callback( null, filter(files) );
	}, false);
}



function populateFromList(inputFiles, callback)
{
	var files = [];
	
	Array.prototype.forEach.apply(inputFiles, [function(inputFile)
	{
		// Not needed as web only accepts archives
		/*if ( globals.attr("web") )
		{
			var file =
			{
				extension: util.extname(inputFile.name),
				lastModifiedDate: inputFile.lastModifiedDate,
				name: inputFile.name,
				path: inputFile.name,	// `path` is restricted
				size: inputFile.size,
				error: null,	// If file not found, later
				data: inputFile	// Removed later
			};
		}
		else
		{*/
			// Other meta added when dirs are expanded
			var file = { path:inputFile.path };
		//}
		
		files.push(file);
	}]);
	
	if ( globals.attr("web") )
	{
		callback( null, filter(files) );
	}
	else
	{
		fileSystem.expandDirs(files, function(error, expandedFiles)
		{
			expandedFiles.forEach( function(file)
			{
				var name = util.filename(file.path);
				
				file.extension = util.extname(name);
				file.lastModifiedDate = file.stats.mtime;
				file.name = name;
				file.size = file.stats.size;
				file.error = null;	// If file not found, later
				
				delete file.stats;
			});
			
			callback( null, filter(expandedFiles) );
		});
	}
}



export default list;
