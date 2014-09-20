/*function extract(archive, callback)
{
	zip.createReader(new zip.BlobReader(archive), function(zipReader)
	{
		var count = 0;
		var files = [];
		
		zipReader.getEntries( function(entries)
		{
			entries.forEach( function(entry, i)
			{
				entry.getData(new zip.TextWriter(), function(text)
				{
					files[i] =
					{
						name: "",
						path: entry.filename,
						contents: text
					};
					
					zipReader.close(function()
					{
						if (++count>=entries.length && callback)
						{
							callback(files);
						}
					});
				});
			});
		});
	},
	function(error){ alert(error) });
}*/



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