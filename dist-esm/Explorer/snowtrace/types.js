/**
 * Type guard for SnowtraceErc20Tx
 * @param tx
 */
export function isSnowtraceErc20Tx(tx) {
    return tx.hasOwnProperty('tokenName');
}
/**
 * Type guard for SnowtraceNormalTx
 * @param tx
 */
export function isSnowtraceNormalTx(tx) {
    return !tx.hasOwnProperty('tokenName');
}
//# sourceMappingURL=types.js.map