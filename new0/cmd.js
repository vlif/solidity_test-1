//nodejs cmd to upload file to swarm and create qrcode
var cmd = require('node-cmd');
var upload = "$GOPATH/bin/swarm up ";
upload += "../contract/test1.json";

var url = "qrcode \"localhost:8500/bzz:/"
cmd.get(
	upload,
	function(err,data,stderr){
			console.log("upload hash :",data);
			url = url+data+"\" a.jpg";
			
			cmd.get(
				url,
				function(err,data,stderr){
					console.log("qrcode : ",data);
				});
	});
