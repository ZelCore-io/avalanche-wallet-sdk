"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEthersJsonRpcProvider = void 0;
const ethers_1 = require("ethers");
function getEthersJsonRpcProvider(config) {
    return new ethers_1.ethers.providers.JsonRpcProvider(config.rpcUrl.c, {
        name: '',
        chainId: config.evmChainID,
    });
}
exports.getEthersJsonRpcProvider = getEthersJsonRpcProvider;
//# sourceMappingURL=getEthersProvider.js.map