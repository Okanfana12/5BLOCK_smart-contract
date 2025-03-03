const hre = require("hardhat");

async function main() {
  const [deployer, user1] = await hre.ethers.getSigners();
  const contractAddress = "0x162A433068F51e18b7d13932F27e66a3f99E6890";

  if (!contractAddress) {
    throw new Error("❌ Adresse du contrat non définie !");
  }

  // 🏗️ Attacher le contrat déployé
  const RealEstate = await hre.ethers.getContractFactory("RealEstate");
  const realEstate = await RealEstate.attach(contractAddress);

  console.log(`📌 Interaction avec le contrat déployé à ${contractAddress}`);

  // 🔹 Liste des propriétés à minter
  const properties = [
    { type: "maison", location: "Paris", value: 500000, surface: 120 },
    { type: "gare", location: "Lyon", value: 1000000, surface: 300 },
    { type: "hotel", location: "Marseille", value: 2000000, surface: 500 },
    { type: "maison", location: "Bordeaux", value: 600000, surface: 140 },
    { type: "gare", location: "Toulouse", value: 1100000, surface: 320 },
    { type: "hotel", location: "Nice", value: 2500000, surface: 550 },
    { type: "maison", location: "Nantes", value: 550000, surface: 130 },
    { type: "gare", location: "Strasbourg", value: 1200000, surface: 350 },
    { type: "hotel", location: "Lille", value: 2700000, surface: 600 },
    { type: "maison", location: "Rennes", value: 580000, surface: 135 },
  ];

  // 🗑️ Supprimer toutes les propriétés mintée
  await deleteAllProperties(realEstate);

  // 🏗️ 1. Mint des propriétés
   await mintProperties(realEstate, properties);

  // 🏠 2. Vérifier le total de propriétés mintées

  const totalSupply = await realEstate.totalSupply();
  console.log(`\n🏠 Total de propriétés mintées : ${totalSupply.toString()}`);

  // 📜 3. Récupérer la liste de toutes les propriétés
  await getAllProperties(realEstate);

  // 🔍 4. Récupérer les détails de la propriété #0
  await getPropertyDetails(realEstate, 0);

  // 🔄 5. Transférer une propriété à `user1`
  await transferProperty(realEstate, deployer, user1, 0);
}

/**
 * 🔹 Mint plusieurs propriétés sur la blockchain
 */
const DEFAULT_IMAGE_URL = "https://na-antony.fr/wp-content/uploads/2020/04/propri%C3%A9t%C3%A9-immobili%C3%A8re.jpg";

async function mintProperties(contract, properties) {
    console.log("\n🏗️ Minting des propriétés...");

    for (let i = 0; i < properties.length; i++) {
        const { type, location, value, surface } = properties[i];

        try {
            // 📌 Utiliser l'image par défaut si aucune image n'est fournie
            const imageUrl = DEFAULT_IMAGE_URL;

            const txMint = await contract.mintProperty(
                type,
                location,
                value,
                surface,
                `https://fake-documents.com/${i}`,
                imageUrl, // Image IPFS ou par défaut
                `https://fake-metadata.com/${i}`
            );

            await txMint.wait();
            console.log(`✅ Propriété ${i + 1} (${type} à ${location}) mintée avec image !`);
        } catch (error) {
            console.error(`❌ Échec du minting pour ${type} à ${location} :`, error);
        }
    }
}


/**
 * 📜 Récupère la liste de toutes les propriétés mintées
 */
async function getAllProperties(contract) {
  console.log("\n📜 Récupération de la liste de toutes les propriétés...");
  try {
    const totalSupply = await contract.totalSupply();
    let allProperties = [];

    for (let i = 0; i < totalSupply; i++) {
      const property = await contract.getPropertyDetails(i);
      allProperties.push({ id: i, ...property });
    }

    console.log("\n🏡 Liste des propriétés disponibles :");
    console.table(allProperties);
  } catch (error) {
    console.error("❌ Impossible de récupérer la liste des propriétés :", error);
  }
}

/**
 * 🔍 Récupère les détails d'une propriété spécifique
 */
async function getPropertyDetails(contract, tokenId) {
  console.log(`\n🔍 Récupération des détails de la propriété ${tokenId}...`);
  try {
    const propertyDetails = await contract.getPropertyDetails(tokenId);
    console.log("🏡 Détails du bien :", propertyDetails);
  } catch (error) {
    console.error(`❌ Impossible de récupérer les détails du bien ${tokenId} :`, error);
  }
}

/**
 * 🔄 Transfère une propriété d'un propriétaire à un autre
 */
/**
 * 🔄 Transfère une propriété d'un propriétaire à un autre
 */
async function transferProperty(contract, sender, receiver, tokenId) {
  console.log(`\n🔄 Vérification du propriétaire actuel du bien ${tokenId}...`);

  try {
    const currentOwner = await contract.ownerOf(tokenId);
    console.log(`👤 Propriétaire actuel : ${currentOwner}`);

    if (currentOwner.toLowerCase() !== sender.address.toLowerCase()) {
      console.error(`❌ ERREUR : ${sender.address} n'est pas le propriétaire du bien ${tokenId}`);
      return;
    }

    console.log(`\n🔄 Transfert de la propriété ${tokenId} à ${receiver.address}...`);
    const txTransfer = await contract.connect(sender).transferProperty(receiver.address, tokenId);
    await txTransfer.wait();
    console.log(`✅ Propriété ${tokenId} transférée à ${receiver.address} !`);
  } catch (error) {
    console.error(`❌ Échec du transfert du bien ${tokenId} :`, error);
  }


}

/* Supprimer toutes les propriétés mintées */
async function deleteAllProperties(contract) {
  console.log("\n🗑️ Suppression de toutes les propriétés...");

  try {
      const tx = await contract.deleteAllProperties();
      await tx.wait();
      console.log("✅ Toutes les propriétés ont été supprimées !");
  } catch (error) {
      console.error("❌ Erreur lors de la suppression des propriétés :", error);
  }
}



// 🚀 Lancer l'interaction
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erreur générale :", error);
    process.exit(1);
  });
