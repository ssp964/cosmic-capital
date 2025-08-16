# 🌌 Cosmic Capital

A cross-chain **liquidation bot** that keeps lenders safe by detecting risky loans on Ethereum and liquidating them instantly on Hedera.  

---

## 🚨 Problem

In DeFi lending, people deposit crypto (e.g. ETH) as collateral and borrow stablecoins (e.g. USDC).  

- If ETH price drops too much, the loan becomes risky.  
- Someone needs to liquidate (sell) the ETH quickly, or lenders lose money.  
- On Ethereum, this process is **slow + expensive** — liquidations can be delayed, causing losses.  

---

## 💡 Our Solution

Instead of liquidating on the slow chain, we:

1. **Monitor loans** across Ethereum using **The Graph**.  
2. **Detect risks** when health factor < 1.  
3. **Send secure messages** via **Hyperlane** to Hedera.  
4. **Execute liquidation** instantly on **Hedera (fast + cheap)**.  

✅ Faster + cheaper liquidations = safer lenders + more stable DeFi ecosystem.  

---

## 🔗 High-Level Flow

```
User deposits ETH → Borrows USDC
     ↓
The Graph monitors health factor
     ↓
Trigger Script detects risk
     ↓
Hyperlane sends liquidation message
     ↓
Hedera contract receives + calls Aave’s liquidation
     ↓
Collateral sold → Debt cleared → Lender safe
```

---

## 🧑‍🤝‍🧑 Team Roles

### 🧑‍💻 Team Member A — The Graph / Monitoring  
- Build subgraph to index loans (owner, collateral, debt, healthFactor).  
- Expose API: `cdps(where: { healthFactor_lt: "1" }) { id, owner }`.  

### 🧑‍🔬 Team Member B — Hyperlane Messaging  
- Write origin contract `triggerLiquidation()`.  
- Dispatch payload `{user, debt}` from Ethereum → Hedera.  

### 🧑‍🏭 Team Member C — Hedera Liquidation Contract  
- Receive Hyperlane message.  
- Call Aave’s `liquidationCall()` via Interchain Accounts.  

### 🧑‍🎨 Team Member D — Trigger Logic + Integration  
- Poll subgraph endpoint.  
- If risky → call `triggerLiquidation()`.  
- Run integration tests (simulate liquidation).  

---

## 🛠️ Tech Stack

- **The Graph** → loan monitoring (real-time subgraph).  
- **Hyperlane** → secure cross-chain messaging.  
- **Hedera EVM** → fast liquidation execution.  
- **Node.js / TypeScript** → trigger + integration scripts.  

---

## 📦 Setup Guide

### 1. Clone Repo
```bash
git clone https://github.com/<your-org>/cosmic-capital.git
cd cosmic-capital
```

### 2. Subgraph (Team A)
- Define schema in `schema.graphql`.  
- Write mappings in `mappings.ts`.  
- Deploy with:  
```bash
graph deploy --studio cosmic-capital
```

### 3. Origin Contract (Team B)
Deploy `OriginLiquidationSender.sol` on Ethereum testnet (Sepolia).  

### 4. Hedera Receiver (Team C)
Deploy `HederaLiquidationReceiver.sol` on Hedera testnet.  

### 5. Trigger Script (Team D)
Run polling bot:  
```bash
npm install
npm run trigger
```

---

## 🔧 Example API Call

Query liquidatable loans:
```graphql
{
  cdps(where: { healthFactor_lt: "1" }) {
    id
    owner
    debt
    healthFactor
  }
}
```

Sample Response:
```json
{
  "id": "0x00000015e180b01c40b881e10774bc784bb6f4eb",
  "owner": "0x00000015e180b01c40b881e10774bc784bb6f4eb",
  "debt": "1010000000000000000",
  "healthFactor": "-1009999999998.5"
}
```

---

## 🎯 Why It Matters

- **Protects lenders** from losses.  
- **Faster + cheaper** than Ethereum-only solutions.  
- **Modular design** — works with any lending protocol (Aave, Compound).  
- **Hackathon-ready**: clear team breakdown, demo flow, and integration tests.  

---

## 📚 References
- [The Graph Docs](https://thegraph.com/docs/en/)  
- [Hyperlane Docs](https://docs.hyperlane.xyz/)  
- [Hedera EVM Guide](https://docs.hedera.com/hedera/getting-started-hedera-native-developers)  

---

✨ Built for ETHGlobal Hackathon 2025 — by the **Cosmic Capital Team** 🚀  
