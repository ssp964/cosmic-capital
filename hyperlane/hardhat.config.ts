import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    ...(process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.length === 64 ? {
      polygonAmoy: {
        url: process.env.POLYGON_AMOY_RPC || "https://rpc-amoy.polygon.technology",
        accounts: [process.env.PRIVATE_KEY]
      },
      scrollSepolia: {
        url: process.env.SCROLL_RPC || "https://sepolia-rpc.scroll.io",
        accounts: [process.env.PRIVATE_KEY]
      },
      sepolia: {
        url: process.env.SEPOLIA_RPC || "https://sepolia.infura.io/v3/your-project-id",
        accounts: [process.env.PRIVATE_KEY]
      },
      baseSepolia: {
        url: process.env.BASE_SEPOLIA_RPC || "https://sepolia.base.org",
        accounts: [process.env.PRIVATE_KEY]
      },
      flowTestnet: {
        url: process.env.FLOW_TESTNET_RPC || "https://testnet.evm.nodes.onflow.org",
        accounts: [process.env.PRIVATE_KEY]
      }
    } : {})
  }
};

export default config;
