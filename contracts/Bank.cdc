import FungibleToken from 0x9a0766d93b6608b7

access(all) contract Bank {

    access(self) var balances: {Address: UFix64}

    access(all) event Deposit(address: Address, amount: UFix64)
    access(all) event Withdraw(address: Address, amount: UFix64)

    init() {
        self.balances = {}
    }

    access(all) fun increaseBalance(address: Address, amount: UFix64) {
        self.balances[address] = (self.balances[address] ?? 0.0) + amount
        emit Deposit(address: address, amount: amount)
    }

    access(all) fun decreaseBalance(address: Address, amount: UFix64) {
        let current = self.balances[address] ?? 0.0
        assert(current >= amount, message: "Not enough balance")
        self.balances[address] = current - amount
        emit Withdraw(address: address, amount: amount)
    }

    access(all) fun getBalance(address: Address): UFix64 {
        return self.balances[address] ?? 0.0
    }
}
