# 🏗 Web3 Monopoly - Tokenisation Immobilière avec Hardhat

Ce projet permet de **tokeniser des biens immobiliers** sous forme de NFTs (**ERC-721**) sur **Ethereum** en utilisant **Hardhat** pour le développement et les tests.

---

## 📌 1. Prérequis

Avant de commencer, assure-toi d'avoir installé :

- **Node.js** (v16 ou supérieur) - [Télécharger ici](https://nodejs.org/)
- **Metamask** (extension navigateur)
- **Infura** (si tu veux tester sur Sepolia) - [Créer un compte ici](https://infura.io/)

### 📥 Cloner le projet

```bash
git clone https://github.com/ton-repo/web3-monopoly.git
cd web3-monopoly



npm install
npx hardhat compile


4. Lancer un Réseau Local Hardhat
Avant de déployer en local, on démarre un réseau Ethereum simulé :

bash
Copier
Modifier
npx hardhat node
Cela crée 10 comptes de test avec 10 000 ETH chacun (faux ETH).


5. Déploiement du Smart Contract
📌 Déploiement en local (Hardhat)
Dans un autre terminal, exécute :

bash
Copier
Modifier
npx hardhat run scripts/deploy.js --network hardhat
Tu verras : ✅ Contrat RealEstate déployé à : 0x1234...
```
