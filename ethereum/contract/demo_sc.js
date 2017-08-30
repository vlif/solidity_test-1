//no xor just hash for testing
const fs = require('fs');
var bignum = require('bignum');
var keccak256 = require('js-sha3').keccak256;
var rightpad = require('right-pad');
var CryptoJS = require('crypto-js');
var sha3 = require('crypto-js/sha3');
var Web3 = require('web3');
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
var abi = [{"constant":false,"inputs":[],"name":"getjson","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"a","type":"bytes32[]"}],"name":"setjson","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];
var contractAddress = "0x9e17cd931c09f88dc09ddbdf26cd926623266740"

const ethereumUri = 'http://localhost:8545';
const address = "0xf5a520e0e2122bc309d42b7e2b25e6597b2187df";

let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(ethereumUri));

if(!web3.isConnected()){
    throw new Error('unable to connect to ethereum node at ' + ethereumUri);
}else{
    console.log('connected to ethereum node at ' + ethereumUri);
    let coinbase = web3.eth.coinbase;
    console.log('coinbase:' + coinbase);
    let balance = web3.eth.getBalance(coinbase);
    console.log('balance:' + web3.fromWei(balance, 'ether') + " ETH");
    let accounts = web3.eth.accounts;
    console.log(accounts);
    if (web3.personal.unlockAccount(address, '')) {
        console.log(`${address} is unlocked`);
    }else{
        console.log(`unlock failed, ${address}`);
    }
}
var MyContract = web3.eth.contract(abi).at(contractAddress);
console.log("finish contract")

fs.readFile('./test.json','utf-8', (err, data) => {
          if (err) throw err;
           // console.log(data);
             var str = data;
          // console.log(str);
            
            var len = str.length;           //cut json
            // console.log(len);
            var array = new Array()         
            var i ;
            for(i = 0; i+32 < len ; i +=32)
            {
                var tmp=(str.slice(i,i+32));
                // console.log(tmp);
                array.push(tmp);
               // console.log(MyContract.getjson.call());
                 if((i+32)%32000 == 0)               //config how much item to cut 
                 {
                    //  if((i+32)/32000 == 4)
                    // console.log(JSON.stringify(array));
                    MyContract.setjson.sendTransaction(array,{gas: 100000000,from: address});
                    array = [];
                 }
            }
            var tmp=str.slice(i,len);
            array.push(tmp);

                    MyContract.setjson.sendTransaction(array);
            var result = MyContract.getjson.call();
            console.log("result hash :",result);
            // hashjson(array);
            // console.log(array.length);
            // console.log(JSON.stringify(array));
});
//hash jsonfile (sha3(nchc)^json(bytes32)^conaddr)
//bighash:global variable(binum(sha3(nchc)^conaddr))
function xorjson(str){
    var bighash = bignum("21310093456092736124621884121791430080530020416058069893383574830076352292963",base=10);
    var heximas = stringToHex(str);                     //config str
    heximas = rightpad(heximas,64,'0');                 //padding to bytes32
    var imas = h2d(heximas);
    var bigimas = bignum(imas,base=10);
    var ans = bigimas.xor(bighash);
    var result = ans.toString(16);
    // console.log("0x"+result);
}

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
