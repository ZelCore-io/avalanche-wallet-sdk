"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExportSummary = exports.getImportSummary = void 0;
const history_helpers_1 = require("../History/history_helpers");
const aliasFromNetworkID_1 = require("../Network/helpers/aliasFromNetworkID");
const network_1 = require("../Network/network");
const utils_1 = require("../utils");
const utxoUtils_1 = require("../Explorer/ortelius/utxoUtils");
const Explorer_1 = require("../Explorer");
const avalanche_1 = require("avalanche");
function getImportSummary(tx, addresses, evmAddr) {
    let sourceChain = (0, Explorer_1.findSourceChain)(tx);
    let chainAliasFrom = (0, aliasFromNetworkID_1.idToChainAlias)(sourceChain);
    let chainAliasTo = (0, aliasFromNetworkID_1.idToChainAlias)(tx.chainID);
    const normalizedEVMAddr = (0, utils_1.strip0x)(evmAddr.toLowerCase());
    let outs = tx.outputs || [];
    let myOuts = (0, utxoUtils_1.getOwnedOutputs)(outs, [...addresses, normalizedEVMAddr]);
    let amtOut = (0, utxoUtils_1.getOutputTotals)(myOuts);
    let time = new Date(tx.timestamp);
    let fee = new avalanche_1.BN(tx.txFee);
    let res = {
        id: tx.id,
        memo: (0, history_helpers_1.parseMemo)(tx.memo),
        source: chainAliasFrom,
        destination: chainAliasTo,
        amount: amtOut,
        amountDisplayValue: (0, utils_1.bnToAvaxX)(amtOut),
        timestamp: time,
        type: 'import',
        fee: fee,
        tx,
    };
    return res;
}
exports.getImportSummary = getImportSummary;
function getExportSummary(tx, addresses) {
    let sourceChain = (0, Explorer_1.findSourceChain)(tx);
    let chainAliasFrom = (0, aliasFromNetworkID_1.idToChainAlias)(sourceChain);
    let destinationChain = (0, Explorer_1.findDestinationChain)(tx);
    let chainAliasTo = (0, aliasFromNetworkID_1.idToChainAlias)(destinationChain);
    let outs = tx.outputs || [];
    let myOuts = (0, utxoUtils_1.getOwnedOutputs)(outs, addresses);
    let chainOuts = (0, utxoUtils_1.getOutputsOfChain)(myOuts, destinationChain);
    let amtOut = (0, utxoUtils_1.getOutputTotals)(chainOuts);
    let time = new Date(tx.timestamp);
    let fee = network_1.xChain.getTxFee();
    let res = {
        id: tx.id,
        memo: (0, history_helpers_1.parseMemo)(tx.memo),
        source: chainAliasFrom,
        destination: chainAliasTo,
        amount: amtOut,
        amountDisplayValue: (0, utils_1.bnToAvaxX)(amtOut),
        timestamp: time,
        type: 'export',
        fee: fee,
        tx,
    };
    return res;
}
exports.getExportSummary = getExportSummary;
//# sourceMappingURL=importExportParser.js.map