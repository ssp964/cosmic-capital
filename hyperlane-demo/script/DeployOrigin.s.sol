// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/OriginSender.sol";

contract DeployOrigin is Script {
    function run() external {
        address mailbox = vm.envAddress("ORIGIN_MAILBOX");
        uint32 destDomain = uint32(vm.envUint("DEST_DOMAIN"));
        address destApp = vm.envAddress("DEST_APP"); // we’ll set after deploying HederaReceiver

        vm.startBroadcast(vm.envUint("ORIGIN_PRIVATE_KEY"));
        OriginSender sender = new OriginSender(mailbox, destDomain, destApp);
        vm.stopBroadcast();

        console2.log("OriginSender deployed at:", address(sender));
    }
}
