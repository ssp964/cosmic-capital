const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Deploy TestToken only
  const TestToken = await hre.ethers.getContractFactory("TestToken");
  const initialSupply = hre.ethers.parseEther("1000"); // 1000 TTK
  const token = await TestToken.deploy(initialSupply);

  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("TestToken deployed to:", tokenAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
