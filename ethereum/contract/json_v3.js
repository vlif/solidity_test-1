const fs = require('fs');
var bignum = require('bignum');
var keccak256 = require('js-sha3').keccak256;

//bignum to xor json file : 155kb about 1 min
function d2h(d) {return d.toString(16);}
function h2d(s) {

    function add(x, y) {
        var c = 0, r = [];
        var x = x.split('').map(Number);
        var y = y.split('').map(Number);
        while(x.length || y.length) {
            var s = (x.pop() || 0) + (y.pop() || 0) + c;
            r.unshift(s < 10 ? s : s - 10); 
            c = s < 10 ? 0 : 1;
        }
        if(c) r.unshift(c);
        return r.join('');
    }

    var dec = '0';
    s.split('').forEach(function(chr) {
        var n = parseInt(chr, 16);
        for(var t = 8; t; t >>= 1) {
            dec = add(dec, dec);
            if(n & t) dec = add(dec, '1');
        }
    });
    return dec;
}
function stringToHex (tmp) {
	var str = '',i = 0,tmp_len = tmp.length,c;	 
	for (; i < tmp_len; i += 1) {
        	c = tmp.charCodeAt(i);
	        str += d2h(c);
	}
   return str;
}
//config use hex.js calculate binum(nchc^conaddr)
var bighash = bignum("21310093456092736124621884121797009578577705822150884401635626515301414610709",base=10);
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
				var tmp=xorjson(str.slice(i,i+32));
				console.log(xorjson(str.slice(i,i+32)));
				array.push("0x"+tmp);
				if((i+32)%32000 == 0)				//config how much item to cut 
				{
					if((i+32)/32000 == 1)
					//console.log(JSON.stringify(array));
					array = [];
				}
				//var test = encryptDecrypt(array[i/32]);
				//console.log(test);
			}
			var tmp=xorjson(str.slice(i,len));
			array.push("0x"+tmp);
			//console.log(array.length);
			console.log(JSON.stringify(array));
});
//hash jsonfile (sha3(nchc)^json(bytes32)^conaddr)
//bighash:global variable(binum(sha3(nchc)^conaddr))
function xorjson(str){
   var tmp = stringToHex(str);
   tmp = "0x"+tmp;
   var dectmp = h2d(tmp);
   var bigtmp = bignum(dectmp,base=10);
   var ans = bighash.xor(bigtmp);
   return (ans.toString(16));
}