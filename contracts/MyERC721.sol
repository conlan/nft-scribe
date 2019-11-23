pragma solidity ^0.5.12;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";

contract MyERC721 is ERC721Full {
    
    function mintUniqueTokenTo(address _to, uint256 _tokenId, string memory _tokenURI) public {
        _mint(_to, _tokenId);
        
        _setTokenURI(_tokenId, _tokenURI);
    }
}