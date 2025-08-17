const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying from:", deployer.address);

  // 1. Deploy TestToken
  const TestToken = await ethers.getContractFactory("TestToken");
  const token = await TestToken.deploy(ethers.utils.parseEther("1000"));
  await token.deployed();
  console.log("TestToken deployed:", token.address);

  // 2. Deploy DepositRouter
  const inboxAddress = "0x40dc812035df1069157c03c023458a2e9f37a76f"; // Polygon Amoy Mailbox
  const destinationDomain = 1434846526; // Scroll Sepolia (domain id)
  const receiverRouter = "0xRECEIVER_ROUTER_ADDRESS_ON_SCROLL"; // <-- replace after deploying receiver

  const DepositRouter = await ethers.getContractFactory("DepositRouter");
  const router = await DepositRouter.deploy(
    token.address,
    inboxAddress,
    destinationDomain,
    receiverRouter
  );
  await router.deployed();
  console.log("DepositRouter deployed:", router.address);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
