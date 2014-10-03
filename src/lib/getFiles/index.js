import _contents from "./contents";
import _list from "./list/index";



function list(event, callback)
{
	// Break out of jQuery's event
	event = event.originalEvent ? event.originalEvent : event;
	
	var inputFiles;
	
	// Paste
	/*if (event.clipboardData)
	{
		inputFiles = event.cliboardData.items;
	}
	// Drag & drop
	else*/ if (event.dataTransfer)
	{
		/*if (event.dataTransfer.items)
		{
			Array.prototype.forEach.apply(event.dataTransfer.items, [function(item)
			{
				inputFiles.push( item.getAsFile() );
			}]);
		}
		else
		{*/
			inputFiles = event.dataTransfer.files;
		//}
	}
	// `<input type="file"/>`
	else if (event.srcElement.files)
	{
		inputFiles = event.srcElement.files;
	}
	
	if (inputFiles)
	{
		_list(inputFiles, callback);
	}
	else
	{
		callback([]);
	}
}



export default { contents:_contents, list };