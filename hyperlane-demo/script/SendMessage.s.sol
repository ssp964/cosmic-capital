// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/OriginSender.sol";

contract SendMessage is Script {
    function run() external {
        address originSender = vm.envAddress("ORIGIN_SENDER");
        address riskyUser = vm.envAddress("TEST_USER");

        vm.startBroadcast(vm.envUint("ORIGIN_PRIVATE_KEY"));
        OriginSender(originSender).triggerLiquidation(riskyUser);
        vm.stopBroadcast();
    }
}
