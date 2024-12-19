"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveNetworkConfig = exports.getAvaxAssetID = exports.isLocalNetwork = exports.isMainnetNetworkId = exports.isMainnetNetwork = exports.isFujiNetworkId = exports.isFujiNetwork = void 0;
const constants_1 = require("@/Network/constants");
const network_1 = require("@/Network/network");
function isFujiNetwork(activeNetwork) {
    return activeNetwork.networkID === constants_1.TestnetConfig.networkID;
}
exports.isFujiNetwork = isFujiNetwork;
function isFujiNetworkId(id) {
    return id === constants_1.TestnetConfig.networkID;
}
exports.isFujiNetworkId = isFujiNetworkId;
function isMainnetNetwork(activeNetwork) {
    return activeNetwork.networkID === constants_1.MainnetConfig.networkID;
}
exports.isMainnetNetwork = isMainnetNetwork;
function isMainnetNetworkId(id) {
    return id === constants_1.MainnetConfig.networkID;
}
exports.isMainnetNetworkId = isMainnetNetworkId;
function isLocalNetwork(activeNetwork) {
    return activeNetwork.networkID === constants_1.LocalnetConfig.networkID;
}
exports.isLocalNetwork = isLocalNetwork;
function getAvaxAssetID() {
    return network_1.activeNetwork.avaxID;
}
exports.getAvaxAssetID = getAvaxAssetID;
function getActiveNetworkConfig() {
    return network_1.activeNetwork;
}
exports.getActiveNetworkConfig = getActiveNetworkConfig;
//# sourceMappingURL=utils.js.map