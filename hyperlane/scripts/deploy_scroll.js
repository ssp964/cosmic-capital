const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying from:", deployer.address);

  // 1. Deploy StakingPool (token will be bridged to this chain later)
  const tokenAddress = "0xTOKEN_ADDRESS_ON_SCROLL"; // bridged token address or test token if manually deployed
  const StakingPool = await ethers.getContractFactory("StakingPool");
  const pool = await StakingPool.deploy(tokenAddress);
  await pool.deployed();
  console.log("StakingPool deployed:", pool.address);

  // 2. Deploy ReceiverRouter
  const originDomain = 1818848877; // Polygon Amoy domain Id
  const ReceiverRouter = await ethers.getContractFactory("ReceiverRouter");
  const receiver = await ReceiverRouter.deploy(
    tokenAddress,
    pool.address,
    originDomain
  );
  await receiver.deployed();
  console.log("ReceiverRouter deployed:", receiver.address);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
