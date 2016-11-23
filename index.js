var http = require('http'),
	Stream = require('stream').Transform,
	fs = require('fs');
	fetch = require('node-fetch');

var Canvas = require('canvas')
	, Image = Canvas.Image

var size = 256;
var sx = 151;
var sy = 351;
var w = 64;
var h = 64;
var baseUrl = 'https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i10!2i{{x}}!3i{{y}}!4i256!2m3!1e0!2sm!3i368044535!3m14!2sen-US!3sUS!5e18!12m1!1e47!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2zcy5lOmcuZnxwLmM6I2ZmMDAwMDAwLHMuZTpsfHAudjpvZmYscy50OjF8cy5lOmx8cC52Om9mZixzLnQ6MTd8cC52Om9mZixzLnQ6MTl8cC52Om9mZixzLnQ6MjB8cy5lOmwudC5mfHAuYzojZmYwMDAwMDAscy50OjIwfHMuZTpsLnQuc3xwLnY6b2ZmLHMudDo1fHMuZTpsfHAudjpvZmYscy50OjgxfHMuZTpnLmZ8cC52Om9mZnxwLmM6I2ZmZmZmZmZmfHAudzowLjEscy50OjgxfHMuZTpnLnN8cC52OnNpbXBsaWZpZWR8cC5jOiNmZjAwMDAwMCxzLnQ6ODF8cy5lOmx8cC52Om9mZixzLnQ6ODJ8cy5lOmcuZnxwLmM6I2ZmMDAwMDAwLHMudDoyfHMuZTpnLnN8cC52Om9mZixzLnQ6MnxzLmU6bC50fHAudjpvbnxwLmM6I2ZmZmZmZmZmLHMudDoyfHMuZTpsLnQuc3xwLnY6b2ZmLHMudDozM3xwLnY6b2ZmLHMudDozNHxwLnY6b2ZmLHMudDozNnxwLnY6b2ZmLHMudDo0MHxwLnY6b2ZmfHAuYzojZmY1YzVjNWMscy50OjM1fHAudjpvZmYscy50OjM5fHAudjpvZmYscy50OjN8cy5lOmx8cC52Om9mZixzLnQ6M3xzLmU6bC5pfHAudjpvZmYscy50OjQ5fHAuYzojZmZmZmZmZmZ8cC53OjAuNzkscy50OjQ5fHMuZTpnLnN8cC52Om9mZixzLnQ6NDl8cy5lOmwuaXxwLnY6b2ZmLHMudDo1MHxzLmU6Zy5zfHAuYzojZmZmZmZmZmZ8cC53OjAuMSxzLnQ6NTB8cy5lOmwudC5mfHAuYzojZmYwMDAwMDAscy50OjUwfHMuZTpsLnQuc3xwLnY6b2ZmfHAudzowLjEscy50OjUxfHMuZTpnfHAudzowLjg1LHMudDo1MXxzLmU6Zy5zfHAudjpvZmZ8cC53OjAuMSxzLnQ6NTF8cy5lOmwudHxwLmM6I2ZmZmZmZmZmfHAudzowLjEscy50OjR8cy5lOmx8cC52Om9mZixzLnQ6NjV8cC52Om9mZixzLnQ6NjV8cy5lOmx8cC52Om9mZixzLnQ6NjZ8cy5lOmx8cC52Om9mZixzLnQ6NjZ8cy5lOmwudHxwLnY6b2ZmLHMudDo2NnxzLmU6bC50LnN8cC52Om9uLHMudDo2NnxzLmU6bC5pfHAudjpvbixzLnQ6NnxwLmM6I2ZmMDAwMDAwLHMudDo2fHMuZTpsfHAudjpvZmY!4e0&token=78506';
// var baseUrl = 'http://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i7!2i{{x}}!3i{{y}}!4i256!2m3!1e0!2sm!3i368044535!3m14!2sen-US!3sUS!5e18!12m1!1e47!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2zcy5lOmcuZnxwLmM6I2ZmMDAwMDAwLHMuZTpsfHAudjpvZmYscy50OjF8cy5lOmx8cC52Om9mZixzLnQ6MTd8cC52Om9mZixzLnQ6MTl8cC52Om9mZixzLnQ6MjB8cy5lOmwudC5mfHAuYzojZmYwMDAwMDAscy50OjIwfHMuZTpsLnQuc3xwLnY6b2ZmLHMudDo1fHMuZTpsfHAudjpvZmYscy50OjgxfHMuZTpnLmZ8cC52Om9mZnxwLmM6I2ZmZmZmZmZmfHAudzowLjEscy50OjgxfHMuZTpnLnN8cC52OnNpbXBsaWZpZWR8cC5jOiNmZjAwMDAwMCxzLnQ6ODF8cy5lOmx8cC52Om9mZixzLnQ6ODJ8cy5lOmcuZnxwLmM6I2ZmMDAwMDAwLHMudDoyfHMuZTpnLnN8cC52Om9mZixzLnQ6MnxzLmU6bC50fHAudjpvbnxwLmM6I2ZmZmZmZmZmLHMudDoyfHMuZTpsLnQuc3xwLnY6b2ZmLHMudDozM3xwLnY6b2ZmLHMudDozNHxwLnY6b2ZmLHMudDozNnxwLnY6b2ZmLHMudDo0MHxwLnY6b2ZmfHAuYzojZmY1YzVjNWMscy50OjM1fHAudjpvZmYscy50OjM5fHAudjpvZmYscy50OjN8cy5lOmx8cC52Om9mZixzLnQ6M3xzLmU6bC5pfHAudjpvZmYscy50OjQ5fHAuYzojZmZmZmZmZmZ8cC53OjAuNzkscy50OjQ5fHMuZTpnLnN8cC52Om9mZixzLnQ6NDl8cy5lOmwuaXxwLnY6b2ZmLHMudDo1MHxzLmU6Zy5zfHAuYzojZmZmZmZmZmZ8cC53OjAuMSxzLnQ6NTB8cy5lOmwudC5mfHAuYzojZmYwMDAwMDAscy50OjUwfHMuZTpsLnQuc3xwLnY6b2ZmfHAudzowLjEscy50OjUxfHMuZTpnfHAudzowLjg1LHMudDo1MXxzLmU6Zy5zfHAudjpvZmZ8cC53OjAuMSxzLnQ6NTF8cy5lOmwudHxwLmM6I2ZmZmZmZmZmfHAudzowLjEscy50OjR8cy5lOmx8cC52Om9mZixzLnQ6NjV8cC52Om9mZixzLnQ6NjV8cy5lOmx8cC52Om9mZixzLnQ6NjZ8cy5lOmx8cC52Om9mZixzLnQ6NjZ8cy5lOmwudHxwLnY6b2ZmLHMudDo2NnxzLmU6bC50LnN8cC52Om9uLHMudDo2NnxzLmU6bC5pfHAudjpvbixzLnQ6NnxwLmM6I2ZmMDAwMDAwLHMudD';

