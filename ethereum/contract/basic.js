//no xor just hash for testing
const fs = require('fs');
var bignum = require('bignum');
var keccak256 = require('js-sha3').keccak256;
var rightpad = require('right-pad');
var CryptoJS = require('crypto-js');
var sha3 = require('crypto-js/sha3');
var Web3 = require('web3');
//bignum to xor json file : 155kb about 1 min


//config use hex.js calculate binum(nchc^conaddr)
var abi=[{"constant":false,"inputs":[],"name":"getint","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"i","type":"uint256"}],"name":"setint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]
var contractAddress = "0xc8e2dd5e0c6d80811f61102d318d5499c48b0238"

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
MyContract.setint.sendTransaction(5,{from:address,gas:100000});
var result = MyContract.getint.call();
console.log("result=",result);
// fs.readFile('./test.json','utf-8', (err, data) => {
//           if (err) throw err;
//            // console.log(data);
//              var str = data;
//           // console.log(str);
            
//             var len = str.length;           //cut json
//             // console.log(len);
//             var array = new Array()         
//             var i ;
//             for(i = 0; i+32 < len ; i +=32)
//             {
//                 var tmp=(str.slice(i,i+32));
//                 // console.log(tmp);
//                 array.push(tmp);
//                // console.log(MyContract.getjson.call());
//                  if((i+32)%32000 == 0)               //config how much item to cut 
//                  {
//                     //  if((i+32)/32000 == 4)
//                     // console.log(JSON.stringify(array));
//                     MyContract.setjson.sendTransaction(array,{gas: 100000000,from: address});
//                     array = [];
//                  }
//             }
//             var tmp=str.slice(i,len);
//             array.push(tmp);

//                     MyContract.setjson.sendTransaction(array);
//             var result = MyContract.getjson.call();
//             console.log("result hash :",result);
//             // hashjson(array);
//             // console.log(array.length);
//             // console.log(JSON.stringify(array));
// });