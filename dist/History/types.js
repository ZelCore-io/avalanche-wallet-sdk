"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHistoryEVMTx = exports.isHistoryBaseTx = exports.isHistoryStakingTx = exports.isHistoryImportExportTx = void 0;
/**
 * Typeguard for `iHistoryImportExport` interface
 * @param tx The parsed history object
 */
function isHistoryImportExportTx(tx) {
    return tx.type === 'export' || tx.type === 'import';
}
exports.isHistoryImportExportTx = isHistoryImportExportTx;
/**
 * Typeguard for `iHistoryStaking` interface
 * @param tx The parsed history object
 */
function isHistoryStakingTx(tx) {
    let types = ['add_validator', 'add_delegator', 'validation_fee', 'delegation_fee'];
    return types.includes(tx.type);
}
exports.isHistoryStakingTx = isHistoryStakingTx;
/**
 * Typeguard for `iHistoryBaseTx` interface
 * @param tx The parsed history object
 */
function isHistoryBaseTx(tx) {
    return tx.type === 'transaction';
}
exports.isHistoryBaseTx = isHistoryBaseTx;
function isHistoryEVMTx(tx) {
    return tx.type === 'transaction_evm';
}
exports.isHistoryEVMTx = isHistoryEVMTx;
//# sourceMappingURL=types.js.map