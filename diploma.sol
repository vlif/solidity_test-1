// 2.VoteCount == 2 -> event
// 3.professor SC => show pending student request
// 4.use web3 api call seturl to set hashurl to structure
// 5. after get url from web send event => graduate(encrypted)
// 1->國小，2->國中，3->高中職，4->五專,5->二專,6->二技,7->大學四技,
// 8->碩士,9->博士
// database store how many school diploma has for each number(1~9)
//problem 1. init =>waste time
//problem 2. upload parameter(num reveal info)
// init after upload
// double major verified
// 解法：傳進address string
pragma solidity ^0.4.10;

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

    //update url xor(nchc1234,time,addr,uint)
     event updateurl(bytes32 id,bytes32 hash,address conaddr,uint time);
      event test(string a);
    function setCbAddress(address _cbAddress) onlyOwner {
        cbAddress = _cbAddress;
    }

    function query(string _query,bytes32 hash,address conaddr,uint time) returns (bytes32 id) {
        id = sha3(block.number, now, _query, msg.sender);
        //update url xor(nchc1234,time,addr,uint)
        //updateurl(id,hash,conaddr,time);
        return id;
    }
    function test_q(string a) returns(bytes32 id){
        id = sha3(block.number, now, a, msg.sender);
        test(a);
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
           bytes32[2] r;
           bytes32[2] s;
           uint8[2] v;
           string hashurl;
           address[2] relate;
       }
       mapping(uint => diploma) Diploma;
    
    function bytes32ToString(bytes32 x) constant returns (string) {
        bytes memory bytesString = new bytes(32);
        uint charCount = 0;
        for (uint j = 0; j < 32; j++) {
            byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[charCount] = char;
                charCount++;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (j = 0; j < charCount; j++) {
            bytesStringTrimmed[j] = bytesString[j];
        }
        return string(bytesStringTrimmed);
    }
   
   // user = msg.sender !!!
   function test(){
       user = msg.sender;
      /* for(uint i = 10 ; i <= 90 ;i=i+10){
           Diploma[i].verified[0]=Diploma[i].verified[1]=true;
           Diploma[i].relate[0] = address(sha3(user,i,1));
           Diploma[i].relate[1] = address(sha3(user,i,2));
           Diploma[i].hashurl = bytes32ToString(sha3(user,"url",i));
       }*/
   }
   
   
   // real init add user
   // address don't need to transform to bytes20(xoraddr0,xoraddr1)
   function init(bytes20 decode,bytes20 xoraddr0,bytes20 xoraddr1) returns(address addr0, address addr1,uint i){
         addr0 = xorrelate(xoraddr0);
         addr1 = xorrelate(xoraddr1);
         i = xorint(decode,bytes20(addr0),bytes20(addr1));
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
    
    // three url a time  i : grade+school
    function setUrl(uint i,uint j,uint k,string urli,string urlj,string urlk){
        Diploma[i].hashurl = urli;
        Diploma[j].hashurl = urlj;
        Diploma[k].hashurl = urlk;
    }
    // less 2**30 num
   /*function addrtouint(address x) returns (uint b,bytes32 c) {
            b = uint(x)%(2**30);
            c = bytes32(b);
   }*/
    /*   event Xor  */
   //Xor function call event to update url
  /* function Xor(uint num) returns(uint time,address addr,bytes32 snum,bytes32 sstr,bytes32 stime,bytes32 saddr,bytes32 e){
         sstr = (sha3("nchc"));
         snum = bytes32(num);
         time = now;
         //tmp = addrtouint(this);
         stime = sha3(bytes32(time));
         addr = this;
         saddr =sha3(bytes32(addr));// addrtoBytes(contract_addr);
        e = snum^stime^saddr^sstr;
   }*/
    
   // verify signature verify = msg.sender  ?
   // num and who should xor?
   function verify(uint who,uint num,bytes32 hash,uint8 v,bytes32 xorr,bytes32 xors){
        bytes32 r =xorsign(xorr);
        bytes32 s =xorsign(xors);
        
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 prefixedHash = sha3(prefix, hash);
        address tmp = ecrecover(prefixedHash, v, r, s);
        
        if(Diploma[num].relate[who] != tmp || Diploma[num].verified[who] == true){
            throw;
        }
        //store sign and proaddr and add voteCount if true
        Diploma[num].r[who] = r;
        Diploma[num].s[who] = s;
        Diploma[num].v[who] = v;
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
    
    function updateurlxor(uint num) returns(bytes20 ans ,uint time){
        address con = this;
        time = now;
        bytes20 str = "nchcnchcnchcnchcnchc";
        ans = bytes20(time)^bytes20(con)^str;
    }
    // company query for url
    // update event first and returns
    // after that seturl to update
   function geturl(uint a) returns (string){
        return Diploma[a].hashurl;
   }
 }
 