import Bank from 0xBANK
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868

transaction(amount: UFix64) {
    prepare(acct: AuthAccount) {
        let vaultRef = acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Could not borrow reference to FlowToken vault")

        let tempVault <- vaultRef.withdraw(amount: amount)
        Bank.increaseBalance(address: acct.address, amount: amount)
        destroy tempVault
    }
}
