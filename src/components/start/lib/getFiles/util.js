function extname(file, toLowerCase)
{
	var ext = /(?:\.([^.]+))?$/.exec(file)[1];
	
	if (ext && ext.toLowerCase) ext = ext.toLowerCase();
	else ext = "";
	
	return ext;
}



function filename(file)
{
	return file.replace(/^.*(\\|\/|\:)/, "");
}



function supportedExtension(ext, extensions)
{
	if (ext.indexOf(".")==0) ext = ext.substr(1);
	ext = ext.toLowerCase();
	
	var supported = false;
	
	extensions.each( function(extension)
	{
		if (extension.toLowerCase() == ext)
		{
			supported = true;
			return false;
		}
	});
	
	return supported;
}



export default { extname, filename, supportedExtension };
