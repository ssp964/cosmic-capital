# Bank Contract – Flow Testnet

This repository contains a simple **Bank smart contract** written in **Cadence**.  
The contract allows any Flow account to:

- Deposit FLOW into the contract
- Withdraw previously deposited flow

---

## 📂 Project Structure

| Path | Description |
|------|------------|
| `contracts/Bank.cdc` | Cadence smart contract |
| `transactions/deposit.cdc` | Deposit transaction |
| `transactions/withdraw.cdc` | Withdraw transaction |

---

## 🚀 Deployment

The contract was deployed to **Flow Testnet** using the Flow CLI:

```bash
flow deploy --network testnet
```

## Deployment Output

Bank -> 0x087c5036690ea20b (815d94efac6dc6cc8e8b75831ec4bb5116bb2bfc4c2f3a59d45561ffa202a8af)


Contract Address: 0x087c5036690ea20b
Network: Flow Testnet
Deployed in Block: 815d94efac6dc6cc8e8b75831ec4bb5116bb2bfc4c2f3a59d45561ffa202a8af


Link: https://testnet.flowscan.io/account/0x087c5036690ea20b 

https://testnet.flowscan.io/tx/815d94efac6dc6cc8e8b75831ec4bb5116bb2bfc4c2f3a59d45561ffa202a8af
