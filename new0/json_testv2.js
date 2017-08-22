const fs = require('fs');
var bignum = require('bignum');
var keccak256 = require('js-sha3').keccak256;
var rightpad = require('right-pad');
var CryptoJS = require('crypto-js');
var sha3 = require('crypto-js/sha3');
//bignum to xor json file : 155kb about 1 min
//xorjson,hashjson finish and correct and fast enough
//xorjson 程式碼在切的裡面（因沒有return） 使用時要刪掉
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
var bighash = bignum("21310093456092736124621884121986795952018044429052014708922011331559923414470",base=10);
fs.readFile('./test.json','utf-8', (err, data) => {
          if (err) throw err;
           // console.log(data);
            var str = JSON.stringify(data);
        //  console.log(str);
            var sha3 = keccak256(str);
            
            var len = str.length;           //cut json
            console.log(len);
            var array = new Array()         
            var i ;
            for(i = 0; i+32 < len ; i +=32)
            {
                var tmp=(str.slice(i,i+32));
                var heximas = stringToHex(tmp);                     //config str
                heximas = rightpad(heximas,64,'0');                 //padding to bytes32
                var imas = h2d(heximas);
                var bigimas = bignum(imas,base=10);
                var ans = bigimas.xor(bighash);
                var result ="0x"+ans.toString(16);
                // console.log(result);
                array.push(result);
                 if((i+32)%16000 == 0)               //config how much item to cut 
                 {
                     if((i+32)/16000 == 2)           //bytes32 have 66 char a time would overflow
                     {                               //so only 500 element can handle in one time
                        console.log(JSON.stringify(array));
                    }
                    array = [];

                 }
            }

            var tmp=str.slice(i,len);
            var heximas = stringToHex(tmp);                     //config str
                heximas = rightpad(heximas,64,'0');                 //padding to bytes32
                var imas = h2d(heximas);
                var bigimas = bignum(imas,base=10);
                var ans = bigimas.xor(bighash);
                var result = "0x"+ans.toString(16);
            array.push(result);
            // hashjson(array);
            //console.log(array.length);
            // console.log(JSON.stringify(array));
});
//hash jsonfile (sha3(nchc)^json(bytes32)^conaddr)
//bighash:global variable(binum(sha3(nchc)^conaddr))

//很多小塊
function hashjson(str){
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
}
function xorjson(){
    var bighash = bignum("21310093456092736124621884121791430080530020416058069893383574830076352292963",base=10);
    var heximas = stringToHex("\"{\\\"version\\\":\\\"1.0.0\\\",\\\"addres");            //config str
    // console.log(heximas);
    heximas = rightpad(heximas,64,'0');                 //padding to bytes32
    console.log(heximas);
    var imas = h2d(heximas);
    var bigimas = bignum(imas,base=10);
    var ans = bigimas.xor(bighash);
    var result = ans.toString(16);
    console.log("0x"+result);
}