"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionSummary = void 0;
const history_helpers_1 = require("../History/history_helpers");
const network_1 = require("../Network/network");
const utils_1 = require("../utils");
const avalanchejs_1 = require("@avalabs/avalanchejs");
const base_tx_parser_1 = require("../History/base_tx_parser");
const aliasFromNetworkID_1 = require("../Network/helpers/aliasFromNetworkID");
const importExportParser_1 = require("../History/importExportParser");
const Explorer_1 = require("../Explorer");
const utxoUtils_1 = require("../Explorer/ortelius/utxoUtils");
async function getTransactionSummary(tx, walletAddrs, evmAddress) {
    let cleanAddressesXP = walletAddrs.map((addr) => addr.split('-')[1]);
    switch (tx.type) {
        case 'import':
        case 'pvm_import':
        case 'atomic_import_tx':
            return (0, importExportParser_1.getImportSummary)(tx, cleanAddressesXP, evmAddress);
        case 'export':
        case 'pvm_export':
        case 'atomic_export_tx':
            return (0, importExportParser_1.getExportSummary)(tx, cleanAddressesXP);
        case 'add_validator':
        case 'add_delegator':
            return getStakingSummary(tx, cleanAddressesXP);
        case 'operation':
        case 'base':
            return await (0, base_tx_parser_1.getBaseTxSummary)(tx, cleanAddressesXP);
        default:
            return getUnsupportedSummary(tx);
    }
}
exports.getTransactionSummary = getTransactionSummary;
function getUnsupportedSummary(tx) {
    return {
        id: tx.id,
        type: 'not_supported',
        timestamp: new Date(tx.timestamp),
        fee: new avalanchejs_1.BN(0),
        tx,
    };
}
function getStakingSummary(tx, ownerAddrs) {
    let time = new Date(tx.timestamp);
    // let pChainID = activeNetwork.pChainID;
    // let avaxID = activeNetwork.avaxID;
    let ins = tx.inputs?.map((tx) => tx.output) || [];
    let myIns = (0, utxoUtils_1.getOwnedOutputs)(ins, ownerAddrs);
    let outs = tx.outputs || [];
    let myOuts = (0, utxoUtils_1.getOwnedOutputs)(outs, ownerAddrs);
    let stakeAmount = (0, Explorer_1.getStakeAmount)(tx);
    // Assign the type
    let type = tx.type === 'add_validator' ? 'add_validator' : 'add_delegator';
    // If this wallet only received the fee
    if (myIns.length === 0 && type === 'add_delegator') {
        type = 'delegation_fee';
    }
    else if (myIns.length === 0 && type === 'add_validator') {
        type = 'validation_fee';
    }
    let rewardAmount;
    let rewardAmountClean;
    if (tx.rewarded) {
        let rewardOuts = (0, utxoUtils_1.getRewardOuts)(myOuts);
        rewardAmount = (0, utxoUtils_1.getOutputTotals)(rewardOuts);
        rewardAmountClean = (0, utils_1.bnToAvaxP)(rewardAmount);
    }
    return {
        id: tx.id,
        nodeID: tx.validatorNodeID,
        stakeStart: new Date(tx.validatorStart * 1000),
        stakeEnd: new Date(tx.validatorEnd * 1000),
        timestamp: time,
        type: type,
        fee: new avalanchejs_1.BN(0),
        amount: stakeAmount,
        amountDisplayValue: (0, utils_1.bnToAvaxP)(stakeAmount),
        memo: (0, history_helpers_1.parseMemo)(tx.memo),
        isRewarded: tx.rewarded,
        rewardAmount: rewardAmount,
        rewardAmountDisplayValue: rewardAmountClean,
        tx,
    };
}
// Returns the summary for a C chain import TX
function getImportSummaryC(tx, ownerAddr) {
    let sourceChain = (0, Explorer_1.findSourceChain)(tx);
    let chainAliasFrom = (0, aliasFromNetworkID_1.idToChainAlias)(sourceChain);
    let chainAliasTo = (0, aliasFromNetworkID_1.idToChainAlias)(tx.chainID);
    let avaxID = network_1.activeNetwork.avaxID;
    let outs = tx.outputs || [];
    let amtOut = (0, utxoUtils_1.getEvmAssetBalanceFromUTXOs)(outs, ownerAddr, avaxID, tx.chainID);
    let time = new Date(tx.timestamp);
    let fee = network_1.xChain.getTxFee();
    let res = {
        id: tx.id,
        source: chainAliasFrom,
        destination: chainAliasTo,
        amount: amtOut,
        amountDisplayValue: (0, utils_1.bnToAvaxX)(amtOut),
        timestamp: time,
        type: 'import',
        fee: fee,
        memo: (0, history_helpers_1.parseMemo)(tx.memo),
        tx,
    };
    return res;
}
//# sourceMappingURL=parsers.js.map