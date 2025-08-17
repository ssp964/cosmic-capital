const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  // ---- FLOW (origin) ----
  const originProvider = new ethers.providers.JsonRpcProvider(process.env.FLOW_RPC);
  const originSigner = new ethers.Wallet(process.env.PRIVATE_KEY, originProvider);

  const tokenAddress   = "0x<Flow TestToken address>";
  const routerAddress  = "0x<Flow DepositRouter address>";

  const Token         = await ethers.getContractAt("ERC20", tokenAddress, originSigner);
  const DepositRouter = await ethers.getContractAt("DepositRouter", routerAddress, originSigner);

  const user   = originSigner.address;
  const amount = ethers.parseEther("10");
  const payload = ethers.AbiCoder.defaultAbiCoder().encode(
    ["address","uint256"],
    [user, amount]
  );

  console.log("Dispatching message + bridging...");
  await (await DepositRouter.depositAndDispatch(amount, payload)).wait();
  console.log("✅ Dispatched. Waiting for relay (~60s)…");
  await new Promise(r => setTimeout(r, 60000));

  // ---- BASE SEPOLIA (destination) ----
  const destinationProvider = new ethers.providers.JsonRpcProvider("https://sepolia.base.org");
  const poolAddress = "0x<BaseSepolia StakingPool>";
  const StakingPool = await ethers.getContractAt("StakingPool", poolAddress, destinationProvider);

  const staked = await StakingPool.balanceOf(user);
  console.log("Staked on Base:", ethers.formatEther(staked), "TTK");
}

main().catch(console.error);
