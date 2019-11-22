pragma solidity ^0.5.12;

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

	struct Document {
		address dictator;
		string text;
		uint time;
	}

	mapping (bytes => Document[]) public documents;
	mapping (bytes => uint) public documentsCount;

	function dictate(address _tokenAddress, uint256 _tokenId, string memory _text) public {
		// TODO check that msg.sender is owner of ERC721 at address + token Id
		bytes memory documentKey = getDocumentKey(_tokenAddress, _tokenId);

		documents[documentKey].push(Document(msg.sender, _text, block.timestamp));

		documentsCount[documentKey]++;

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