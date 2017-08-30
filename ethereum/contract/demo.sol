pragma solidity ^0.4.0;
contract testwebverify{
    bytes32[] json;
    
    function setjson(bytes32[] a){
        for(uint i = 0 ; i<a.length;i++)
        {json.push(a[i]);}
    }
    function getjson()returns(bytes32){
        return (sha3(json));
    }
}