// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @notice Minimal recipient interface Hyperlane calls into
interface IMessageRecipient {
    function handle(uint32 origin, bytes32 sender, bytes calldata body) external;
}

/**
 * @title HederaReceiver
 * @dev Receives and verifies messages from Hyperlane's Mailbox on Hedera.
 *
 * SECURITY NOTE:
 *  - We restrict calls to only come from the known Hedera Mailbox address.
 *  - For hackathons, default ISM is OK. For production, implement custom ISM if needed.
 */
contract HederaReceiver is IMessageRecipient {
    address public immutable MAILBOX;

    event MessageReceived(
        uint32 indexed originDomain,
        bytes32 indexed senderBytes32,
        address decodedUser,
        uint256 timestamp
    );

    modifier onlyMailbox() {
        require(msg.sender == MAILBOX, "not mailbox");
        _;
    }

    constructor(address mailbox) {
        require(mailbox != address(0), "mailbox=0");
        MAILBOX = mailbox;
    }

    /// @dev Hyperlane relayer calls this via the Mailbox
    function handle(uint32 origin, bytes32 sender, bytes calldata body) external onlyMailbox {
        (address user, uint256 ts) = abi.decode(body, (address, uint256));
        emit MessageReceived(origin, sender, user, ts);
        // TODO: store, kick off auction, etc.
    }

    // OPTIONAL: If you later set a custom ISM, expose it via this method:
    // function interchainSecurityModule() external view returns (address) { return address(0); }
}
