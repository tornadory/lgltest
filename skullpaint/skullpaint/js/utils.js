
		
	function RGBtoHex(R,G,B) {return toHex(R)+toHex(G)+toHex(B)}
	
	function toHex(N) {
	 if (N==null) return "00";
	 N=parseInt(N); if (N==0 || isNaN(N)) return "00";
	 N=Math.max(0,N); N=Math.min(N,255); N=Math.round(N);
	 return "0123456789ABCDEF".charAt((N-N%16)/16)
	      + "0123456789ABCDEF".charAt(N%16);
	}
	
	function getImageData( image ) {

	    var canvas = document.createElement( 'canvas' );
	    canvas.width = image.width;
	    canvas.height = image.height;

	    var context = canvas.getContext( '2d' );
	    context.drawImage( image, 0, 0 );

	    return context.getImageData( 0, 0, image.width, image.height );

	}

	function getPixel( imagedata, x, y ) {

	    var position = ( x + imagedata.width * y ) * 4, data = imagedata.data;
	    return { r: data[ position ], g: data[ position + 1 ], b: data[ position + 2 ], a: data[ position + 3 ] };

	}

	function lineInterpolate( point1, point2, distance )
	{
	  var xabs = Math.abs( point1.x - point2.x );
	  var yabs = Math.abs( point1.y - point2.y );
	  var xdiff = point2.x - point1.x;
	  var ydiff = point2.y - point1.y;

	  var length = Math.sqrt( ( Math.pow( xabs, 2 ) + Math.pow( yabs, 2 ) ) );
	  var steps = length / distance;
	  var xstep = xdiff / steps;
	  var ystep = ydiff / steps;

	  var newx = 0;
	  var newy = 0;
	  var result = new Array();

	  for( var s = 0; s < steps; s++ )
	  {
	    newx = point1.x + ( xstep * s );
	    newy = point1.y + ( ystep * s );

	    result.push( {
	      x: newx,
	      y: newy
	    } );
	  }

	  return result;
	}
	
	function disableSelection(target)
	{
	    if (typeof target.onselectstart!="undefined") //IE route
	        target.onselectstart=function(){return false}

	    else if (typeof target.style.MozUserSelect!="undefined") //Firefox route
	        target.style.MozUserSelect="none"

	    else //All other route (ie: Opera)
	        target.onmousedown=function(){return false}

	    target.style.cursor = "default"
	}

function getParameterByName(name)
{
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.href);
  if(results == null)
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}