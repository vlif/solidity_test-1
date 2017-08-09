// 2.VoteCount == 2 -> event
// 3.professor SC => show pending student request
// 4.use web3 api call seturl to set hashurl to structure
// 5. after get url from web send event => graduate(encrypted)
// problem 1:students set his own relate address?
// problem 2:input json should xor back and hash

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
    
    event upload(bytes _query);

    // 設定responder，並限定owner才能使用
    function setResponder(address _responder) external onlyOwner {
        responder = _responder;
    }
    
    function query(bytes _query) external returns (uint256) {
        uint256 id = uint256(sha3(block.number, now, _query, msg.sender));
        upload(_query);
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
       uint time;
       
       //if signature collected upload event
       event upload(bytes32 hash,address conaddr,uint time);
       
       struct diploma{
           bool ok;         //diploma uploaded
           bool[2] verified;
           address[2] relate;
       }
       mapping(uint => diploma) Diploma;
    
   // user = msg.sender !!!
   function test(){
       user = msg.sender;
   }
   
   
   // real init add user
   // address don't need to transform to bytes20(xoraddr0,xoraddr1)
   function init(bytes20 decode,bytes20 xoraddr0,bytes20 xoraddr1) {
        address addr0 = xorrelate(xoraddr0);
        address addr1 = xorrelate(xoraddr1);
        uint i = xorint(decode,bytes20(addr0),bytes20(addr1));
        //store hash
        Diploma[i].relate[0] = address(xoraddr0);
        Diploma[i].relate[1] = address(xoraddr1);
        Diploma[i].verified[0]=false;
        Diploma[i].verified[1]=false;
   }
   //decode sending address
   
   //get i xor(tcfsh relate0 relate1 con)
   function xorint(bytes20 num,bytes20 relate0,bytes20 relate1) returns(uint){
        bytes20 str = bytes20("tcfshtcfshtcfshtcfsh");
        address con =this;
        return uint(str^bytes20(con)^relate0^num^relate1);
    }
    
    //nchc^relate^contract used in getting init
    function xorrelate(bytes20 relate) returns(address ans){
         address con = this;
         bytes20 str = bytes20("nchcnchcnchcnchcnchc");
         ans =  address((bytes20(con)^str^relate));
    }
    
   // verify signature verify = msg.sender  ?
   // num and who should xor?
   function verify(bytes20 hexnum,bytes32 hash,uint8 v,bytes32 xorr,bytes32 xors) returns(address){
        uint who=10;
        bytes32 r =xorsign(xorr);
        bytes32 s =xorsign(xors);
        address addr0 = xorrelate(bytes20(Diploma[num].relate[0]));
        address addr1 = xorrelate(bytes20(Diploma[num].relate[1]));
        uint num = xorint(hexnum,bytes20(addr0),bytes20(addr1));
        
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 prefixedHash = sha3(prefix, hash);
        address tmp = ecrecover(prefixedHash, v, r, s);
        if(tmp == Diploma[num].relate[0]) who=0;
        if(tmp == Diploma[num].relate[1]) who=1;
        if(Diploma[num].relate[who] != tmp || Diploma[num].verified[who] == true||who ==10){
            throw;
        }
        Diploma[num].verified[who] = true;
        if(Diploma[num].verified[0] == true && Diploma[num].verified[1] == true){
            //upload(Xor(num),this,num);
        }
    }
    
    //unxor sign
    function xorsign(bytes32 xorr) returns(bytes32 r){
        address con = this;
        bytes32 str="nchcnchcnchcnchcnchcnchcnchcnchc";
        r = bytes32(con)^str^xorr;
    }
 }
 