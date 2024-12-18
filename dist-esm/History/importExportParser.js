import { parseMemo } from '@/History/history_helpers';
import { idToChainAlias } from '@/Network/helpers/aliasFromNetworkID';
import { xChain } from '@/Network/network';
import { bnToAvaxX, strip0x } from '@/utils';
import { getOutputsOfChain, getOutputTotals, getOwnedOutputs } from '@/Explorer/ortelius/utxoUtils';
import { findDestinationChain, findSourceChain } from '@/Explorer';
import { BN } from 'avalanche';
export function getImportSummary(tx, addresses, evmAddr) {
    let sourceChain = findSourceChain(tx);
    let chainAliasFrom = idToChainAlias(sourceChain);
    let chainAliasTo = idToChainAlias(tx.chainID);
    const normalizedEVMAddr = strip0x(evmAddr.toLowerCase());
    let outs = tx.outputs || [];
    let myOuts = getOwnedOutputs(outs, [...addresses, normalizedEVMAddr]);
    let amtOut = getOutputTotals(myOuts);
    let time = new Date(tx.timestamp);
    let fee = new BN(tx.txFee);
    let res = {
        id: tx.id,
        memo: parseMemo(tx.memo),
        source: chainAliasFrom,
        destination: chainAliasTo,
        amount: amtOut,
        amountDisplayValue: bnToAvaxX(amtOut),
        timestamp: time,
        type: 'import',
        fee: fee,
        tx,
    };
    return res;
}
export function getExportSummary(tx, addresses) {
    let sourceChain = findSourceChain(tx);
    let chainAliasFrom = idToChainAlias(sourceChain);
    let destinationChain = findDestinationChain(tx);
    let chainAliasTo = idToChainAlias(destinationChain);
    let outs = tx.outputs || [];
    let myOuts = getOwnedOutputs(outs, addresses);
    let chainOuts = getOutputsOfChain(myOuts, destinationChain);
    let amtOut = getOutputTotals(chainOuts);
    let time = new Date(tx.timestamp);
    let fee = xChain.getTxFee();
    let res = {
        id: tx.id,
        memo: parseMemo(tx.memo),
        source: chainAliasFrom,
        destination: chainAliasTo,
        amount: amtOut,
        amountDisplayValue: bnToAvaxX(amtOut),
        timestamp: time,
        type: 'export',
        fee: fee,
        tx,
    };
    return res;
}
//# sourceMappingURL=importExportParser.js.map