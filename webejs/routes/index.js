var express = require('express');
var request = require("request");
var rightpad = require('right-pad');
var CryptoJS = require('crypto-js');
var sha3 = require('crypto-js/sha3');
var callcontract = require("../callcontract.js");
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' })
});

router.get('/fail',function(req,res,next){
	res.render('fail');
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
	var data = req.query.dat;
	var url = "http://localhost:8500/bzz:/"
	url += req.query.loc;
	console.log("url: ",url);
	
	var jsonfile;
	request({
		url: url,
		json: true
	}, function (error, response, body) {
				
		if (!error && response.statusCode === 200) {
			// console.log(body);
	    	 var position=28;							//position 29
	    	 body.cert = [body.cert.slice(0, position), data, body.cert.slice(position)].join('');
              var array = new Array()         
              var i ;
	    	  var str = JSON.stringify(body);
	    	  body = JSON.parse(str);
	    	  str = JSON.stringify(body);
	    	
	    	var len = str.length;
	    	for(i = 0; i+32 < len ; i +=32){
               array.push(str.slice(i,i+32));
            }
            array.push(str.slice(i,len));
            
            // conaddr = body.address;		//contract address
            var Contract = callcontract.getContract();		//call contract
            var cmp2 = Contract.getjson.call();
            console.log("success");

            hashjson(array,function(cmp1){
            cmp1 = "0x"+cmp1;					//cmp2 : smart contract
            console.log("cmp1 :",cmp1);			//cmp1 : qrcode
            	if(cmp1 == cmp2){
            		res.render('verify');
            	}
            	else{
            		res.render('fail',{reason:"data incorrect"});
            	}
            });
	    }
	    else{						  //qrcode not found
	    	res.render('fail',{reason:"qrcode not found"});
	    }
	})
});

router.get('/verified',function(req,res,next){
	res.render('verify');
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
    console.log(ans);
	callback(ans);
};

module.exports = router;
