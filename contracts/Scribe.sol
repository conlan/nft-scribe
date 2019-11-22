pragma solidity ^0.5.12;

contract Scribe {
	struct Document {
		address dictator;
		string text;
		uint time;
	}

	mapping (address => Document[]) public documents;

	constructor() public {
	}

	function dictate(string memory _text) public {
		// TODO take an ERC721 address and tokenID
		documents[msg.sender].push(Document(msg.sender, _text, block.timestamp));
	}
}