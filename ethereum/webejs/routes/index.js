var express = require('express');
var request = require("request");
var rightpad = require('right-pad');
var CryptoJS = require('crypto-js');
var sha3 = require('crypto-js/sha3');
var CIPHER = require('crypto-xor');
var fs = require('fs');
var formidable = require('formidable');
// var fileUpload = require('express-fileupload');
var callcontract = require("../callcontract.js");   // config: to call contract function and connect to geth
var getjson = require('../getjson.js')              //generate qrcode
var router = express.Router();

var key = "I AM KEY";           //config
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' })
// });
// router.use(fileUpload());

router.get('/load',function(req,res,next){
    res.render('load');
});

router.get('/fail',function(req,res,next){
	res.render('fail');
});
router.get('/qrcode',function(req,res,next){
    var pic = req.query.pic;
    console.log("pic=",pic);
    res.render('qrcode',{imgloc:pic});
});

router.get('/create',function(req,res,next){      //input metadata to generate json file
    res.render('create');
});
router.get('/upload',function(req,res,next){      //upload json file to put on swarm and generate qrcode
    res.render('upload');
});
router.post('/uploadjson',function(req,res){	  //upload page send file to here(post to get request)
    var form = new formidable.IncomingForm();
    //Formidable uploads to operating systems tmp dir by default
    form.uploadDir = "./";       //set upload directory
    form.keepExtensions = true;     //keep file extension

    form.parse(req, function(err, fields, files) {
        // console.log("form.bytesReceived");
        //TESTING
        console.log("file size: "+JSON.stringify(files.fileUploaded.size));     //only to know info about the json file
        console.log("file path: "+JSON.stringify(files.fileUploaded.path));
        console.log("file name: "+JSON.stringify(files.fileUploaded.name));
        console.log("file type: "+JSON.stringify(files.fileUploaded.type));
        // console.log("astModifiedDate: "+JSON.stringify(files.fileUploaded.lastModifiedDate));

        //Formidable changes the name of the uploaded file
        //Rename the file to its original name
        fs.rename(files.fileUploaded.path, './tmp/'+files.fileUploaded.name, function(err) {    //store json file(test.json)
                                                                                                // in ./tmp
        if (err)
            throw err;
          console.log('renamed complete');  
        });
        getjson.cutjson();
        res.redirect('/qrcode?pic='+'/images/a.jpg');
    });
    // console.log(req.files.jsonfile);
});
//qeury: loc(hash),dat(data)
//hex1.js hashjson
//file:test1.json
//loc:
//data:JVBERi0xLj
//upload json 組裝回去
//contract addr:0xe86838554a622d66845fc3008bb6c86a40ae4d04
router.get('/verify',function(req,res,next){
	// res.render('load');
	// var data = req.query.dat;
	var url = "http://localhost:8500/bzz:/"
    var decloc = CIPHER.decode(req.query.loc,key);      //loc: swarm hash
	// url += req.query.loc;
    url +=decloc;
	console.log("url: ",url);
	
	var jsonfile;
	request({
		url: url,
		json: true
	}, function (error, response, body) {
				
		if (!error && response.statusCode === 200) {
			// console.log(body);
            
            /* decrypt data */
            var cutkey = body.address;                  //contract address
            console.log("encdata=",req.query.dat);
            var data = CIPHER.decode(req.query.dat,cutkey);
            console.log("decdata=",data);
            /*decrypt finish */
            
            /*decrypt metadata */
            var metakey = "nchc";           //config encode name,timestamp,diploma name
            metakey+=body.address.toString();
            body.name = CIPHER.decode(body.name,metakey);
            body.uploadt = CIPHER.decode(body.uploadt,metakey);
            body.diploma = CIPHER.decode(body.diploma,metakey);
            /*decrypt finish*/

            /*convert json content to array to hash */
             var position=28;                           //position 29  recover pdf
	    	 body.cert = [body.cert.slice(0, position), data, body.cert.slice(position)].join('');   
              var array = new Array()         
              var i ;
	    	  var str = JSON.stringify(body);
	    	  var len = str.length;
	    	for(i = 0; i+32 < len ; i +=32){
               array.push(str.slice(i,i+32));
            }
            array.push(str.slice(i,len));
            /* finish putting content to array */

            // conaddr = body.address;		//contract address
            var Contract = callcontract.getContract();		//call contract
            var cmp2 = Contract.getjson.call();
            console.log("decrypt name",body.name);
            hashjson(array,function(cmp1){
            cmp1 = "0x"+cmp1;					//cmp2 : smart contract
            console.log("swarm hash :",cmp1);   //cmp1 : qrcode
            console.log("SC hash :",cmp2);
            	if(cmp1 == cmp2){
                // var pdf = new Buffer(body.cert, 'base64').toString('ascii');
                var data_url = body.cert;
            	var matches = data_url.match(/^data:.+\/(.+);base64,(.*)$/);
                var ext = matches[1];
                var base64_data = matches[2];
                var buffer = new Buffer(base64_data, 'base64');
                fs.writeFile('./public/images/1.pdf', buffer, function (err) {                //config created pdf file name : 1.pdf
                    console.log("success convert base64 to 1.pdf");
                });
                res.render('verify',{user:body.name,name:body.diploma,timestamp:body.uploadt,iurl:'/images/1.pdf'});
                // res.redirect('verify');
            	}
            	else{                          //hash value not equal
            		res.render('fail',{reason:"data incorrect"});
            	}
            });
	    }
	    else{						  //qrcode not found
	    	res.render('fail',{reason:"qrcode not found"});
	    }
	})     //request's parenthesis
});

hashjson = function(str,callback){
	var tmp="";      //initialize, data store in tmp
    for(var i =  0 ;i < str.length ; i++)
    {
        var buf = Buffer.from(str[i],'ascii');
        var value = "0x"+buf.toString('hex');
        value = rightpad(value,66,'0');         //padding to 32 bytes(配合solidity) solidity 會padding
        // console.log(value);                     //66: "0x"+bytes32

        if(value.substr(0, 2) === '0x'){        //web3.sha3 remove 0x and hash
            value = value.substr(2);
        }
        tmp+=value;
    }
    // console.log(tmp);
    value = CryptoJS.enc.Hex.parse(tmp);        //from github source code: how web3 sha3 implement
    var ans = sha3(value, {outputLength: 256}).toString();
    // console.log(ans);
	callback(ans);
};

module.exports = router;
