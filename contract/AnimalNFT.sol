// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.4.2/contracts/token/ERC721/ERC721.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.4.2/contracts/utils/Counters.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.4.2/contracts/utils/Strings.sol";
import "hardhat/console.sol";

contract AnimalNFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    mapping(uint => uint) private trackIdOf; // related track ID of token ID

    constructor () ERC721 ("LearningAnimals", "LA NFT") {}
    
   function mint(address _address, uint _trackId) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        trackIdOf[tokenId] = _trackId;
        _safeMint(_address, tokenId);
        return tokenId;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return "https://gateway.pinata.cloud/ipfs/QmYKJ4TieKdJ9CPZF4RkrzJ9dzLKknwPK5AGsCgJbW74hx/";
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        string memory base = _baseURI();
        uint remainder = tokenId % 8;
        string memory name;
        if (remainder <= 2) {
            name = Strings.toString(remainder);
        } else {
            name = "quiz";
        }
        return string(abi.encodePacked(base, trackIdOf[tokenId], "_", name, ".json"));
    }

    function transfer(address from, address to, uint256 tokenId) public {
        _transfer(from, to, tokenId);
    }

}