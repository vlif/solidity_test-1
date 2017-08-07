//npm install bignum
// every ans need to add "0x" at the beginning
bignum = require('bignum');
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
//xor con,relate,nchc
function xorrelate()
{
    // turn nchc to hexstring
    // pending to bytes20
    var t = stringToHex("nchcnchcnchcnchcnchc");
    console.log(t);

    ///turn hexstring to uint
    //var r = parseInt(t,16);
    //console.log(r);

    // turn int back to hexstring
    //var q = r.toString(16);
    //console.log(q);

    // contract addresss turn address into bignumber
    var s = h2d("0x038f160ad632409bfb18582241d9fd88c1a072ba");

    // test relate address
    var u = h2d("0xca35b7d915458ef540ade6068dfe2f44e8fa733c");

    var r = h2d(t);
    console.log(r);
    console.log(s);
    console.log(u);

    var big1 = bignum(s,base=10);
    console.log(big1);

    var big2 = bignum(u,base=10);
    console.log(big2);

    //nchc
    var big3 = bignum(r,base=10);
    console.log(big3);

    var result = big1.xor(big2);
    result = result.xor(big3);
    console.log(result);

    var ans = result.toString(base=16);
    ans = "0x"+ans;
    console.log(ans);
}

//init: find the int where to store relate
//xor tcfsh, con, relate0,relate1, num
function xorint(num){
    var tcfsh = stringToHex("tcfshtcfshtcfshtcfsh");
    // contract addresss turn address into bignumber
    var conaddr = h2d("0x038f160ad632409bfb18582241d9fd88c1a072ba");
    // test relate address
    var relate0 = h2d("0xca35b7d915458ef540ade6068dfe2f44e8fa733c");
    // relate1 address
    var relate1 = h2d("0x14723a09acff6d2a60dcdf7aa4aff308fddc160c");

    var dectcfsh = h2d(tcfsh);
    
    var big1 = bignum(conaddr,base=10);
    //console.log(big1);

    var big2 = bignum(relate0,base=10);
   // console.log(big2);

    var big3 = bignum(dectcfsh,base=10);
  //  console.log(big3);

    var big4 = bignum(num,base=10);
    console.log(big4);
    
    var big5 = bignum(relate1,base=10);
    
    var ans = big1.xor(big2);
    ans = ans.xor(big3);
    ans = ans.xor(big4);
    ans = ans.xor(big5);
    var result = ans.toString(base=16);
    result = "0x"+result;
    console.log(result);
}

//teacher's signature : Xor to smart contract(security)
//Xor(contractaddr, nchc*8,r)

function xorsign(){
    var r = h2d("0xe59a2207d46696913cd87c71b7680650e95f7067798bdf3b6a4d6d294da192de");
    var s = h2d("0x59bb6310767c8a010df3e83e714e75849db535c4da332449e766f46ef00c2b09");
    //0xe59a2207d46696913cd87c716a8d760c1344a0ae335c555397895698582801b2
    //0x59bb6310767c8a010df3e83eacab05d867aee50d90e4ae211aa2cfdfe585b865
    var hexnchc = stringToHex("nchcnchcnchcnchcnchcnchcnchcnchc");
    var nchc = h2d(hexnchc);

    //contract address only have 20 bytes padding to bytes32
    var tmpcon = "0x0000000000000000000000000692a70d2e424a56d2c6c27aa97d1a86395877b3a"
    var conaddr = h2d(tmpcon);
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

//send event message when check url triggered
//Xor(conaddr, time ,input ,nchc)
// instruct ways to convert string to hex
function updateurl(str){
   /*var tmp = "0x"+str;
     var test = h2d(tmp);
   */ 
    var input = h2d("0xb267ff194e1ba09cb16b0502e37cfe785bbf2f0b");
    console.log(test);
    console.log(input);
    var big1 = bignum(input,base=10);
    console.log(big1);

    var big2 = bignum(1502094665,base=10);  //time
    console.log(big2);

    var conaddr = h2d("0xdc04977a2078c8ffdf086d618d1f961b6c546222");
    var big3 = bignum(conaddr,base=10);
    console.log(big3);

    var t = stringToHex("nchcnchcnchcnchcnchc");
    var r =h2d(t);
    var big4 = bignum(r,base=10);
    console.log(big4);

    var result = big1.xor(big2);
    result = result.xor(big3);
    result = result.xor(big4);
    console.log(result);
}
//test(a9abfda907fcc022a801153d0efb49b0b7e064d7)  decode
//test(a7d9c9b0ad14a60dd5d6d647a244baaf473969e5) first relate
//test(799e446014ae45d2f5a7ef3b8b1566e3521f0cd5) 2 relate
//xorrelate();
//xorint(53);
//xorsign();
updateurl("b267ff194e1ba09cb16b0502e37cfe785bbf2f0b");