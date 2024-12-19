/**
 * Typeguard for `iHistoryImportExport` interface
 * @param tx The parsed history object
 */
export function isHistoryImportExportTx(tx) {
    return tx.type === 'export' || tx.type === 'import';
}
/**
 * Typeguard for `iHistoryStaking` interface
 * @param tx The parsed history object
 */
export function isHistoryStakingTx(tx) {
    let types = ['add_validator', 'add_delegator', 'validation_fee', 'delegation_fee'];
    return types.includes(tx.type);
}
/**
 * Typeguard for `iHistoryBaseTx` interface
 * @param tx The parsed history object
 */
export function isHistoryBaseTx(tx) {
    return tx.type === 'transaction';
}
export function isHistoryEVMTx(tx) {
    return tx.type === 'transaction_evm';
}
//# sourceMappingURL=types.js.map