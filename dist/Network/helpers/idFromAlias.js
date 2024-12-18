"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chainIdFromAlias = void 0;
const network_1 = require("@/Network/network");
/**
 * Given a chain alias, returns the chain id.
 * @param alias `X`, `P` or `C`
 */
function chainIdFromAlias(alias) {
    if (alias === 'X') {
        return network_1.xChain.getBlockchainID();
    }
    else if (alias === 'P') {
        return network_1.pChain.getBlockchainID();
    }
    else if (alias === 'C') {
        return network_1.cChain.getBlockchainID();
    }
    throw new Error('Unknown chain alias.');
}
exports.chainIdFromAlias = chainIdFromAlias;
//# sourceMappingURL=idFromAlias.js.map