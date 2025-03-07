// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RealEstate is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;
    mapping(address => uint256) public ownedProperties; // Nombre de biens par adresse
    mapping(address => uint256) public lastTransactionTime; // Cooldown des transactions

    struct Property {
        string propertyType; // "maison", "gare", "hotel"
        string location;
        uint256 value;
        uint256 surface;
        string documentHash; // IPFS hash
        string imageHash; // IPFS hash
        address[] previousOwners;
        uint256 createdAt;
        uint256 lastTransferAt;
    }

    mapping(uint256 => Property) public properties;

    constructor() ERC721("RealEstateToken", "RET") Ownable(msg.sender) {}

    // Fonction interne pour vérifier si un token existe
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

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

        // 🔥 Vérifier la limite de possession
        require(ownedProperties[msg.sender] < 40, "Maximum de 4 biens par adresse");

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
        nextTokenId++;
    }

    function totalSupply() external view returns (uint256) {
        return nextTokenId;
    }

    function deleteAllProperties() external onlyOwner {
        require(nextTokenId > 0, unicode"Aucune propriété à supprimer.");

        for (uint256 i = 0; i < nextTokenId; i++) {
            if (_exists(i)) {
                _burn(i); // Supprime le NFT
            }
            delete properties[i]; // Supprime les détails de la propriété
        }

        nextTokenId = 0; // Réinitialiser le compteur de mint
    }

    function transferProperty(address to, uint256 tokenId) external cooldownCheck {
        require(ownerOf(tokenId) == msg.sender, unicode"Vous n'êtes pas le propriétaire de ce bien");
        require(ownedProperties[to] < 4, "Maximum de 4 biens par adresse");
        require(ownedProperties[msg.sender] > 0, unicode"Vous ne possédez aucun bien à transférer"); // 🔥 Correction ici

        _transfer(msg.sender, to, tokenId);

        ownedProperties[msg.sender] = ownedProperties[msg.sender] - 1; // Décrémentation sécurisée
        ownedProperties[to]++;

        properties[tokenId].previousOwners.push(msg.sender);
        properties[tokenId].lastTransferAt = block.timestamp;
    }

    function getPropertyDetails(uint256 tokenId) external view returns (Property memory) {
        return properties[tokenId];
    }
}

