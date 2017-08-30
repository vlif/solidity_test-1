var fs = require('fs');

fs.readFile('./test2.json','utf-8', (err, data) => {
    if (err) throw err;
     // console.log(data);
    data = JSON.parse(data);
    var data_url = data.cert;
    // var data_url = req.body.file;
	var matches = data_url.match(/^data:.+\/(.+);base64,(.*)$/);
	var ext = matches[1];
	var base64_data = matches[2];
	var buffer = new Buffer(base64_data, 'base64');

	fs.writeFile('./1.pdf', buffer, function (err) {				//config created pdf file name : 1.pdf
		console.log("success convert base64 to 1.pdf");
	});
// console.log(decodedString);
});