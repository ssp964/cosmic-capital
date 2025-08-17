// Bank.cdc
//
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868

pub contract Bank {

    // Keep internal balance per user address
    //
    // NOTE: we use Address as key (not AuthAccount),
    // and store balances in FlowToken vault units (UFix64).
    //
    access(self) var balances: {Address: UFix64}

    // Events
    pub event Deposit(address: Address, amount: UFix64)
    pub event Withdraw(address: Address, amount: UFix64)

    init() {
        self.balances = {}
    }

    // Deposit Flow into the contract
    //
    // The user must pass in a FlowToken.Vault and we deposit the full amount.
    //
    pub fun deposit(from: @FlowToken.Vault) {
        let amount = from.balance
        destroy from

        let caller = AuthAccount(payer: signer).address

        self.balances[caller] = (self.balances[caller] ?? 0.0) + amount
        emit Deposit(address: caller, amount: amount)
    }

    // Withdraw Flow from contract to caller’s account
    //
    pub fun withdraw(amount: UFix64): @FlowToken.Vault {
        let caller = AuthAccount(payer: signer).address
        let currentBalance = self.balances[caller] ?? 0.0
        assert(amount > 0.0, message: "Amount must be > 0")
        assert(currentBalance >= amount, message: "Not enough balance")

        self.balances[caller] = currentBalance - amount
        emit Withdraw(address: caller, amount: amount)

        return <- FlowToken.createVault(amount: amount)
    }

    // Read-only getter
    pub fun getBalance(address: Address): UFix64 {
        return self.balances[address] ?? 0.0
    }
}
