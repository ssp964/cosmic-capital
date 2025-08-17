// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract StakingPool {
    IERC20 public token;

    mapping(address => uint256) public stakedBalance;

    constructor(address _token) {
        token = IERC20(_token);
    }

    function stake(address user, uint256 amount) external {
        // pull tokens from caller (in our flow, ReceiverRouter will call this)
        token.transferFrom(msg.sender, address(this), amount);
        stakedBalance[user] += amount;
    }

    function balanceOf(address user) external view returns (uint256) {
        return stakedBalance[user];
    }
}
