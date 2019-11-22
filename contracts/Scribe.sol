pragma solidity ^0.5.12;

contract Scribe {
	struct Document {
		address dictator;
		bytes32 text;
		uint time;
	}

	mapping (address => Document[]) public documents;

	constructor() public {

	}

	function dictate() public {
		documents[msg.sender].push(Document(msg.sender, "hello", block.timestamp));
	}
}