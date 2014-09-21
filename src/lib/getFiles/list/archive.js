import util from "../util";

import globals from "lib/globals";

import zip from "zip";


zip.useWebWorkers = false;



function getEntries(archive, callback, close)
{
	zip.createReader(new zip.BlobReader(archive), function(zipReader)
	{
		zipReader.getEntries( function(entries)
		{
			if (close !== false)
			{
				zipReader.close();
				callback(null, entries);
			}
			else
			{
				callback(null, entries, zipReader);
			}
		});
	},
	callback);
}



function isArchive(inputFile, callback)
{
	var ext = util.extname( util.filename(inputFile.name) );
	
	return util.supportedExtension( ext, globals.attr("archiveExtensions") );
}



export default { getEntries, isArchive };