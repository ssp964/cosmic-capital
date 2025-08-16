
# Cosmic Capital

**Cosmic Capital** is a cross-chain liquidation engine that safeguards DeFi lending protocols by enabling rapid and cost-efficient liquidations. It monitors loan health using The Graph, identifies risky positions in real time, and executes liquidation through secure cross-chain messaging via Hyperlane — using Hedera as the execution layer for speed and affordability.

## 🌐 System Overview

- **The Graph**: Indexes real-time loan health data (collateral, debt, health factor) from Avalanche-based protocols  
- **Node.js Trigger Service**: Detects undercollateralized positions and initiates action  
- **Hyperlane**: Transmits secure cross-chain messages from Avalanche to Hedera  
- **Hedera EVM**: Executes liquidation logic with minimal latency and cost  
- **Next.js Frontend**: Displays loan metrics, liquidation status, and health factor visualizations  

## 🛠️ Tech Stack

- **Frontend**: Next.js, TailwindCSS  
- **Backend**: Node.js, TypeScript  
- **Cross-Chain Messaging**: Hyperlane  
- **Blockchain Networks**: Avalanche (origin), Hedera (destination)  
- **Indexing**: The Graph  
- **Infrastructure**: GraphQL, REST APIs, Avalanche Fuji Testnet, Hedera Testnet  

## 📜 License

MIT — Built to inspire future innovation in secure, cross-chain DeFi automation.
