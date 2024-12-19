"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseStakingTxs = exports.createCsvStaking = void 0;
const tslib_1 = require("tslib");
const History_1 = require("../History");
const utils_1 = require("../utils");
const moment_1 = tslib_1.__importDefault(require("moment"));
const createCsvContent_1 = require("../Csv/createCsvContent");
const constants_1 = require("../Csv/constants");
const big_js_1 = tslib_1.__importDefault(require("big.js"));
/**
 * Given an array of history transactions, filter the staking txs and returns the body of a csv file.
 * @remarks You can download the returned string as a CSV file.
 * @param txs An array of transactions made by a wallet.
 */
function createCsvStaking(txs) {
    // Filter only staking transactions
    const filtered = txs.filter(History_1.isHistoryStakingTx);
    // Sort by stake end date
    const sorted = filtered.sort((a, b) => {
        const aTime = a.stakeEnd.getTime();
        const bTime = b.stakeEnd.getTime();
        return bTime - aTime;
    });
    const rows = [constants_1.stakingHeaders, ...parseStakingTxs(sorted)];
    return (0, createCsvContent_1.createCSVContent)(rows);
}
exports.createCsvStaking = createCsvStaking;
/**
 * Parses each staking transaction according to the headers defined in constants and returns an array of strings for
 * each cell in the CSV.
 * @param txs
 */
function parseStakingTxs(txs) {
    return txs.map((tx) => {
        const txDate = (0, moment_1.default)(tx.timestamp).format();
        const stakeStart = (0, moment_1.default)(tx.stakeStart).format();
        const stakeEnd = (0, moment_1.default)(tx.stakeEnd).format();
        const now = Date.now();
        const stakeAmt = (0, utils_1.bnToBigAvaxP)(tx.amount).toString();
        let rewardUSD;
        let rewardAmt;
        if (tx.stakeEnd.getTime() > now) {
            // Pending
            rewardAmt = 'Pending';
        }
        else if (!tx.isRewarded) {
            //Stake Not Rewarded
            rewardAmt = (0, big_js_1.default)(0);
        }
        else if (tx.rewardAmount) {
            const bigAmt = (0, utils_1.bnToBigAvaxP)(tx.rewardAmount);
            rewardAmt = !tx.rewardAmount.isZero() ? bigAmt.toString() : 'Not Reward Owner';
            if (tx.avaxPrice) {
                rewardUSD = bigAmt.mul(tx.avaxPrice);
            }
        }
        else {
            // Not reward owner
            rewardAmt = 'Not Reward Owner';
        }
        const rewardUsdString = rewardUSD ? rewardUSD.toFixed(2) : '-';
        const avaxPriceString = tx.avaxPrice ? tx.avaxPrice.toFixed(2) : '-';
        return [
            tx.id,
            txDate,
            tx.type,
            tx.nodeID,
            stakeAmt,
            stakeStart,
            stakeEnd,
            tx.isRewarded.toString(),
            rewardAmt.toString(),
            rewardUsdString,
            avaxPriceString,
        ];
    });
}
exports.parseStakingTxs = parseStakingTxs;
//# sourceMappingURL=parseStakingTxs.js.map