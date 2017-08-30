//nodejs cmd to upload file to swarm and create qrcode
module.exports = {
uploadjson:function(str){
	var cmd = require('node-cmd');
	var upload = "$GOPATH/bin/swarm up ";
	upload += "../contract/test2.json";				//where store json file

	var url = "qrcode \"localhost:8500/bzz:/"
	cmd.get(
		upload,											//cmd to upload file
		function(err,data,stderr){
				console.log("upload hash :",data);
				url = url+data+"\" a.jpg";				//command line : qrcode url store to jpg
				
				cmd.get(
					url,
					function(err,data,stderr){
						console.log("qrcode : ",data);
					});
		});
	}
}