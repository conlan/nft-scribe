pragma solidity ^0.5.12;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

library ConcatHelper {
    function concat(bytes memory a, bytes memory b)
            internal pure returns (bytes memory) {
        return abi.encodePacked(a, b);
    }
}

contract Scribe {
	event Record (
		address dictator,
        address tokenAddress,
        uint tokenId,
        string text
    );

	// A recorded document which tracks the dictator, the text, and the timestamp of when it was created
	struct Document {
		address dictator;
		string text;
		uint creationTime;
	}

	mapping (bytes => Document[]) public documents;
	
	mapping (bytes => uint) public documentsCount;

	function dictate(address _tokenAddress, uint256 _tokenId, string memory _text) public {
		// check that the message sender owns the token at _tokenAddress
		require(ERC721(_tokenAddress).ownerOf(_tokenId) == msg.sender);
		// get the document key for this address and token id
		bytes memory documentKey = getDocumentKey(_tokenAddress, _tokenId);
		// push a new document with the dictator address, message, and timestamp
		documents[documentKey].push(Document(msg.sender, _text, block.timestamp));
		// increase the documents counter for this key
		documentsCount[documentKey]++;
		// emit an event for this newly created record
		emit Record(msg.sender, _tokenAddress, _tokenId, _text);
	}

	function getDocumentKey(address _tokenAddress, uint256 _tokenId) public pure returns (bytes memory) {
		return ConcatHelper.concat(toBytes(_tokenAddress), toBytes(_tokenId));
	}

	function toBytes(address x) internal pure returns (bytes memory b) { 
		b = new bytes(20); 
	
		for (uint i = 0; i < 20; i++) 
			b[i] = byte(uint8(uint(x) / (2**(8*(19 - i))))); 
	}

	function toBytes(uint256 x) internal pure returns (bytes memory b) {
    	b = new bytes(32);
    	assembly { mstore(add(b, 32), x) }
	}
}