function linearTween(t, b, c, d)
{
	return c*t/d + b;
}



function resizeWindow(endWidth, endHeight, duration, callback)
{
	var startWidth  = window.outerWidth;
	var startHeight = window.outerHeight;
	var startX = window.screenX;
	var startY = window.screenY;
	
	var widthChange = endWidth - startWidth;
	var heightChange = endHeight - startHeight;
	
	var endX = startX - Math.round(widthChange/2);
	var endY = startY - Math.round(heightChange/2);
	
	var lastWidth=startWidth, lastHeight=startHeight, lastX=startX, lastY=startY;
	
	var startTime = null;
	
	function step(timestamp)
	{
		if (startTime==null) startTime = timestamp;
		
		// Avoid tween over-calculation if duration has been exceeded (very possible)
		var curTime = Math.min( timestamp-startTime, duration );
		
		var newWidth  = Math.round( linearTween(curTime, startWidth,  widthChange,  duration) );
		var newHeight = Math.round( linearTween(curTime, startHeight, heightChange, duration) );
		var newX = Math.round( linearTween(curTime, startX, endX-startX, duration) );
		var newY = Math.round( linearTween(curTime, startY, endY-startY, duration) );
		
		// moveTo must come first to avoid performance issues
		window.moveTo(newX, newY);
		window.resizeTo(newWidth, newHeight);
		
		//console.log(newWidth+"x"+newHeight, newX+","+newY, curTime);
		
		if (curTime == duration)
		{
			if (callback) callback();
		}
		else
		{
			requestAnimationFrame(step);
		}
	}
	
	requestAnimationFrame(step);
}



export default resizeWindow;
