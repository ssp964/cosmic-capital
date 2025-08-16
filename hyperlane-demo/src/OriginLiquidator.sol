// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IMailbox {
    function dispatch(
        uint32 destinationDomain,
        bytes32 recipientAddress,
        bytes calldata messageBody
    ) external returns (bytes32);
}

library AddressCast {
    function toBytes32(address a) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(a)));
    }
}

contract OriginLiquidator {
    IMailbox public immutable MAILBOX;
    uint32  public immutable DEST_DOMAIN;
    bytes32 public immutable DEST_APP;

    event LiquidationTriggered(address indexed user, bytes32 messageId);

    constructor(address mailbox, uint32 destDomain, address destApp) {
        require(mailbox != address(0), "mailbox=0");
        require(destApp != address(0), "destApp=0");
        MAILBOX = IMailbox(mailbox);
        DEST_DOMAIN = destDomain;
        DEST_APP = AddressCast.toBytes32(destApp);
    }

    function triggerLiquidation(address user) external {
        bytes memory body = abi.encode(user, block.timestamp);
        bytes32 id = MAILBOX.dispatch(DEST_DOMAIN, DEST_APP, body);
        emit LiquidationTriggered(user, id);
    }
}
