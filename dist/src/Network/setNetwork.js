"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setNetworkAsync = exports.setNetwork = void 0;
const network_1 = require("@/Network/network");
const eventEmitter_1 = require("@/Network/eventEmitter");
const Erc20_1 = require("@/Asset/Erc20");
function setNetwork(conf) {
    (0, network_1.setRpcNetwork)(conf);
    (0, eventEmitter_1.emitNetworkChange)(conf);
    (0, Erc20_1.bustErc20Cache)();
}
exports.setNetwork = setNetwork;
/**
 * Unlike `setNetwork` this function will fail if the network is not available.
 * @param conf
 */
async function setNetworkAsync(conf) {
    await (0, network_1.setRpcNetworkAsync)(conf);
    (0, eventEmitter_1.emitNetworkChange)(conf);
    (0, Erc20_1.bustErc20Cache)();
}
exports.setNetworkAsync = setNetworkAsync;
//# sourceMappingURL=setNetwork.js.map