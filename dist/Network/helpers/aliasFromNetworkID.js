"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idToChainAlias = void 0;
const network_1 = require("../../Network/network");
/**
 * Given the chain ID returns the chain alias
 * @param id Chain id
 */
function idToChainAlias(id) {
    if (id === network_1.activeNetwork.xChainID) {
        return 'X';
    }
    else if (id === network_1.activeNetwork.pChainID) {
        return 'P';
    }
    else if (id === network_1.activeNetwork.cChainID) {
        return 'C';
    }
    throw new Error('Unknown chain ID.');
}
exports.idToChainAlias = idToChainAlias;
//# sourceMappingURL=aliasFromNetworkID.js.map