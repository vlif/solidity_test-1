const fs = require('fs');
//var bignum = require('bignum');
var keccak256 = require('js-sha3').keccak256;

//var sha3nchc = keccak256("nchc");
//var hexnchc = stringToHex(sha3nchc);						//config str
//var nchc = h2d(hexnchc);
//contract address only have 20 bytes padding to bytes32

//var tmpcon = "0x000000000000000000000000f2bd5de8b57ebfc45dcee97524a7a08fccc80aef";	//config contract address
//var conaddr = h2d(tmpcon);
//var bignchc = bignum(nchc,base=10);
//var bigcon = bignum(conaddr,base=10);
//var ans = bignchc.xor(bigcon);
fs.readFile('./test.json','utf-8', (err, data) => {
		  if (err) throw err;
		   // console.log(data);
			var str = JSON.stringify(data); 
		//	console.log(str);
			var sha3 = keccak256(str);
			
			console.log(sha3);				//sha json file

			var len = str.length;			//cut json
			console.log(len);
			var array = new Array()			
			var i ;
			for(i = 0; i+32 < len ; i +=32)
			{
				array.push(str.slice(i,i+32));
				if((i+32)%32000 == 0)				//config how much item to cut 
				{
					if((i+32)/32000 == 4)
					console.log(JSON.stringify(array));
					array = [];
				}
				//var test = encryptDecrypt(array[i/32]);
				//console.log(test);
			}
			array.push(str.slice(i,len));
			//console.log(array.length);
			//console.log(JSON.stringify(array));
});
function encryptDecrypt(input) {
	var key = ['K', 'C', 'Q']; //Can be any chars, and any size array
	var output = [];
	
	for (var i = 0; i < input.length; i++) {
		var charCode = input.charCodeAt(i) ^ key[i % key.length].charCodeAt(0);
		output.push(String.fromCharCode(charCode));
	}
	return output.join("");
}


/*var encrypted = encryptDecrypt("idolmasteridolmasteridolmasterid");
console.log("Encrypted:"+encrypted);
var decrypted = encryptDecrypt(encrypted);
console.log("Decrypted:"+decrypted);*/