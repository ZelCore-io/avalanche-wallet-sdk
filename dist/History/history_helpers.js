"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNFTBalanceFromUTXOs = exports.parseMemo = void 0;
const avm_1 = require("@avalabs/avalanchejs/dist/apis/avm");
const utils_1 = require("../utils");
const utxoUtils_1 = require("../Explorer/ortelius/utxoUtils");
/**
 * Parse the raw memo field to readable text.
 * @param raw
 */
function parseMemo(raw) {
    const memoText = Buffer.from(raw, 'base64').toString('utf8');
    // Bug that sets memo to empty string (AAAAAA==) for some tx types
    if (!memoText.length || raw === 'AAAAAA==')
        return '';
    return memoText;
}
exports.parseMemo = parseMemo;
function getNFTBalanceFromUTXOs(utxos, addresses, assetID) {
    let nftUTXOs = utxos.filter((utxo) => {
        if (utxo.outputType === avm_1.AVMConstants.NFTXFEROUTPUTID &&
            utxo.assetID === assetID &&
            (0, utxoUtils_1.isOutputOwner)(addresses, utxo)) {
            return true;
        }
        return false;
    });
    let res = {};
    for (let i = 0; i < nftUTXOs.length; i++) {
        let utxo = nftUTXOs[i];
        let groupID = utxo.groupID;
        let content;
        if (utxo.payload) {
            let parsedPayload = (0, utils_1.parseNftPayload)(utxo.payload);
            content = parsedPayload.getContent().toString();
        }
        if (res[groupID]) {
            res[groupID].amount++;
        }
        else {
            res[groupID] = {
                payload: content || '',
                amount: 1,
            };
        }
    }
    return res;
}
exports.getNFTBalanceFromUTXOs = getNFTBalanceFromUTXOs;
//# sourceMappingURL=history_helpers.js.map