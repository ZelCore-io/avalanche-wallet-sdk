"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaseTxSummary = void 0;
const tslib_1 = require("tslib");
const Assets = tslib_1.__importStar(require("../Asset/Assets"));
const utils_1 = require("../utils");
const avm_1 = require("avalanche/dist/apis/avm");
const avalanche_1 = require("avalanche");
const history_helpers_1 = require("../History/history_helpers");
const utxoUtils_1 = require("../Explorer/ortelius/utxoUtils");
const utils_2 = require("../Network/utils");
async function getBaseTxSummary(tx, ownerAddrs) {
    let ins = tx.inputs?.map((input) => input.output) || [];
    let outs = tx.outputs || [];
    // Calculate losses from inputs
    let losses = getOwnedTokens(ins, ownerAddrs);
    let gains = getOwnedTokens(outs, ownerAddrs);
    let nowOwnedIns = (0, utxoUtils_1.getNotOwnedOutputs)(ins, ownerAddrs);
    let nowOwnedOuts = (0, utxoUtils_1.getNotOwnedOutputs)(outs, ownerAddrs);
    let froms = (0, utxoUtils_1.getOutputsAssetOwners)(nowOwnedIns);
    let tos = (0, utxoUtils_1.getOutputsAssetOwners)(nowOwnedOuts);
    let tokens = await getBaseTxTokensSummary(gains, losses, froms, tos);
    return {
        id: tx.id,
        fee: (0, utils_1.getTxFeeX)(),
        type: 'transaction',
        timestamp: new Date(tx.timestamp),
        memo: (0, history_helpers_1.parseMemo)(tx.memo),
        tokens: tokens,
        tx: tx,
    };
}
exports.getBaseTxSummary = getBaseTxSummary;
function getBaseTxNFTLosses(tx, ownerAddrs) {
    let ins = tx.inputs || [];
    let inUTXOs = ins.map((input) => input.output);
    let nftUTXOs = inUTXOs.filter((utxo) => {
        return utxo.outputType === avm_1.AVMConstants.NFTXFEROUTPUTID;
    });
    let res = {};
    for (let assetID in tx.inputTotals) {
        let nftBal = (0, history_helpers_1.getNFTBalanceFromUTXOs)(nftUTXOs, ownerAddrs, assetID);
        // If empty dictionary pass
        if (Object.keys(nftBal).length === 0)
            continue;
        res[assetID] = nftBal;
    }
    return res;
}
function getBaseTxNFTGains(tx, ownerAddrs) {
    let outs = tx.outputs || [];
    let nftUTXOs = outs.filter((utxo) => {
        return utxo.outputType === avm_1.AVMConstants.NFTXFEROUTPUTID;
    });
    let res = {};
    for (let assetID in tx.inputTotals) {
        let nftBal = (0, history_helpers_1.getNFTBalanceFromUTXOs)(nftUTXOs, ownerAddrs, assetID);
        // If empty dictionary pass
        if (Object.keys(nftBal).length === 0)
            continue;
        res[assetID] = nftBal;
    }
    return res;
}
/**
 * Returns a dictionary of asset totals belonging to the owner
 * @param utxos
 * @param ownerAddrs
 */
function getOwnedTokens(utxos, ownerAddrs) {
    let tokenUTXOs = (0, utxoUtils_1.getOutputsOfType)(utxos, avm_1.AVMConstants.SECPXFEROUTPUTID);
    // Owned inputs
    let myUTXOs = (0, utxoUtils_1.getOwnedOutputs)(tokenUTXOs, ownerAddrs);
    // Asset IDs received
    let assetIDs = (0, utxoUtils_1.getOutputsAssetIDs)(myUTXOs);
    let res = {};
    for (let i = 0; i < assetIDs.length; i++) {
        let assetID = assetIDs[i];
        let assetUTXOs = (0, utxoUtils_1.getAssetOutputs)(myUTXOs, assetID);
        let tot = (0, utxoUtils_1.getOutputTotals)(assetUTXOs);
        res[assetID] = tot;
    }
    return res;
}
async function getBaseTxTokensSummary(gains, losses, froms, tos) {
    let res = [];
    let assetIDs = (0, utxoUtils_1.filterDuplicateStrings)([...Object.keys(gains), ...Object.keys(losses)]);
    // Fetch asset descriptions
    let calls = assetIDs.map((id) => Assets.getAssetDescription(id));
    let descs = await Promise.all(calls);
    let descsDict = {};
    // Convert array to dict
    for (let i = 0; i < descs.length; i++) {
        let desc = descs[i];
        descsDict[desc.assetID] = desc;
    }
    for (let i = 0; i < assetIDs.length; i++) {
        let id = assetIDs[i];
        let tokenGain = gains[id] || new avalanche_1.BN(0);
        let tokenLost = losses[id] || new avalanche_1.BN(0);
        let tokenDesc = descsDict[id];
        // If we sent avax, deduct the fee
        if (id === (0, utils_2.getAvaxAssetID)() && !tokenLost.isZero()) {
            tokenLost = tokenLost.sub((0, utils_1.getTxFeeX)());
        }
        // How much we gained/lost of this token
        let diff = tokenGain.sub(tokenLost);
        let diffClean = (0, utils_1.bnToLocaleString)(diff, tokenDesc.denomination);
        // If we didnt gain or lose anything, ignore this token
        if (diff.isZero())
            continue;
        if (diff.isNeg()) {
            res.push({
                amount: diff,
                amountDisplayValue: diffClean,
                addresses: tos[id],
                asset: tokenDesc,
            });
        }
        else {
            res.push({
                amount: diff,
                amountDisplayValue: diffClean,
                addresses: froms[id],
                asset: tokenDesc,
            });
        }
    }
    return res;
}
//# sourceMappingURL=base_tx_parser.js.map