"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCsvFileOrtelius = exports.parseTxUtxos = void 0;
const Explorer_1 = require("@/Explorer");
const Network_1 = require("@/Network");
const utxoUtils_1 = require("@/Explorer/ortelius/utxoUtils");
const createCsvContent_1 = require("@/Csv/createCsvContent");
const utils_1 = require("@/utils");
const avalanche_1 = require("avalanche");
function isExportTx(tx) {
    return tx.type === 'export' || tx.type === 'pvm_export' || tx.type === 'atomic_export_tx';
}
function isImport(tx) {
    return tx.type === 'import' || tx.type === 'pvm_import' || tx.type === 'atomic_import_tx';
}
/**
 * Given an array of Ortelius transaction data return input and outputs as a single unified array
 * @param txs
 * @param ownedAddresses
 */
function parseTxUtxos(txs, ownedAddresses) {
    const result = [];
    txs.forEach((tx) => {
        const date = new Date(tx.timestamp);
        const chainId = isExportTx(tx) ? (0, Explorer_1.findSourceChain)(tx) : (0, Explorer_1.findDestinationChain)(tx);
        const chainAlias = (0, Network_1.idToChainAlias)(chainId);
        tx.inputs?.forEach((txIn) => {
            const isAVAX = txIn.output.assetID === Network_1.activeNetwork.avaxID;
            const decimals = isAVAX ? 9 : 0;
            result.push({
                txID: tx.id,
                timeStamp: date,
                unixTime: date.getTime().toString(),
                txType: tx.type,
                chain: chainAlias,
                isInput: true,
                isOwner: (0, utxoUtils_1.isOutputOwner)(ownedAddresses, txIn.output),
                amount: (0, utils_1.bnToBig)(new avalanche_1.BN(txIn.output.amount), decimals).toString(),
                owners: txIn.output.addresses || txIn.output.caddresses || [],
                locktime: txIn.output.locktime,
                threshold: txIn.output.threshold,
                assetID: isAVAX ? 'AVAX' : txIn.output.assetID,
            });
        });
        tx.outputs?.forEach((txOut) => {
            const isAVAX = txOut.assetID === Network_1.activeNetwork.avaxID;
            const decimals = isAVAX ? 9 : 0;
            result.push({
                txID: tx.id,
                unixTime: date.getTime().toString(),
                timeStamp: date,
                txType: tx.type,
                chain: chainAlias,
                isInput: false,
                isOwner: (0, utxoUtils_1.isOutputOwner)(ownedAddresses, txOut),
                amount: (0, utils_1.bnToBig)(new avalanche_1.BN(txOut.amount), decimals).toString(),
                owners: txOut.addresses || txOut.caddresses || [],
                locktime: txOut.locktime,
                threshold: txOut.threshold,
                assetID: isAVAX ? 'AVAX' : txOut.assetID,
            });
        });
    });
    return result;
}
exports.parseTxUtxos = parseTxUtxos;
/**
 * Create CSV file contents from the given Ortelius transactions.
 * @param txs Array of Ortelius Transactions
 * @param ownedAddresses Addresses owned by the wallet.
 */
function createCsvFileOrtelius(txs, ownedAddresses) {
    const parsed = parseTxUtxos(txs, ownedAddresses);
    const headers = [
        'Tx ID',
        'Timestamp',
        'UNIX Timestamp',
        'Tx Type',
        'Chain',
        'input/output',
        'Owned',
        'Amount',
        'Asset ID',
        'Owners',
        'Locktime',
        'Threshold',
    ];
    const rows = [];
    const unsupportedtypes = [
        'add_validator',
        'add_delegator',
        'add_subnet_validator',
        'operation',
        'create_asset',
        'create_subnet',
        'create_chain',
    ];
    parsed.forEach((tx) => {
        if (unsupportedtypes.includes(tx.txType))
            return;
        rows.push([
            tx.txID,
            tx.timeStamp.toISOString(),
            tx.unixTime,
            tx.txType,
            tx.chain,
            tx.isInput ? 'input' : 'output',
            tx.isOwner ? 'TRUE' : 'FALSE',
            `"${tx.amount}"`,
            tx.assetID,
            `"${tx.owners.join('\n')}"`,
            tx.locktime.toString(),
            tx.threshold.toString(),
        ]);
    });
    return (0, createCsvContent_1.createCSVContent)([headers, ...rows]);
}
exports.createCsvFileOrtelius = createCsvFileOrtelius;
//# sourceMappingURL=parseTxUtxos.js.map