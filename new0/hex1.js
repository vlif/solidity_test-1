//npm install bignum
// every ans need to add "0x" at the beginning
// string can turn to hexstring by adding "0x" prefix
bignum = require('bignum');
keccak256 = require('js-sha3').keccak256;
var CryptoJS = require('crypto-js');
var sha3 = require('crypto-js/sha3');
var rightpad = require('right-pad');

function d2h(d) {return d.toString(16);}

function stringToHex (tmp) {
	var str = '',i = 0,tmp_len = tmp.length,c;	 
	for (; i < tmp_len; i += 1) {
        	c = tmp.charCodeAt(i);
	        str += d2h(c);
	}
   return str;
}
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

//first step: init relation: xor relate address 
//xor con,relate,sha3(nchc) user1
//xor con,relate2,sha3(nchc1) user2
function xorrelate()
{
    // turn nchc to hexstring
    // pending to bytes20
   // var t = stringToHex("nchcnchcnchcnchcnchc");			//config string
  //  console.log(t);
    var sha3t = keccak256("nchc");
    //console.log(sha3t);
    var sha3t20 = sha3t.slice(0,40);
    sha3t20 = "0x"+sha3t20;
   // console.log(sha3t20);
     
     var sha3t_v2 = keccak256("nchc1");
    //console.log(sha3t);
    var sha3t20_v2 = sha3t_v2.slice(0,40);
    sha3t20_v2 = "0x"+sha3t20_v2;
    //console.log(sha3t20_v2);
    ///turn hexstring to uint
    //var r = parseInt(t,16);
    //console.log(r);

    // turn int back to hexstring
    //var q = r.toString(16);
    //console.log(q);

    // contract addresss turn address into bignumber
    var s = h2d("0x692a70d2e424a56d2c6c27aa97d1a86395877b3a");		//config contract address
    // test relate address
    var u = h2d("0xa2f08385ff6e08a215979367885a09dcd7d0d898");		//config relate address
                 
    var u2 =h2d("0x4df85abd32fc76a5625386b551a94f6c57e0b075");      //config relate address two
    
    //sha3       
    var r = h2d(sha3t20);
    var r2=h2d(sha3t20_v2);
  //  console.log(r);
   // console.log(s);
   // console.log(u);

    var big1 = bignum(s,base=10);
  //  console.log(big1);

    var big2 = bignum(u,base=10);
    var big2_v2 = bignum(u2,base=10);
    //console.log(big2);

    //nchc
    var big3 = bignum(r,base=10);
    var big3_v2 = bignum(r2,base=10);
    //console.log(big3);

    var result = big1.xor(big2);
    result = result.xor(big3);
    //console.log(result);

    var ans = result.toString(base=16);
    ans = "0x"+ans;
    console.log(ans);

    //second relate
    var result2 = big1.xor(big2_v2);
    result2 = result2.xor(big3_v2);
    //console.log(result);

    var ans2 = result2.toString(base=16);
    ans2 = "0x"+ans2;
    console.log(ans2);
}

//init: find the int where to store relate
//xor sha3(idolmaster), con, num
function xorint(num){
    var shaimas = keccak256("idolmaster");
    //console.log(shaimas);
    var heximas = shaimas.slice(0,40);
    heximas = "0x"+heximas;
    //console.log(heximas);    // contract addresss turn address into bignumber

    var conaddr = h2d("0x692a70d2e424a56d2c6c27aa97d1a86395877b3a");	//config contract address
    
    //decimal addr
    var decimas = h2d(heximas);
    
    var big1 = bignum(conaddr,base=10);
    //console.log(big1);

   // console.log(big2);

    var big2 = bignum(decimas,base=10);
  //  console.log(big3);

    var big3 = bignum(num,base=10);
    
    var ans = big1.xor(big2);
    ans = ans.xor(big3);
    var result = ans.toString(base=16);
    result = "0x"+result;
    console.log(result);
}

//teacher's signature : Xor to smart contract(security)
//Xor(contractaddr, nchc*8,r)
// v and num does not do any Xor
function xorsign(){
    var r = h2d("0xa84ffd5a5031ed55e439857f1b6705b0ad60b05859456179d316ffd51101022e");	//config r
    var s = h2d("0x63feb8f431573ce394dc32af6a4cd97d45e804db483902edf7838d3a6cb3d43d");	//config s

    //0xe59a2207d46696913cd87c716a8d760c1344a0ae335c555397895698582801b2
    //0x59bb6310767c8a010df3e83eacab05d867aee50d90e4ae211aa2cfdfe585b865
    var hexnchc = stringToHex("nchcnchcnchcnchcnchcnchcnchcnchc");						//config str
    var nchc = h2d(hexnchc);
    //contract address only have 20 bytes padding to bytes32
    var con = "";                                                                       //config contract address
   var tmpcon = "0x000000000000000000000000"+con.substr(2);    var conaddr = h2d(tmpcon);
    var bigs = bignum(s,base=10);
    var bigr = bignum(r,base=10);

    var bignchc = bignum(nchc,base=10);
    var bigcon = bignum(conaddr,base=10);

    var ansr = bigr.xor(bignchc);
    ansr = ansr.xor(bigcon);
    var resultr = ansr.toString(16);
    resultr = "0x"+resultr;
    console.log(resultr);

    var anss = bigs.xor(bignchc);
    anss = anss.xor(bigcon);
    var results = anss.toString(16);
    results = "0x"+results;
    console.log(results);
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
//前置處理：先計算contract address 和 sha3(nchc)的bignumber
//xor json file(timestamp,conaddr,nchc,bytes32)
function xornchccon(){
   // var tmp = stringToHex(str);
   //console.log(tmp);
   var con = "0xce141055e8d521bf3fa4f1c9c71c9ef76d663c92";            //config contract address
   var tmpcon = "0x000000000000000000000000"+con.substr(2);     //delete "0x"  padding to bytes32
   console.log(tmpcon);
   var shanchc = keccak256("nchc");
   var hexnchc = "0x"+shanchc;
   var decnchc = h2d(hexnchc);
   var deccon = h2d(tmpcon);
   var bignchc = bignum(decnchc,base=10);
   var bigcon = bignum(deccon,base=10);
   var ans = bignchc.xor(bigcon);
   console.log(ans);                    //bignum used in xorjson config bighash
}

//hashjson value:hexjson same as solidity
//input array(很多bytes32) 轉成string concate起來後做hash
//切得原因：smart contract上做hash的是把他切成很多bytes32 所以比對時這裡也要切
function hashjson(str){ 
    console.log(str);   
    var tmp="";                                 //tmp store the whole data in hex
    for(var i =  0 ;i < str.length ; i++)
    {
        console.log(str[i]);
        var buf = Buffer.from(str[i],'ascii');
        var value = "0x"+buf.toString('hex');
        value = rightpad(value,66,'0');         //padding to 32 bytes(配合solidity) solidity 會padding
                                                //66: "0x"+bytes32  delete

        if(value.substr(0, 2) === '0x'){        //web3.sha3 remove 0x and hash
            value = value.substr(2);
        }
        tmp+=value;
    }
    value = CryptoJS.enc.Hex.parse(tmp);        //from github source code: how web3 sha3 implement
    var ans = sha3(value, {outputLength: 256}).toString();
    console.log(ans);
}
//send event message when check url triggered
//Xor(conaddr, time ,input ,nchc)
// instruct ways to convert string to hex

//xorrelate();
//xorint(53);
//xorsign();

//xorrelate();
//xorint(256);
//xorsign();
// xornchccon();
xorjson();
// var str = ["idolmaster","million"];
// hashjson(str);