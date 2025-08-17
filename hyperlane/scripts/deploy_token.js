const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Compile contracts
  await hre.run('compile');

  // Deploy TestToken
  const TestToken = await hre.ethers.getContractFactory("TestToken");
  const initialSupply = hre.ethers.parseEther("1000"); // 1000 TTK
  const token = await TestToken.deploy(initialSupply);

  await token.deployed();
  console.log("TestToken deployed to:", token.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
