const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Current balance:", hre.ethers.formatEther(balance), "ETH");
  
  // Get current gas price
  const gasPrice = await hre.ethers.provider.getFeeData();
  console.log("Current gas price:", hre.ethers.formatUnits(gasPrice.gasPrice, "gwei"), "gwei");
  
  // Estimate gas for TestToken deployment
  const TestToken = await hre.ethers.getContractFactory("TestToken");
  const initialSupply = hre.ethers.parseEther("1000");
  const tokenGasEstimate = await hre.ethers.provider.estimateGas(
    TestToken.getDeployTransaction(initialSupply)
  );
  
  // Estimate gas for DepositRouter deployment
  const DepositRouter = await hre.ethers.getContractFactory("DepositRouter");
  const inboxAddress = "0x40dc812035df1069157c03c023458a2e9f37a76f";
  const destinationDomain = 1434846526;
  const receiverRouter = "0x69A4804c806551228A7E78090d54cC07Df0c3208";
  
  const routerGasEstimate = await hre.ethers.provider.estimateGas(
    DepositRouter.getDeployTransaction(
      "0x0000000000000000000000000000000000000000", // placeholder
      inboxAddress,
      destinationDomain,
      receiverRouter
    )
  );
  
  const totalGas = tokenGasEstimate + routerGasEstimate;
  const totalCost = totalGas * gasPrice.gasPrice;
  
  console.log("\nGas Estimates:");
  console.log("TestToken deployment:", tokenGasEstimate.toString(), "gas");
  console.log("DepositRouter deployment:", routerGasEstimate.toString(), "gas");
  console.log("Total gas needed:", totalGas.toString(), "gas");
  console.log("Total cost:", hre.ethers.formatEther(totalCost), "ETH");
  
  const needed = totalCost - balance;
  if (needed > 0) {
    console.log("Additional ETH needed:", hre.ethers.formatEther(needed), "ETH");
  } else {
    console.log("Sufficient balance for deployment!");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
