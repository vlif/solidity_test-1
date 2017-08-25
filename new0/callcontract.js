var abi = [{"constant":false,"inputs":[],"name":"getjson","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"a","type":"bytes32"}],"name":"hello","type":"event"}];
		var contractAddress = "0xe86838554a622d66845fc3008bb6c86a40ae4d04"
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
var result = MyContract.getjson.call();
console.log("result:",result);