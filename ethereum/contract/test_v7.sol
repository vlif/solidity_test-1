// 2.VoteCount == 2 -> event
// 3.professor SC => show pending student request
// 4.use web3 api call seturl to set hashurl to structure
// 5. after get url from web send event => graduate(encrypted)
// problem 2:input json should xor back and hash
//  problem3 : msg.sender = 教網中心
// problem 4: init send json
// problem 5: add event and oracale at last
//xor json file added (nodejs encode for 1 min)

import "github.com/Arachnid/solidity-stringutils/strings.sol";
pragma solidity ^0.4.10;
contract SimpleOracle {
    // 增加owner
    address owner;
    // 增加responder
    address public responder;
    mapping(uint256 => bytes) responses;
    
    // 設定owner
    function SimpleOracle() {
        owner = msg.sender;
    }

    // owner才能使用的
    modifier onlyOwner() {
        if (msg.sender != owner) throw;
        _;
    }

    // responder才能使用的
    modifier onlyResponder() {
        if (msg.sender != responder) throw;
        _;
    }
    
    event upload(address sender);       //verified event to let web server know

    // 設定responder，並限定owner才能使用
    function setResponder(address _responder) external onlyOwner {
        responder = _responder;
    }
    
    function query(address sender) external returns (uint256) {
        uint256 id = uint256(sha3(block.number, now, sender, msg.sender));
        upload(sender);
        return id;
    }
    
    // 限定responder才能使用
    function _queryCallback(uint256 _id, bytes _response) external onlyResponder {
        responses[_id] = _response;
    }
    
    function getResponse(uint256 _id) external constant returns (bytes) {
        return responses[_id];
    }
}
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
       using strings for *;
       address user;    //student
       address admin;   //教網中心
       string json;
       bytes32 shanchc;

       //if signature collected upload event
       struct diploma{
           uint CNT;
           bool[] verified;
           address[] relate;
           bytes32 hashjson;
       }
       mapping(uint => diploma) Diploma;
    Oracle_update Oracle = Oracle_update();	//config
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
            Oracle.query(msg.sender);
        }
    }
    
    //unxor sign(r,s)
    function xorsign(bytes32 xorr) returns(bytes32 r){
        address con = this;
        bytes32 str="nchcnchcnchcnchcnchcnchcnchcnchc";
        r = bytes32(con)^str^xorr;
    }
    
    function trace(bytes20 hexnum) returns(bool[]){
        uint num=xorint(hexnum);
        return(Diploma[num].verified);
    }
    
    function bytes32ArrayToString (bytes32[] data) returns (string) {
        bytes memory bytesString = new bytes(data.length * 32);
        uint urlLength;
        for (uint i=0; i<data.length; i++) {
            for (uint j=0; j<32; j++) {
                byte char = byte(bytes32(uint(data[i]) * 2 ** (8 * j)));
                if (char != 0) {
                    bytesString[urlLength] = char;
                    urlLength += 1;
                }
            }
        }
            return string(bytesString);
    }
    function dexorjson(bytes32 a,bytes32 halfxor) returns(bytes32){
        return (a^halfxor);
    }

    function setjson(bool check,bytes32[] a) {
        if(check == true){
            address conaddr = this;
            bytes32 halfxor = bytes32(conaddr)^shanchc;

            uint len = a.length;
            for(uint i = 0 ;i < len; i++){
                a[i] = dexorjson(a[i],halfxor);
            }
            json =json.toSlice().concat((bytes32ArrayToString(a)).toSlice());
        }
        else{
            uint num = xorint(bytes20(a[0]));
            Diploma[num].hashjson = sha3(json);
            json = "";
        }
    }
    //student give a string^ conaddr^nchc
    // return num test
    function getjson(bytes20 hexnum) returns(bytes32){
        uint num = xorint(hexnum);
        return (Diploma[num].hashjson);
    }
 }
 