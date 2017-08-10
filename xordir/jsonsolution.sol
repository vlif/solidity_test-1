pragma solidity ^0.4.10;
contract store{
    event hello(string c);
    event fuckyou(bytes32 d);
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
    hello(string(bytesStringTrimmed));
    fuckyou(sha3(string(bytesStringTrimmed)));
    return string(bytesStringTrimmed);
}
}