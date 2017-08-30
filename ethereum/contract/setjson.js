var abi =[{"constant":false,"inputs":[],"name":"getjson","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"a","type":"bytes32[]"}],"name":"setjson","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];
var contractAddress = "0x702c602434823c95267a9d0cbb052efd4c4bcd9d"
const fs = require('fs');
const Web3 = require('web3');

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
// var keccak256 = require('js-sha3').keccak256;

array = new Array()

fs.readFile('./test.json','utf-8', (err, data) => {
		  if (err) throw err;
		   // console.log(data);
			// var str = JSON.stringify(data); 
			// console.log(str);
			// var sha3 = keccak256(data);
			
			// console.log(sha3);				//sha json file

			var len = data.length();		//cut json
			// console.log(len);	
			// data1 = data.slice(0,4000)
			for(var i = 0; i+32 < len ; i += 32)
			{
				array.push(data.slice(i,i+32));
				//console.log(array[i/32]);
				//var test = encryptDecrypt(array[i/32]);
				//console.log(test);
			}
			array.push(data.slice(i,len));
			// console.log("array length = ",array.length);
			// console.log(JSON.stringify(array));


			var result = MyContract.setjson.call(array);
			console.log("result = ",result);
});