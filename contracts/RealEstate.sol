// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RealEstate is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;
    mapping(address => uint256) public ownedProperties;
    mapping(address => uint256) public lastTransactionTime;

    struct Property {
        string propertyType;
        string location;
        uint256 value;
        uint256 surface;
        string documentHash;
        string imageHash;
        address[] previousOwners;
        uint256 createdAt;
        uint256 lastTransferAt;
    }

    mapping(uint256 => Property) public properties;

    event PropertyMinted(uint256 indexed tokenId, address indexed owner, string propertyType, string location);
    event PropertyTransferred(uint256 indexed tokenId, address indexed from, address indexed to);

    constructor() ERC721("RealEstateToken", "RET") Ownable(msg.sender) {}

    modifier cooldownCheck() {
        require(
            block.timestamp > lastTransactionTime[msg.sender] + 5 minutes,
            "Cooldown de 5 minutes entre deux transactions"
        );
        _;
        lastTransactionTime[msg.sender] = block.timestamp;
    }

    function mintProperty(
        string memory _propertyType,
        string memory _location,
        uint256 _value,
        uint256 _surface,
        string memory _documentHash,
        string memory _imageHash,
        string memory _metadataURI
    ) external onlyOwner {
        require(
            keccak256(bytes(_propertyType)) == keccak256(bytes("maison")) ||
            keccak256(bytes(_propertyType)) == keccak256(bytes("gare")) ||
            keccak256(bytes(_propertyType)) == keccak256(bytes("hotel")),
            "Type de bien invalide"
        );

        properties[nextTokenId] = Property({
    propertyType: _propertyType,
    location: _location,
    value: _value,
    surface: _surface,
    documentHash: _documentHash,
    imageHash: _imageHash,
    previousOwners: new address[](0),
    createdAt: block.timestamp,
    lastTransferAt: block.timestamp
});

        _mint(msg.sender, nextTokenId);
        _setTokenURI(nextTokenId, _metadataURI);
        ownedProperties[msg.sender]++;

        emit PropertyMinted(nextTokenId, msg.sender, _propertyType, _location);

        nextTokenId++;
    }

    function totalSupply() external view returns (uint256) {
        return nextTokenId;
    }

    function transferProperty(address to, uint256 tokenId) external cooldownCheck {
        require(ownerOf(tokenId) == msg.sender, unicode"Vous n'êtes pas le propriétaire de ce bien");
        require(ownedProperties[to] < 4, "Maximum de 4 biens par adresse");
        require(ownedProperties[msg.sender] > 0, unicode"Vous ne possédez aucun bien à transférer");

        _transfer(msg.sender, to, tokenId);

        ownedProperties[msg.sender]--;
        ownedProperties[to]++;

        properties[tokenId].previousOwners.push(msg.sender);
        properties[tokenId].lastTransferAt = block.timestamp;

        emit PropertyTransferred(tokenId, msg.sender, to);
    }

    function getPropertyDetails(uint256 tokenId) external view returns (Property memory) {
        return properties[tokenId];
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
