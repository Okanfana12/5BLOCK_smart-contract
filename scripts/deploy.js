// scripts/deploy.js
const hre = require('hardhat');

async function main() {
  // We get the contract to deploy
  const RealEstate = await hre.ethers.getContractFactory('RealEstate');
  console.log('Deploying RealEstate...');

  // Deploy the contract
  const realEstate = await RealEstate.deploy();

  // Wait for the contract to be deployed
  await realEstate.waitForDeployment();

  // Get the address of the deployed contract
  const realEstateAddress = await realEstate.getAddress();
  console.log('RealEstate deployed to:', realEstateAddress);
}

// Run the deployment script
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
