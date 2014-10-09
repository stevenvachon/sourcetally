function extname(file, toLowerCase)
{
	var ext = /(?:\.([^.]+))?$/.exec(file)[1];
	
	ext = (ext && ext.toLowerCase) ? ext.toLowerCase() : "";
	
	return ext;
}



function filename(file)
{
	return file.replace(/^.*(\\|\/|\:)/, "");
}



function supportedExtension(ext, extensionsHash)
{
	if (ext.indexOf(".")==0) ext = ext.substring(1);
	ext = ext.toLowerCase();
	
	return !!extensionsHash[ext];
}



export default { extname, filename, supportedExtension };
