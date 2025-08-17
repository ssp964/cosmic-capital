const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying from (Base Sepolia):", deployer.address);

  // 1. Deploy TestToken (local copy on destination)
  const TestToken = await ethers.getContractFactory("TestToken");
  const token = await TestToken.deploy(ethers.parseEther("1"));
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("TestToken (Base) deployed:", tokenAddress);

  // 2. Deploy StakingPool
  const StakingPool = await ethers.getContractFactory("StakingPool");
  const pool = await StakingPool.deploy(tokenAddress, {
    gasPrice: ethers.parseUnits("0.1", "gwei"), // Lower gas price
    gasLimit: 500000 // Higher gas limit
  });
  await pool.waitForDeployment();
  const poolAddress = await pool.getAddress();
  console.log("StakingPool deployed:", poolAddress);

  // 3. Deploy ReceiverRouter
  const originDomain = 541541;              // Flow domainId from metadata.yaml
  const ReceiverRouter = await ethers.getContractFactory("ReceiverRouter");
  const receiver = await ReceiverRouter.deploy(tokenAddress, poolAddress, originDomain, {
    gasPrice: ethers.parseUnits("0.1", "gwei"), // Lower gas price
    gasLimit: 500000 // Higher gas limit
  });
  await receiver.waitForDeployment();
  const receiverAddress = await receiver.getAddress();
  console.log("ReceiverRouter deployed:", receiverAddress);
}

main().catch(console.error);
