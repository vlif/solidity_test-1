pragma solidity ^0.4.0;
contract testserver{
    event hello(bytes32 a);
    bytes32 d=0xdfa6ac3cdfdaf16c2e394f42a016c1099695cb0c3a0e48510d3ce47f798b555e;
    function getjson() returns (bytes32){
        hello(d);
        return d;
    }
}