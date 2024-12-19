/**
 * Filter duplicate Snowtrace transactions
 * @param txs
 */
export function filterDuplicateTransactions(txs) {
    const hashes = txs.map((tx) => tx.hash);
    return txs.filter((tx, i) => {
        return hashes.indexOf(tx.hash) === i;
    });
}
//# sourceMappingURL=utils.js.map