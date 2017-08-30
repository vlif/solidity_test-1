//npm install request
//url encode: loc:key  dat:contract address(get from swarm)

//get data from swarm
module.exports = {
								//encode
	//cut data and store in qrcode and swarm
	//position :28
	//cutlength:32
	//and upload
	//test2.json is the file cut to upload
	cutjson:function(){
		var fs = require('fs');
		var cmd = require('node-cmd');
		var CIPHER = require("crypto-xor");
		var key = "I AM KEY";			//config encode loc
		var metakey = "nchc";			//config encode name,timestamp,diploma name
		fs.readFile('./tmp/test.json','utf-8', (err, data) => {
	          if (err) throw err;
	          var json = JSON.parse(data);
	          var position =28;		//config
	          var length=32;		//config
	          var cut = json.cert.slice(position, position+length);
	          json.cert = [json.cert.slice(0, position), json.cert.slice(position+length)].join('');
	          console.log(cut);
	      	 
	      	  /* cut data encode */
	          var cutkey = json.address;
	          var enccut = CIPHER.encode(cut,cutkey);
	          var deccut = CIPHER.decode(enccut,cutkey);
	          console.log("cut:",cut);
	          console.log("enccut:",enccut);
	          console.log("deccut:",deccut);
	          /* cut data finish encode */

	          /* encrypt metadata:name,timestamp */
	           metakey += json.address.toString();
	          console.log("metakey = ",metakey);
	          json.name = CIPHER.encode(json.name,metakey);
	          json.uploadt = CIPHER.encode(json.uploadt,metakey);
	          json.diploma = CIPHER.encode(json.diploma,metakey);
	          console.log("encrypt name :",json.name);
	          /* encrypt finish */
	          
	          // console.log(json.cert.slice(0,40));
			fs.writeFile("./tmp/testtmp.json",JSON.stringify(json), function(err) {			//save json data into test2.json
				if(err) {
				   return console.log(err);
				}
				console.log("The file was saved!");
			}); 

			var upload = "$GOPATH/bin/swarm up ";
			upload += "./tmp/testtmp.json";				//where store json file(tmp file)

			var url = "qrcode \"localhost:3000/verify?loc="
			cmd.get(
				upload,											//cmd to upload file
					function(err,data,stderr){
					console.log("upload hash :",data);
					// url = url+data+"\" a.jpg";				//command line : qrcode url store to jpg
					var encdata = CIPHER.encode(data,key);		//data:location
					// console.log("data=",data);
					var decdata=CIPHER.decode(encdata,key)
					// console.log("decdata=",decdata);
					url =url+encdata+"&dat="+enccut+"\" ./public/images/a.jpg";	//store qrcode jpg(a.jpg) in ./tmp
					console.log(url);
					cmd.get(
						url,
						function(err,data,stderr){
							console.log("qrcode : ",data);
							var deletejson = "rm -f ./tmp/testtmp.json";
							console.log(deletejson);
							cmd.get(
								deletejson,
								function(err,data,stderr){
									console.log("tmpjson file delete");
								});
						});
				});
	 	});
	}
}
