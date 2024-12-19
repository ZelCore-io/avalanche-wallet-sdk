"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistoryForOwnedAddressesRaw = exports.getHistoryForOwnedAddresses = exports.getHistoryEVM = exports.getHistoryC = exports.getHistoryP = exports.getHistoryX = void 0;
const Explorer_1 = require("@/Explorer");
const parsers_1 = require("@/History/parsers");
const evmParser_1 = require("@/History/evmParser");
const Network_1 = require("@/Network");
async function getHistoryX(addrs, limit = 0) {
    return await (0, Explorer_1.getAddressHistory)(addrs, limit, Network_1.xChain.getBlockchainID());
}
exports.getHistoryX = getHistoryX;
async function getHistoryP(addrs, limit = 0) {
    return await (0, Explorer_1.getAddressHistory)(addrs, limit, Network_1.pChain.getBlockchainID());
}
exports.getHistoryP = getHistoryP;
/**
 * Returns atomic history for this wallet on the C chain.
 * @remarks Excludes EVM transactions.
 * @param limit
 */
async function getHistoryC(addrC, addrsX, limit = 0) {
    let addrs = [addrC, ...addrsX];
    return await (0, Explorer_1.getAddressHistory)(addrs, limit, Network_1.cChain.getBlockchainID());
}
exports.getHistoryC = getHistoryC;
/**
 * Returns history for this wallet on the C chain.
 * @remarks Excludes atomic C chain import/export transactions.
 */
async function getHistoryEVM(addr) {
    return await (0, Explorer_1.getAddressHistoryEVM)(addr);
}
exports.getHistoryEVM = getHistoryEVM;
/**
 *
 * @param xAddresses A list of owned X chain addresses
 * @param pAddresses A list of owned P chain addresses
 * @param cAddress Bech32 C chain address
 * @param evmAddress Hex C chain address
 * @param limit
 */
async function getHistoryForOwnedAddresses(xAddresses, pAddresses, cAddress, evmAddress, limit = 0) {
    let [txsX, txsP, txsC] = await Promise.all([
        getHistoryX(xAddresses, limit),
        getHistoryP(pAddresses, limit),
        getHistoryC(cAddress, xAddresses, limit),
    ]);
    let txsXPC = (0, Explorer_1.filterDuplicateOrtelius)(txsX.concat(txsP, txsC));
    let txsEVM = await getHistoryEVM(evmAddress);
    let addrs = [...xAddresses, cAddress];
    // Parse X,P,C transactions
    // Have to loop because of the asynchronous call
    let parsedXPC = [];
    for (let i = 0; i < txsXPC.length; i++) {
        let tx = txsXPC[i];
        try {
            let summary = await (0, parsers_1.getTransactionSummary)(tx, addrs, evmAddress);
            parsedXPC.push(summary);
        }
        catch (err) {
            console.error(err);
        }
    }
    // Parse EVM Transactions
    let parsedEVM = txsEVM.map((tx) => (0, evmParser_1.getTransactionSummaryEVM)(tx, evmAddress));
    // Sort and join X,P,C transactions
    let parsedAll = [...parsedXPC, ...parsedEVM];
    let txsSorted = parsedAll.sort((x, y) => (x.timestamp.getTime() < y.timestamp.getTime() ? 1 : -1));
    // If there is a limit only return that much
    if (limit > 0) {
        return txsSorted.slice(0, limit);
    }
    return txsSorted;
}
exports.getHistoryForOwnedAddresses = getHistoryForOwnedAddresses;
/**
 * Returns sorted history data from Ortelius for X, P, and C chains.
 * @param xAddresses A list of owned X chain addresses
 * @param pAddresses A list of owned P chain addresses
 * @param cAddress Bech32 C chain address
 * @param limit Number of transactions to fetch, undefined or 0 for all history
 */
async function getHistoryForOwnedAddressesRaw(xAddresses, pAddresses, cAddress, limit = 0) {
    let [txsX, txsP, txsC] = await Promise.all([
        getHistoryX(xAddresses, limit),
        getHistoryP(pAddresses, limit),
        getHistoryC(cAddress, xAddresses, limit),
    ]);
    let txsXPC = (0, Explorer_1.filterDuplicateOrtelius)(txsX.concat(txsP, txsC));
    let txsSorted = txsXPC.sort((x, y) => {
        const dateX = new Date(x.timestamp);
        const dateY = new Date(y.timestamp);
        return dateX.getTime() < dateY.getTime() ? 1 : -1;
    });
    // If there is a limit only return that much
    if (limit > 0) {
        return txsSorted.slice(0, limit);
    }
    return txsSorted;
}
exports.getHistoryForOwnedAddressesRaw = getHistoryForOwnedAddressesRaw;
//# sourceMappingURL=getHistoryForOwnedAddresses.js.map