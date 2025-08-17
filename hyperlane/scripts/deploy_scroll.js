const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying from:", deployer.address);

  // 1. Deploy TestToken first
  const TestToken = await ethers.getContractFactory("TestToken");
  const initialSupply = ethers.parseEther("1000"); // 1000 TTK
  const token = await TestToken.deploy(initialSupply);
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("TestToken deployed:", tokenAddress);

  // 2. Deploy StakingPool
  const StakingPool = await ethers.getContractFactory("StakingPool");
  const pool = await StakingPool.deploy(tokenAddress);
  await pool.waitForDeployment();
  const poolAddress = await pool.getAddress();
  console.log("StakingPool deployed:", poolAddress);

  // 3. Deploy ReceiverRouter
  const originDomain = 1818848877; // Polygon Amoy domain Id
  const ReceiverRouter = await ethers.getContractFactory("ReceiverRouter");
  const receiver = await ReceiverRouter.deploy(
    tokenAddress,
    poolAddress,
    originDomain
  );
  await receiver.waitForDeployment();
  const receiverAddress = await receiver.getAddress();
  console.log("ReceiverRouter deployed:", receiverAddress);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
