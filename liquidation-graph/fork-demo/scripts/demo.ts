import { ethers, network } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Signer:", deployer.address);

  const POOL  = "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2";
  const WETH  = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";


  // Chainlink USDC/ETH price feed (18 decimals)
  const USDC_ETH_FEED = "0x986b5E1e1755e3C2440e960477f25201B0a8bbD4";

  // ------------------
  // Wrap 1 ETH → WETH
  // ------------------
  const weth = new ethers.Contract(
    WETH,
    ["function deposit() payable", "function approve(address,uint256)"],
    deployer
  );
  console.log("Wrapping 1 ETH into WETH...");
  await (await weth.deposit({ value: ethers.parseEther("1") })).wait();
  console.log("✅ Wrapped");

  // ------------------
  // Supply 1 WETH
  // ------------------
  const pool = new ethers.Contract(
    POOL,
    ["function supply(address,uint256,address,uint16)",
     "function borrow(address,uint256,uint256,uint16,address)",
     "function liquidationCall(address,address,address,uint256,bool)"],
    deployer
  );

  console.log("Supplying 1 WETH...");
  await (await pool.supply(WETH, ethers.parseEther("1"), deployer.address, 0,
    { gasPrice: ethers.parseUnits("50","gwei") })).wait();
  console.log("✅ Supply completed");

  // ------------------
  // Borrow 1000 USDC
  // ------------------
  console.log("Borrowing 1000 USDC...");
  await (await pool.borrow(
      USDC,
      ethers.parseUnits("1000",6),
      2,                  // variable rate
      0,
      deployer.address,
      { gasPrice: ethers.parseUnits("50","gwei") }
  )).wait();
  console.log("✅ Borrowed");

  // ------------------------------------------------------------------
  // Manipulate oracle feed (USDC/ETH) to make USDC very expensive
  // ------------------------------------------------------------------
  // The Chainlink price feed stores the price in slot #0
  // We'll override slot 0 with e.g. 10 * 1e18  (i.e. 1 USDC = 10 ETH 😈)
  // ------------------------------------------------------------------
// Manipulate oracle feed (USDC/ETH) to make USDC very expensive
// ------------------------------------------------------------------
// -------------------------------------------









}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
