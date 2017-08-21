// 2.VoteCount == 2 -> event
// problem 2:input json should xor back and hash
//  problem3 : msg.sender = 教網中心
// problem 4: init send json
// problem 5: add event and oracale at last
//xor json file added (nodejs encode for 1 min)
//problem 先存xor結果最後在解密算hash
pragma solidity ^0.4.10;
contract Oracle_update {
    address owner;
    event upload(address sender);
    function Oracle() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        if (msg.sender != owner) throw;
        _;
    }

    function query(address sender) returns (bytes32 id) {
        id = sha3(block.number, now, msg.sender);
        upload(msg.sender);
        return id;
    }
    
}
contract test{
       address user;    //student
       address admin;   //教網中心
       bytes32[] json;
       bytes32 shanchc;

       //if signature collected upload event
       struct diploma{
           uint CNT;
           bool[] verified;
           address[] relate;
           bytes32 hashjson;
       }
    mapping(uint => diploma) Diploma;
    //Oracle_update Oracle = Oracle_update();	//config
   // user = msg.sender !!!
   function test(address super){
       user = msg.sender;
       admin = super;
       shanchc = sha3("nchc");
   }
   
   
   // don't need return,calculate addr0 addr1
   // address don't need to transform to bytes20(xoraddr0,xoraddr1)
   function init(bytes20 decode,bytes20[] xoraddr){
        if(msg.sender != admin){throw;}
        uint i = xorint(decode);
        json.length = 0;            //initialize array
        //store hash
        for(uint j = 0 ;j<xoraddr.length;j++){
            Diploma[i].relate[j] = address(xoraddr[j]);
            Diploma[i].verified[j]=false;
        }
        Diploma[i].CNT = 0;
   }
   //decode sending address
   
   //get i xor(sha3(idolmaster), con)
   function xorint(bytes20 num) returns(uint){
        bytes20 str = bytes20(sha3("idolmaster"));
        address con =this;
        return uint(str^bytes20(con)^num);
    }
    
    //nchc^relate^contract used in getting init
    function xorrelate(uint num,bytes20 relate) returns(address ans){
         address con = this;
         bytes20 str;
         if(num == 0){
            str= bytes20(sha3("nchc"));
            ans =  address((bytes20(con)^str^relate));
         }
         if(num == 1){
            str= bytes20(sha3("nchc1"));
            ans =  address((bytes20(con)^str^relate));
         }        
    }
    
   // verify signature verify = msg.sender  ?
   // num and who should xor?
   function verify(bytes20 numhex,bytes20 ihex,bytes32 hash,uint8 v,bytes32 xorr,bytes32 xors){
        if(msg.sender != admin){throw;}
        uint num = xorint(numhex);
        bytes32 r =xorsign(xorr);
        bytes32 s =xorsign(xors);
        
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 prefixedHash = sha3(prefix, hash);
        address tmp = ecrecover(prefixedHash, v, r, s);
        uint order = xorint(ihex);
        
        address addr0 = xorrelate(order%2,bytes20(Diploma[num].relate[order]));
        if(tmp != addr0 || Diploma[num].verified[order] == true){throw;}

        Diploma[num].verified[order] = true;Diploma[num].CNT++;
        if(Diploma[num].CNT == 2){
        //   Oracle.query(msg.sender);
        }
    }
    
    //unxor sign(r,s)
    function xorsign(bytes32 xorr) returns(bytes32 r){
        address con = this;
        bytes32 str="nchcnchcnchcnchcnchcnchcnchcnchc";
        r = bytes32(con)^str^xorr;
    }
    
    function trace(bytes20 hexnum) returns(bool[]){
        return(Diploma[xorint(hexnum)].verified);
    }
    function dexorjson(bytes32 a,bytes32 halfxor) returns(bytes32){
        return (a^halfxor);
    }
    //problem 先存xor結果最後在解密算hash
    function setjson(bool check,bytes32[] a) {
       /* if(check == true){
            address conaddr = this;
            bytes32 halfxor = bytes32(conaddr)^shanchc;

            uint len = a.length;
            for(uint i = 0 ;i < len; i++){
                json.push(dexorjson(a[i],halfxor));
            }
        }
        else{
            Diploma[xorint(bytes20(a[0]))].hashjson = sha3(json);
            json.length=0;
        }*/
        if(check == true){
            for(uint i = 0 ; i<a.length;i++)
            {json.push(a[i]);}
        }
        else{
            address conaddr = this;
            bytes32 halfxor = bytes32(conaddr)^shanchc;
            for( i = 0 ; i <json.length;i++){
                json[i] = dexorjson(json[i],halfxor);
            }
            Diploma[xorint(bytes20(a[0]))].hashjson = sha3(json);
            json.length=0;
        }
    }
    //student give a string^ conaddr^nchc
    // return num test
    //permission? not yet verified cannot click?
    function getjson(bytes20 hexnum) returns(bytes32){
        uint num = xorint(hexnum);
        if(Diploma[num].CNT < 2){throw;}
        return (Diploma[num].hashjson);
    }
 }
 