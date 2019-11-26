pragma solidity ^0.5.12;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

// Utilities library
library Utilities {
	// concat two bytes objects
    function concat(bytes memory a, bytes memory b)
            internal pure returns (bytes memory) {
        return abi.encodePacked(a, b);
    }

    // convert address to bytes
    function toBytes(address x) internal pure returns (bytes memory b) { 
		b = new bytes(20); 
	
		for (uint i = 0; i < 20; i++) 
			b[i] = byte(uint8(uint(x) / (2**(8*(19 - i))))); 
	}

	// convert uint256 to bytes
	function toBytes(uint256 x) internal pure returns (bytes memory b) {
    	b = new bytes(32);
    	assembly { mstore(add(b, 32), x) }
	}
}

// Contract that allows an NFT owner to dictate a message attached to the token.
// There's no limit on the number of messages they can dictate or the length for a single message
contract Scribe {
	// A record event that emits each time an owner dictates a message
	event Record (
		// the address of who dicated this document
		address dictator,
		// The NFT address
        address tokenAddress,
        // The NFT tokenId
        uint tokenId,
        // The text of the dictation
        string text
    );

	// A recorded document which tracks the dictator, the text, and the timestamp of when it was created
	struct Document {
		// the address of who dicated this document
		address dictator;
		// the text of the dictation
		string text;
		// the block time of the dictation
		uint creationTime;
	}

	// Mapping of document keys to documents (keys are concated token address + tokenId)
	mapping (bytes => Document[]) public documents;
	
	// Mapping of document keys to the count of dictated documents
	mapping (bytes => uint) public documentsCount;

	// Function for dictating an owner message
	function dictate(address _tokenAddress, uint256 _tokenId, string memory _text) public {
		// check that the message sender owns the token at _tokenAddress
		require(ERC721(_tokenAddress).ownerOf(_tokenId) == msg.sender, "Sender not authorized to dictate.");
		// get the document key for this address and token id
		bytes memory documentKey = getDocumentKey(_tokenAddress, _tokenId);
		// push a new document with the dictator address, message, and timestamp
		documents[documentKey].push(Document(msg.sender, _text, block.timestamp));
		// increase the documents counter for this key
		documentsCount[documentKey]++;
		// emit an event for this newly created record
		emit Record(msg.sender, _tokenAddress, _tokenId, _text);
	}

	// Function for getting the document key for a given NFT address + tokenId
	function getDocumentKey(address _tokenAddress, uint256 _tokenId) public pure returns (bytes memory) {
		return Utilities.concat(Utilities.toBytes(_tokenAddress), Utilities.toBytes(_tokenId));
	}
}