var complete = [];
for( var i = sx; i < sx + w; i++ )
{
	for( var j = sy; j < sy + h; j++ )
	{
		complete.push(
			download(baseUrl.replace('{{x}}', i).replace('{{y}}', j), './data/' + i + '_' + j + '.png')
		);
	}
}

Promise.all(complete).then(() =>
{
	console.log( 'downloaded all images' );

	var complete = [];
	var canvas = new Canvas( size * w, size * h );
	var ctx = canvas.getContext( '2d' );

	for( var i = sx; i < sx + w; i++ )
	{
		for( var j = sy; j < sy + h; j++ )
		{
			var prom = new Promise( function( x, y, resolve )
			{
				var url = `./data/${x}_${y}.png`;
				var img = new Canvas.Image;
				fs.readFile( url, function( err, imageData )
				{
					x -= sx;
					y -= sy;

					if( err )
					{
						reject();
					}
					else
					{
						img.src = imageData;
						ctx.drawImage( img, size * x, size * y, size, size );
						// ctx.font = '30px Impact';
						// ctx.rotate(.1);
						// ctx.fillText("Awesome!", size * x, size * y);
						resolve();
					}
				} );
			}.bind( this, i, j ) )
			complete.push( prom );
		}
	}

	return Promise.all( complete ).then( () => new Promise( ( resolve ) =>
	{
		var out = fs.createWriteStream( './combined.png' );
		var stream = canvas.pngStream();

		stream.on( 'data', function( chunk )
		{
			out.write( chunk );
		} );

		stream.on( 'end', function()
		{
			console.log('end');
			resolve();
		} );
	} ) )
}).then(() => {
	console.log('complete');
})


function download(uri, filename){
	if(fs.existsSync(filename))
	{
		console.log('exists', filename);
		return Promise.resolve(filename);
	}

	return fetch(uri, {
		method: 'GET',
		headers: {
			"Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
			"Accept-Encoding":"gzip, deflate, sdch",
			"Accept-Language":"en-US,en;q=0.8,nl;q=0.6",
			"Cache-Control":"no-cache",
			"Host":"maps.googleapis.com",
			"Pragma":"no-cache",
			"Proxy-Connection":"keep-alive",
			"Upgrade-Insecure-Requests":"1",
			"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36",
			"X-Client-Data":"CIq2yQEIpbbJAQjBtskBCKmdygE="
		}
	}).then(res => {
		return new Promise((resolve) => {
			var dest = fs.createWriteStream(filename);
			dest.on('end', function() {
				resolve(filename)
			});
			res.body.pipe(dest);
		})
	})

};