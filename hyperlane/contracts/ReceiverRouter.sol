// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@hyperlane-xyz/core/contracts/interfaces/IInterchainGasPaymaster.sol";
import "@hyperlane-xyz/core/contracts/interfaces/IMailbox.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IStakingPool {
    function stake(address user, uint256 amount) external;
}

contract ReceiverRouter {
    address public tokenAddress;      // Token on Scroll (same token if bridged via Hyperlane)
    address public stakingPool;
    uint32  public originDomain;      // Polygon Amoy domain id

    constructor(
        address _token,
        address _stakingPool,
        uint32  _originDomain
    ) {
        tokenAddress = _token;
        stakingPool  = _stakingPool;
        originDomain = _originDomain;
    }

    // Hyperlane calls this function when a message arrives
    function handle(
        uint32 _origin,
        bytes32 /* sender */,
        bytes calldata _message
    ) external {
        require(_origin == originDomain, "Invalid origin");

        (address user, uint256 amount) = abi.decode(_message, (address, uint256));

        // Transfer the bridged tokens to staking pool and stake for user
        IERC20(tokenAddress).approve(stakingPool, amount);
        IStakingPool(stakingPool).stake(user, amount);
    }
}
