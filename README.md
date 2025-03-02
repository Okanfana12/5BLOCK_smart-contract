# 🏗 Web3 Monopoly - Tokenisation Immobilière avec Hardhat

Ce projet permet de **tokeniser des biens immobiliers** sous forme de NFTs (**ERC-721**) sur **Ethereum** en utilisant **Hardhat** pour le développement et les tests. L'objectif est de créer une DApp (application décentralisée) qui permet aux citoyens de Lyonne d'acquérir, d'échanger et de gérer des biens immobiliers de manière décentralisée.

---

## 📌 1. Prérequis

Avant de commencer, assure-toi d'avoir installé :

- **Node.js** (v16 ou supérieur) - [Télécharger ici](https://nodejs.org/)
- **Metamask** (extension navigateur) - [Télécharger ici](https://metamask.io/)
- **Infura** (si tu veux tester sur Sepolia) - [Créer un compte ici](https://infura.io/)
- **Git** - [Télécharger ici](https://git-scm.com/)

---

## 📥 2. Installation

### Cloner le projet

```bash
git clone https://github.com/ton-repo/web3-monopoly.git
cd web3-monopoly
```

### Installer les dépendances

```bash
npm install
```

---

## 🛠 3. Configuration du projet

### Configuration de Hardhat

Le projet est configuré pour fonctionner avec Hardhat. Assure-toi d'avoir un fichier `.env` à la racine du projet avec les variables suivantes :

```plaintext
PRIVATE_KEY=ta_clé_privée_metamask
INFURA_PROJECT_ID=ton_id_projet_infura
```

### Compiler les Smart Contracts

Pour compiler les smart contracts, exécute la commande suivante :

```bash
npx hardhat compile
```

---

## 🚀 4. Déploiement du Smart Contract

### Lancer un Réseau Local Hardhat

Avant de déployer en local, démarre un réseau Ethereum simulé avec Hardhat :

```bash
npx hardhat node
```

Cela crée 10 comptes de test avec 10 000 ETH chacun (faux ETH).

### Déploiement en local (Hardhat)

Dans un autre terminal, exécute la commande suivante pour déployer le contrat sur le réseau local :

```bash
npx hardhat run scripts/deploy.js --network hardhat
```

Tu verras une sortie similaire à :

```plaintext
✅ Contrat RealEstate déployé à : 0x1234...
```

### Déploiement sur Sepolia Testnet (Optionnel)

Si tu souhaites déployer sur le testnet Sepolia, assure-toi d'avoir configuré ton `.env` avec les bonnes clés et exécute :

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

Exécuter le script d’interaction
Une fois ton contrat déployé, exécute le script pour interagir avec le Smart Contract :
npx hardhat compile
npx hardhat run scripts/deploy.js --network localhost

node scripts/interact.js

npx hardhat run scripts/interact.js --network localhost

npx hardhat node

npx hardhat run scripts/deploy.js --network localhost

---

## 🧪 5. Tests

### Exécuter les Tests Unitaires

Pour exécuter les tests unitaires, utilise la commande suivante :

```bash
npx hardhat test
```

Les tests couvrent :

- Toutes les règles métier (limites de possession, règles d'échange, contraintes temporelles)
- Les cas d'erreur
- Les interactions avec IPFS

---

## 🌐 6. Frontend (À venir)

La partie frontend sera développée avec **React** et permettra aux utilisateurs de :

- Se connecter avec leur wallet (**Metamask**)
- Consulter les biens disponibles
- Acheter et échanger des biens
- Gérer leurs biens immobiliers

---

## 📚 7. Documentation

### Documentation des Endpoints

Les endpoints de l'API seront documentés ici une fois le frontend développé.

### Explications des Choix Techniques

- **Hardhat** : Choisi pour sa simplicité et sa compatibilité avec Ethereum.
- **ERC-721** : Standard NFT pour la tokenisation des biens immobiliers.
- **IPFS** : Utilisé pour stocker de manière sécurisée les documents de propriété.

---

## 📂 8. Structure du Projet

```plaintext
web3-monopoly/
├── contracts/               # Smart Contracts
├── scripts/                 # Scripts de déploiement
├── test/                    # Tests unitaires
├── frontend/                # Dossier pour le frontend (à venir)
├── hardhat.config.js        # Configuration Hardhat
├── .env                     # Variables d'environnement
└── README.md                # Documentation
```

---

## 🎥 9. Démo Vidéo

Une vidéo de démonstration de 5 minutes sera fournie une fois le projet terminé.

---

## 📜 10. Licence

Ce projet est sous licence **MIT**. Voir le fichier **LICENSE** pour plus de détails.

---

## 🙏 11. Remerciements

Merci à la communauté **Hardhat** et **Ethereum** pour les ressources et outils fournis.

---

## 📧 Contact

Pour toute question ou suggestion, n'hésite pas à me contacter : **ton-email@example.com**

Bonne chance avec ton projet **Web3 Monopoly** ! 🚀
