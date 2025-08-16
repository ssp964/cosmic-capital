// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/HederaReceiver.sol";

contract DeployHedera is Script {
    function run() external {
        address mailbox = vm.envAddress("HEDERA_MAILBOX");

        vm.startBroadcast(vm.envUint("HEDERA_PRIVATE_KEY"));
        HederaReceiver recv = new HederaReceiver(mailbox);
        vm.stopBroadcast();

        console2.log("HederaReceiver deployed at:", address(recv));
    }
}
