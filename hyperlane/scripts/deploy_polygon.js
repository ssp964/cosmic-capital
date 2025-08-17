const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying from:", deployer.address);
  

  // 1. Deploy TestToken
  const TestToken = await ethers.getContractFactory("TestToken");
  const initialSupply = ethers.parseEther("1000");
  const token = await TestToken.deploy(initialSupply);
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("TestToken deployed:", tokenAddress);

  // 2. Deploy DepositRouter
  const inboxAddress = "0x40dc812035df1069157c03c023458a2e9f37a76f"; // Polygon Amoy Mailbox
  const destinationDomain = 1434846526; // Scroll Sepolia (domain id)
  const receiverRouter = "0x69A4804c806551228A7E78090d54cC07Df0c3208"; // <-- replace after deploying receiver

  const DepositRouter = await ethers.getContractFactory("DepositRouter");
  const router = await DepositRouter.deploy(
    tokenAddress,
    inboxAddress,
    destinationDomain,
    receiverRouter
  );
  await router.waitForDeployment();
  const routerAddress = await router.getAddress();
  console.log("DepositRouter deployed:", routerAddress);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
