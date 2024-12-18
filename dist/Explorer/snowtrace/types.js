"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSnowtraceNormalTx = exports.isSnowtraceErc20Tx = void 0;
/**
 * Type guard for SnowtraceErc20Tx
 * @param tx
 */
function isSnowtraceErc20Tx(tx) {
    return tx.hasOwnProperty('tokenName');
}
exports.isSnowtraceErc20Tx = isSnowtraceErc20Tx;
/**
 * Type guard for SnowtraceNormalTx
 * @param tx
 */
function isSnowtraceNormalTx(tx) {
    return !tx.hasOwnProperty('tokenName');
}
exports.isSnowtraceNormalTx = isSnowtraceNormalTx;
//# sourceMappingURL=types.js.map