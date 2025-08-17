const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [signer] = await ethers.getSigners();

  // Flow TestToken + DepositRouter addresses
  const tokenAddress  = "0x31139e4E8C626Cc3a71a7f1Ad2DfD6e2aE8bee7D"; // <-- TestToken on Flow
  const routerAddress = "0x79Ea55CfD6BAf4301C00b7d0af4DBb7bB505a51C"; // <-- DepositRouter on Flow
  

  const Token  = await ethers.getContractAt("ERC20", tokenAddress, signer);
  const amount = ethers.parseEther("10");

  const tx = await Token.approve(
    routerAddress,
    amount,
    {
      gasPrice: ethers.parseUnits("0.01", "gwei"),
      gasLimit: 40000               // safe minimum for approve()
    }
  );
  await tx.wait();

  console.log("✅ Approved", ethers.formatEther(amount), "TTK to router");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
