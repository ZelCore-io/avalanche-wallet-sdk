"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStakeAmount = exports.findDestinationChain = exports.findSourceChain = exports.filterDuplicateOrtelius = void 0;
const utxoUtils_1 = require("@/Explorer/ortelius/utxoUtils");
/**
 * Given an array of transactions from the explorer, filter out duplicate transactions
 * @param txs
 */
function filterDuplicateOrtelius(txs) {
    let txsIds = [];
    let filtered = [];
    for (let i = 0; i < txs.length; i++) {
        let tx = txs[i];
        let txId = tx.id;
        if (txsIds.includes(txId)) {
            continue;
        }
        else {
            txsIds.push(txId);
            filtered.push(tx);
        }
    }
    return filtered;
}
exports.filterDuplicateOrtelius = filterDuplicateOrtelius;
// If any of the inputs has a different chain ID, thats the source chain
// else return current chain
/**
 * Returns the source chain id.
 * @param tx Tx data from the explorer.
 */
function findSourceChain(tx) {
    let baseChain = tx.chainID;
    let ins = tx.inputs || [];
    for (let i = 0; i < ins.length; i++) {
        let inChainId = ins[i].output.inChainID;
        if (!inChainId)
            continue;
        if (inChainId !== baseChain)
            return inChainId;
    }
    return baseChain;
}
exports.findSourceChain = findSourceChain;
// If any of the outputs has a different chain ID, that's the destination chain
// else return current chain
/**
 * Returns the destination chain id.
 * @param tx Tx data from the explorer.
 */
function findDestinationChain(tx) {
    let baseChain = tx.chainID;
    let outs = tx.outputs || [];
    for (let i = 0; i < outs.length; i++) {
        let outChainId = outs[i].outChainID;
        if (!outChainId)
            continue;
        if (outChainId !== baseChain)
            return outChainId;
    }
    return baseChain;
}
exports.findDestinationChain = findDestinationChain;
// To get the stake amount, sum the non-reward output utxos.
function getStakeAmount(tx) {
    let outs = tx.outputs || [];
    let nonRewardUtxos = outs.filter((utxo) => !utxo.rewardUtxo && utxo.stake);
    let tot = (0, utxoUtils_1.getOutputTotals)(nonRewardUtxos);
    return tot;
}
exports.getStakeAmount = getStakeAmount;
//# sourceMappingURL=utils.js.map