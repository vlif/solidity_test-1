var tmpcon = "0x000000000000000000000000f2bd5de8b57ebfc45dcee97524a7a08fccc80aef"
var keccak256 = require('js-sha3').keccak256;
var sha3 = keccak256(str);
function encryptDecrypt(input) {
	var key = ['K', 'C', 'Q']; //Can be any chars, and any size array
	var output = [];
	
	for (var i = 0; i < 32; i++) {
		var charCode = input.charCodeAt(i) ^ key[i % key.length].charCodeAt(0);
		output.push(String.fromCharCode(charCode));
	}
	return output.join("");
}

var sha3nchc = keccak256("nchc");
var encrypted = encryptDecrypt("idolmaster");
console.log("Encrypted:"+encrypted);

var decrypted = encryptDecrypt(encrypted);
console.log("Decrypted:"+decrypted);
