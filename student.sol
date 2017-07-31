// 1.check signature
// 2.VoteCount >= 3 -> event
// 3.professor SC => show pending student request
// 4.use web3 api call seturl to set hashurl to structure
// 5. after get url from web send event => graduate(encrypted)
pragma solidity ^0.4.10;
contract test{
   Oracalize Oracl = Oracalize(msg.sender);
   address user;    //student
   uint256 id;
   mapping(address => student) Person;
   
   struct student{
       string Name;
       uint VoteCount;      //no. of professor's agreement
       string[2] Sign;      //professor's sign string
       bool[2] verified;
       address[2] relate;   //professor list
       string hashurl;      //ipfs url
   }
   
   function test(string name){
        user = msg.sender;
        Person[user].VoteCount = 0;
        Person[user].Name = name;
        Person[user].verified[0] = false;
        Person[user].verified[1] = false;
   }
   
   // verify signature verify = msg.sender
   // if agree VoteCount++(hash => true ? or another parameter)
    function verify(bytes32 hash,uint8 v,bytes32 r,bytes32 s,string Signature){
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 prefixedHash = sha3(prefix, hash);
        address tmp = ecrecover(prefixedHash, v, r, s);
        
        //check which professor verified
        uint who = 10;
        for(uint i = 0 ; i < 2 ; i++){
            if(tmp == Person[user].relate[i]){
                who = i;break;
            }
        }
        
        if(who == 10 || tmp != msg.sender || Person[user].verified[who] == true){
            throw;
        }
        //store sign and proaddr and add voteCount if true
        Person[user].Sign[who] = Signature;
        Person[user].verified[who] = true;
        Person[user].VoteCount++;
        if(Person[user].VoteCount == 2){
             id = Oracl.query("OK");
        }
    }
    
    function setUrl(string hashurl){
        Person[user].hashurl = hashurl;
    }
    
    function ListRelate() constant returns(address[2]){
        return (Person[user].relate);
    }
 }

 contract Oracalize{
    address owner;
    //store hash url
    mapping(uint256 => string) public response;
    
    function Oracalize(){
        owner = msg.sender;
    }
    //query: ok if verified
    event QueryEvent(uint256 id, string query);

    // id => pid
    function query(string _query) returns (uint256 id) {
        id = uint256(sha3(block.number, now, _query, msg.sender));
        QueryEvent(id, _query);
        return id;
    }
    /* ----------------------------------------------  */
    function _queryCallback(uint256 _id, string _response) external {
        response[_id] = _response;
    }
    
    function getResponse(uint256 _id) external constant returns (string) {
        return response[_id];
    }
}
 