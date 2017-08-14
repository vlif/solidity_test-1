// 2.VoteCount == 2 -> event
// 3.professor SC => show pending student request
// 4.use web3 api call seturl to set hashurl to structure
// 5. after get url from web send event => graduate(encrypted)
// problem 1:students set his own relate address?
// problem 2:input json should xor back and hash
//  problem3 : msg.sender = 教網中心
// problem 4: init send json
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
    address public cbAddress; // callback address

    function Oracle() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        if (msg.sender != owner) throw;
        _;
    }

    //upload success(number,)
    event upload(bytes20 d);
    function setCbAddress(address _cbAddress) onlyOwner {
        cbAddress = _cbAddress;
    }

    function query(string _query,bytes32 hash,address conaddr,uint time) returns (bytes32 id) {
        id = sha3(block.number, now, _query, msg.sender);
        //update url xor(nchc1234,time,addr,uint)
        //updateurl(id,hash,conaddr,time);
        return id;
    }
    
}
contract test{
       address user;    //student
       string json;
      
       //if signature collected upload event
       struct diploma{
           bool[2] verified;
           address[2] relate;
           bytes32 hashjson;
       }
       mapping(uint => diploma) Diploma;
    
   // user = msg.sender !!!
   function test(){
       user = msg.sender;
   }
   
   
   // don't need return
   // address don't need to transform to bytes20(xoraddr0,xoraddr1)
   function init(bytes20 decode,bytes20 xoraddr0,bytes20 xoraddr1) returns(address,uint,address,address){
        uint i = xorint(decode);
        address addr0 = xorrelate(0,xoraddr0);
        address addr1 = xorrelate(1,xoraddr1);
        //store hash
        Diploma[i].relate[0] = address(xoraddr0);
        Diploma[i].relate[1] = address(xoraddr1);
        Diploma[i].verified[0]=false;
        Diploma[i].verified[1]=false;
        return (this,i,addr0,addr1);
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
   function verify(bytes20 numhex,bytes32 hash,uint8 v,bytes32 xorr,bytes32 xors){
        uint num = xorint(numhex);
        uint who=10;
        bytes32 r =xorsign(xorr);
        bytes32 s =xorsign(xors);
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 prefixedHash = sha3(prefix, hash);
        address tmp = ecrecover(prefixedHash, v, r, s);
        address addr0 = xorrelate(0,bytes20(Diploma[num].relate[0]));
        if(tmp == addr0) who=0;
        else{
            addr0 = xorrelate(1,bytes20(Diploma[num].relate[1]));
            if(tmp == addr0) who=1;
        }
        //if(Diploma[num].relate[who] != tmp || Diploma[num].verified[who] == true||who ==10){
        //    throw;
    //    }
        Diploma[num].verified[who] = true;
        if(Diploma[num].verified[0] == true && Diploma[num].verified[1] == true){
            //upload(Xor(num),this,num);
        }
      //  return (addr0);
    }
    
    //unxor sign(r,s)
    function xorsign(bytes32 xorr) returns(bytes32 r){
        address con = this;
        bytes32 str="nchcnchcnchcnchcnchcnchcnchcnchc";
        r = bytes32(con)^str^xorr;
    }
    
    function trace(bytes20 hexnum) returns(bool,bool){
        uint num=xorint(hexnum);
        return(Diploma[num].verified[0],Diploma[num].verified[1]);
    }
    // concate string
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
        bytes memory bytesStringTrimmed = new bytes(urlLength);
        for (i=0; i<urlLength; i++) {
            bytesStringTrimmed[i] = bytesString[i];
        }
        return string(bytesStringTrimmed);
    }
    input json and hash
    function setjson(bytes32[] a) returns(bytes32){
        return(sha3(bytes32ArrayToString(a)));
    }
    //student give a string^ conaddr^nchc
    // return num test
    function getjson(bytes20 hexnum) returns(bytes32){
        uint num = xorint(hexnum);
        return (Diploma[num].hashjson);
    }
 }
 