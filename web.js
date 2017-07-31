var http = require('http');
var fs = require('fs');

function notfind(response){
	response.writeHead(404,{"Content-Type" : "text/plain"});
	response.write("404 not found");
	response.end();
}

function onRequest(request,response){
	console.log("a user made request"+request.url);
	if(request.method == 'GET')
	{
		console.log("find");
		response.writeHead(200,{"Content-Type" : "text/html"});
		if(request.url == "/")
		{
			fs.createReadStream("./index.html").pipe(response);
				response.end();
		}
		else if(request.url == "/hello.html")
		{
			fs.createReadStream("./hello.html").pipe(response);
		}
	}
	else{
		console.log("not find");
		notfind(response);
	}
	//response.end();
}
http.createServer(onRequest).listen(8080);
console.log("server running");