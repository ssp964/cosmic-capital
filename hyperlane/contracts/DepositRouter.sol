// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@hyperlane-xyz/core/contracts/interfaces/IMailbox.sol";

contract DepositRouter {
    address public tokenAddress;
    address public mailboxAddress;     // Hyperlane Mailbox on origin chain
    uint32  public destinationDomain;  // Scroll Sepolia domain id
    address public receiverAddress;    // ReceiverRouter on Scroll

    constructor(
        address _token,
        address _mailbox,
        uint32  _destDomain,
        address _receiver
    ) {
        tokenAddress = _token;
        mailboxAddress = _mailbox;
        destinationDomain = _destDomain;
        receiverAddress = _receiver;
    }

    function depositAndDispatch(uint256 amount, bytes calldata payload) external payable {
        // Transfer tokens to this contract
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);

        // Approve Hyperlane mailbox to pull tokens if needed
        IERC20(tokenAddress).approve(mailboxAddress, amount);

        // Dispatch cross-chain message through Hyperlane
        IMailbox(mailboxAddress).dispatch(destinationDomain, bytes32(uint256(uint160(receiverAddress))), payload);
    }
}
