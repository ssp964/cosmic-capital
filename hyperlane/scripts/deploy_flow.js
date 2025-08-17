const hre   = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying from (Flow):", deployer.address);

  // 1. Deploy TestToken on Flow
  const TestToken = await ethers.getContractFactory("TestToken");
  const token = await TestToken.deploy(ethers.parseEther("10")); // mint 10 TTK to wallet
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("TestToken (Flow) deployed at:", tokenAddress);

  // 2. Deploy DepositRouter on Flow
  const inboxAddress     = "0x53cBf97c654709D608fD291A9901B370d3b8e164"; // Flow Mailbox
  const destinationDomain = 84532; // <-- Base Sepolia domainId in Hyperlane
  const receiverRouter    = "0x69A4804c806551228A7E78090d54cC07Df0c3208"; // (replace after deploying on Base)

  const DepositRouter = await ethers.getContractFactory("DepositRouter");
  const router = await DepositRouter.deploy(
    tokenAddress,
    inboxAddress,
    destinationDomain,
    receiverRouter
  );
  await router.waitForDeployment();
  console.log("DepositRouter (Flow) deployed at:", await router.getAddress());
}

main().catch(console.error);
