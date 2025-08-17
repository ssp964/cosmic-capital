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
        accounts: [process.env.PRIVATE_KEY],
      },
      scrollSepolia: {
        url: process.env.SCROLL_RPC || "https://sepolia-rpc.scroll.io",
        accounts: [process.env.PRIVATE_KEY]
      }
    } : {})
  }
};

export default config;
