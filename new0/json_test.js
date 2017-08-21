const fs = require('fs');
var bignum = require('bignum');
var keccak256 = require('js-sha3').keccak256;
var rightpad = require('right-pad');
var CryptoJS = require('crypto-js');
var sha3 = require('crypto-js/sha3');
//bignum to xor json file : 155kb about 1 min
var testhash="";
fs.readFile('./test.json','utf-8', (err, data) => {
          if (err) throw err;
           // console.log(data);
            var str = JSON.stringify(data);
        //  console.log(str);
            var sha3 = keccak256(str);
            
            console.log(sha3);              //sha json file

            var len = str.length;           //cut json
            console.log(len);
            var array = new Array()         
            var i ;
            for(i = 0; i+32 < len ; i +=32)
            {
                var tmp=(str.slice(i,i+32));
                // console.log(tmp);
                array.push(tmp);
                // if((i+32)%32000 == 0)               //config how much item to cut 
                // {
                //     if((i+32)/32000 == 1)
                //     console.log(JSON.stringify(array));
                //     array = [];
                // }
                //var test = encryptDecrypt(array[i/32]);
                //console.log(test);
            }
            var tmp=str.slice(i,len);
            array.push(tmp);
            hashjson(array);
            //console.log(array.length);
            // console.log(JSON.stringify(array));
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

//很多小塊
function hashjson(str){
    var tmp="";
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