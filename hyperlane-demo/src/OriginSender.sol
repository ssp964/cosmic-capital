// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @notice Minimal Hyperlane Mailbox interface
interface IMailbox {
    /// @return messageId The ID of the dispatched message.
    function dispatch(
        uint32 destinationDomain,
        bytes32 recipientAddress,
        bytes calldata messageBody
    ) external returns (bytes32);
}

/// @notice Utility to cast EVM address <-> bytes32 (Hyperlane expects bytes32)
library AddressCast {
    function toBytes32(address a) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(a)));
    }
    function toAddress(bytes32 b) internal pure returns (address) {
        return address(uint160(uint256(b)));
    }
}

/**
 * @title OriginSender
 * @dev Sends liquidation trigger messages to a destination (Hedera) via Hyperlane Mailbox.
 */
contract OriginSender {
    IMailbox public immutable MAILBOX;
    uint32 public immutable DEST_DOMAIN;
    bytes32 public immutable DEST_APP; // HederaReceiver address, left-padded to bytes32

    event LiquidationTriggered(address indexed user, bytes32 messageId);

    constructor(address mailbox, uint32 destDomain, address destApp) {
        require(mailbox != address(0), "mailbox=0");
        require(destApp != address(0), "destApp=0");
        MAILBOX = IMailbox(mailbox);
        DEST_DOMAIN = destDomain;
        DEST_APP = AddressCast.toBytes32(destApp);
    }

    /// @notice Called by your bot/UI when a user/position becomes risky
    function triggerLiquidation(address user) external {
        // You can add more fields later: positionId, oraclePrice, deadlines, etc.
        bytes memory body = abi.encode(user, block.timestamp);
        bytes32 id = MAILBOX.dispatch(DEST_DOMAIN, DEST_APP, body);
        emit LiquidationTriggered(user, id);
    }
}
