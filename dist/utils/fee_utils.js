"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTxFeeP = exports.getTxFeeX = void 0;
const network_1 = require("@/Network/network");
/**
 * Returns the transaction fee for X chain.
 */
function getTxFeeX() {
    return network_1.xChain.getTxFee();
}
exports.getTxFeeX = getTxFeeX;
/**
 * Returns the transaction fee for P chain.
 */
function getTxFeeP() {
    return network_1.pChain.getTxFee();
}
exports.getTxFeeP = getTxFeeP;
//# sourceMappingURL=fee_utils.js.map