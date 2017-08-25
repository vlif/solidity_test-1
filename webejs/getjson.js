//npm install request

//get data from swarm
var request = require("request");
var fs = require('fs');
function getjson(){
	var url = "http://localhost:8500/bzz:/bedda982589fbafc565e497d995c56a7a7a2cf7d3ca69bb5547f53c8e0b84215/"	
	request({
		url: url,
		json: true
	}, function (error, response, body) {
				
		if (!error && response.statusCode === 200) {
			console.log(body) // Print the json response
	    }
	})
}
//cut data and store in qrcode and swarm
//position :28
//cutlength:10
function cutjson(){
	fs.readFile('./test.json','utf-8', (err, data) => {
          if (err) throw err;
          var json = JSON.parse(data);
          var position =28;
          var length=10;
          var data = json.cert.slice(position, position+length);
          json.cert = [json.cert.slice(0, position), json.cert.slice(position+length)].join('');
          console.log(data);
          console.log(json.cert.slice(0,40));
 	});
}

cutjson();