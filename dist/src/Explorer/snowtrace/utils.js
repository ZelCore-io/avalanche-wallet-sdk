"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterDuplicateTransactions = void 0;
/**
 * Filter duplicate Snowtrace transactions
 * @param txs
 */
function filterDuplicateTransactions(txs) {
    const hashes = txs.map((tx) => tx.hash);
    return txs.filter((tx, i) => {
        return hashes.indexOf(tx.hash) === i;
    });
}
exports.filterDuplicateTransactions = filterDuplicateTransactions;
//# sourceMappingURL=utils.js.map