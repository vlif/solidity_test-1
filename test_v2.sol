// 2.VoteCount == 2 -> event
// 3.professor SC => show pending student request
// 4.use web3 api call seturl to set hashurl to structure
// 5. after get url from web send event => graduate(encrypted)
// 1->國小，2->國中，3->高中職，4->五專,5->二專,6->二技,7->大學四技,
// 8->碩士,9->博士
// 考慮一個人可能念兩個大學有四個簽章

//problem 1. init =>waste time
//problem 2. upload parameter
pragma solidity ^0.4.10;
contract test{
       address user;    //student
       address contract_addr;
       
       //update url xor(nchc1234,time,addr,uint)
       event updateurl(bytes32 hash);
       
       //Problem privacy
       event upload(address contract_addr,uint num);
       
       struct diploma{
           bool ok;         //test if there is things
           uint VoteCount;
           bool[2] verified;
           string[2] Sign;
           string hashurl;
           address[2] relate;
       }
       mapping(uint => diploma) Diploma;
       
   // user = msg.sender !!!
   function test(){user = msg.sender;}
   
   function setContractAddr(address input){contract_addr = input;}
   // company query for url
   function geturl(uint a) returns (string){return Diploma[a].hashurl;}
   
   // add hash url signed relate
   function init(uint i,address addr0,address addr1,string sign0,string sign1){
        Diploma[i].Sign[0] = sign0;
        Diploma[i].Sign[1] = sign1;
        Diploma[i].relate[0] = addr0;
        Diploma[i].relate[1] = addr1;
    }
    
    //set i's(grade+school) diploma url
    function setUrl(uint i,string hashurl){
        Diploma[i].hashurl = hashurl;
    }
   /*   event Xor  */
    //Xor function call event to update url
   function Xor(uint num) returns(bytes32 a,bytes32 b,bytes32 c,bytes32 d,bytes32 e){
        a = bytes32(sha3("nchc"));
        b = bytes32(num);
        c = sha3(now);
        d =sha3(contract_addr);// addrtoBytes(contract_addr);
        e = a^b^c^d;
        updateurl(e);
   }
    
   // verify signature verify = msg.sender
   // if agree VoteCount++(hash => true ? or another parameter)
   function verify(uint num,bytes32 hash,uint8 v,bytes32 r,bytes32 s,string Signature){
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 prefixedHash = sha3(prefix, hash);
        address tmp = ecrecover(prefixedHash, v, r, s);
        
        //check which professor verified
        uint who = 10;
        for(uint i = 0 ; i < 2 ; i++){
            if(tmp == Diploma[num].relate[i]){
                who = i;break;
            }
        }
        
        if(who == 10 || tmp != msg.sender || Diploma[num].verified[who] == true){
            throw;
        }
        //store sign and proaddr and add voteCount if true
        Diploma[num].Sign[who] = Signature;
        Diploma[num].verified[who] = true;
        Diploma[num].VoteCount++;
        if(Diploma[num].VoteCount == 2){
             upload(contract_addr,num);
        }
    }
 }
 