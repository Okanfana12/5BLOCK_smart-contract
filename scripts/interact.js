const hre = require('hardhat');

async function main() {
  const [deployer, user1] = await hre.ethers.getSigners();
  const contractAddress = '0xc351628EB244ec633d5f21fBD6621e1a683B1181';

  // Vérifier que l'adresse du contrat est correcte
  if (!contractAddress) {
    throw new Error('❌ Adresse du contrat non définie !');
  }

  // Récupérer une instance du contrat
  const RealEstate = await hre.ethers.getContractFactory('RealEstate');
  const realEstate = await RealEstate.attach(contractAddress);

  console.log(`📌 Interaction avec le contrat déployé à ${contractAddress}`);

  // 🔹 Liste des propriétés à créer
  const properties = [
    { type: 'maison', location: 'Paris', value: 500000, surface: 120 },
    { type: 'gare', location: 'Lyon', value: 1000000, surface: 300 },
    { type: 'hotel', location: 'Marseille', value: 2000000, surface: 500 },
    { type: 'maison', location: 'Bordeaux', value: 600000, surface: 140 },
    { type: 'gare', location: 'Toulouse', value: 1100000, surface: 320 },
    { type: 'hotel', location: 'Nice', value: 2500000, surface: 550 },
    { type: 'maison', location: 'Nantes', value: 550000, surface: 130 },
    { type: 'gare', location: 'Strasbourg', value: 1200000, surface: 350 },
    { type: 'hotel', location: 'Lille', value: 2700000, surface: 600 },
    { type: 'maison', location: 'Rennes', value: 580000, surface: 135 },
  ];

  console.log('\n🏗️ Minting de 10 propriétés...');
  // for (let i = 0; i < properties.length; i++) {
  //   const { type, location, value, surface } = properties[i];

  //   try {
  //     const txMint = await realEstate.mintProperty(
  //       type,
  //       location,
  //       value,
  //       surface,
  //       `https://fake-documents.com/${i}`,
  //       `https://fake-images.com/${i}`,
  //       `https://fake-metadata.com/${i}`,
  //     );
  //     await txMint.wait();
  //     console.log(`✅ Propriété ${i + 1} (${type} à ${location}) mintée !`);
  //   } catch (error) {
  //     console.error(`❌ Échec du minting pour ${type} à ${location} :`, error);
  //   }
  // }

  // Vérifier combien de propriétés ont été mintées
  const totalSupply = await realEstate.totalSupply();
  console.log(`\n🏠 Total de propriétés mintées : ${totalSupply.toString()}`);

  // Vérifier que le token existe avant de récupérer les détails
  const tokenId = 0;
  if (tokenId >= totalSupply) {
    console.error(`❌ Le token ${tokenId} n'existe pas encore.`);
    return;
  }

  // 🔹 Récupérer les détails d'une propriété
  console.log(`\n🔍 Récupération des détails de la propriété ${tokenId}...`);
  try {
    const propertyDetails = await realEstate.getPropertyDetails(tokenId);
    console.log('🏡 Détails du bien :', propertyDetails);
  } catch (error) {
    console.error(`❌ Impossible de récupérer les détails du bien ${tokenId} :`, error);
    return;
  }

  // 🔹 Transférer une propriété
  console.log(`\n🔄 Transfert de la propriété ${tokenId} à ${user1.address}...`);
  try {
    const txTransfer = await realEstate.connect(deployer).transferProperty(user1.address, tokenId);
    await txTransfer.wait();
    console.log(`✅ Propriété ${tokenId} transférée à ${user1.address} !`);
  } catch (error) {
    console.error(`❌ Échec du transfert du bien ${tokenId} :`, error);
  }

  // 🔹 Échanger des propriétés (3 maisons = 1 gare)
  console.log('\n🔄 Échange de 3 maisons contre 1 gare...');
  try {
    // Mint 3 maisons supplémentaires pour l'échange
    for (let i = 0; i < 3; i++) {
      const txMint = await realEstate.mintProperty(
        'maison',
        `Ville ${i}`,
        500000,
        120,
        `https://fake-documents.com/house${i}`,
        `https://fake-images.com/house${i}`,
        `https://fake-metadata.com/house${i}`,
      );
      await txMint.wait();
      console.log(`✅ Maison ${i + 1} mintée pour l'échange !`);
    }

    // Récupérer les IDs des 3 maisons
    const houseIds = [totalSupply, totalSupply + 1, totalSupply + 2];

    // Effectuer l'échange
    const txExchange = await realEstate.exchangeProperties(houseIds, 'gare');
    await txExchange.wait();
    console.log('✅ Échange réussi : 3 maisons ont été échangées contre 1 gare !');
  } catch (error) {
    console.error("❌ Échec de l'échange :", error);
  }
}

// Lancer l’interaction
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Erreur générale :', error);
    process.exit(1);
  });
