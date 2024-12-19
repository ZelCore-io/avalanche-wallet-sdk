"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseNormalTxs = exports.createCsvNormal = void 0;
const tslib_1 = require("tslib");
const History_1 = require("../History");
const constants_1 = require("../Csv/constants");
const createCsvContent_1 = require("../Csv/createCsvContent");
const utils_1 = require("../utils");
const moment_1 = tslib_1.__importDefault(require("moment"));
/**
 * Given an array of history transactions, filter the base and export/import txs and returns the body of a csv file.
 * @remarks You can download the returned string as a CSV file.
 * @param txs An array of transactions made by a wallet.
 */
function createCsvNormal(txs) {
    const rows = [constants_1.normalHeaders, ...parseNormalTxs(txs)];
    return (0, createCsvContent_1.createCSVContent)(rows);
}
exports.createCsvNormal = createCsvNormal;
function parseNormalTxs(txs) {
    const rows = [];
    txs.map((tx) => {
        const mom = (0, moment_1.default)(tx.timestamp);
        const dateStr = mom.format();
        if ((0, History_1.isHistoryBaseTx)(tx)) {
            const tokenRows = tx.tokens.map((token) => {
                const amtStr = (0, utils_1.bnToBig)(token.amount, token.asset.denomination).toString();
                return [tx.id, dateStr, tx.type, token.asset.symbol, amtStr, `"${token.addresses.join('\r')}"`, 'X'];
            });
            rows.push(...tokenRows);
        }
        else if ((0, History_1.isHistoryImportExportTx)(tx)) {
            const amtStr = (0, utils_1.bnToBigAvaxX)(tx.amount).toString();
            rows.push([tx.id, dateStr, tx.type, 'AVAX', amtStr, '', `${tx.source} to ${tx.destination}`]);
        }
        else if ((0, History_1.isHistoryEVMTx)(tx)) {
            const amtStr = (0, utils_1.bnToBigAvaxC)(tx.amount).toString();
            const amtSigned = tx.isSender ? `-${amtStr}` : amtStr;
            if (!tx.input) {
                const addr = tx.isSender ? tx.to : tx.from;
                rows.push([tx.id, dateStr, tx.type, 'AVAX', amtSigned, addr, `C`]);
            }
        }
    });
    return rows;
}
exports.parseNormalTxs = parseNormalTxs;
//# sourceMappingURL=parseNormalTxs.js.map