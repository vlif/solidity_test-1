//npm install bignum

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

//xor relate address 
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
    var s = h2d("0x0dcd2f752394c41875e259e00bb44fd505297caf");
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
    console.log(ans);
}

//xor tcfsh, con, relate0,relate1, num
function xorint(num){
    // var t = stringToHex("tcfshtcfshtcfshtcfsh");
    // contract addresss turn address into bignumber
    var t = h2d("...");
    var s = h2d("0x692a70d2e424a56d2c6c27aa97d1a86395877b3a");
    // test relate address
    var u = h2d("0xca35b7d915458ef540ade6068dfe2f44e8fa733c");
    
    var r = h2d(t);
    
    var big1 = bignum(s,base=10);
    //console.log(big1);

    var big2 = bignum(u,base=10);
   // console.log(big2);

    var big3 = bignum(r,base=10);
  //  console.log(big3);

    var big4 = bignum(num,base=10);
    console.log(big4);
    console.log(big4.toString(base=16));
    var ans = big1.xor(big2);
    ans = ans.xor(big3);
    ans = ans.xor(big4);
    var result = ans.toString(base=16);
    console.log(result);
}
//0x385f712a1f4824d8ff91a08680da6f2bb6ce4bfa
xorint(53);
