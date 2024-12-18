"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddressDetailX = exports.getAddressChains = exports.getAddressHistory = exports.getTxEvm = exports.getTx = exports.getAddressHistoryEVM = void 0;
const network_1 = require("@/Network/network");
const errors_1 = require("@/errors");
/**
 * Returns transactions FROM and TO the address given
 * @param addr The address to get historic transactions for.
 */
async function getAddressHistoryEVM(addr) {
    if (!network_1.explorer_api) {
        throw errors_1.NO_EXPLORER_API;
    }
    let endpoint = `v2/ctransactions?address=${addr}`;
    let data = (await network_1.explorer_api.get(endpoint)).Transactions;
    data.sort((a, b) => {
        let dateA = new Date(a.createdAt);
        let dateB = new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
    });
    return data;
}
exports.getAddressHistoryEVM = getAddressHistoryEVM;
/**
 * Returns the ortelius data from the given tx id.
 * @param txID
 */
async function getTx(txID) {
    if (!network_1.explorer_api) {
        throw errors_1.NO_EXPLORER_API;
    }
    let url = `v2/transactions/${txID}`;
    return await network_1.explorer_api.get(url);
}
exports.getTx = getTx;
/**
 * Returns ortelius data for a transaction hash on C chain EVM,
 * @param txHash
 */
async function getTxEvm(txHash) {
    if (!network_1.explorer_api) {
        throw errors_1.NO_EXPLORER_API;
    }
    let endpoint = `v2/ctransactions?hash=${txHash}`;
    let data = (await network_1.explorer_api.get(endpoint)).Transactions[0];
    return data;
}
exports.getTxEvm = getTxEvm;
/**
 * Returns, X or P chain transactions belonging to the given address array.
 * @param addresses Addresses to check for. Max number of addresses is 1024
 * @param limit
 * @param chainID The blockchain ID of X or P chain
 * @param endTime
 */
async function getTransactionsAvalanche(addresses, limit = 20, chainID, endTime) {
    if (!network_1.explorer_api) {
        throw errors_1.NO_EXPLORER_API;
    }
    if (addresses.length > 1024)
        throw new Error('Number of addresses can not exceed 1024.');
    // Remove the prefix (X- P-) from given addresses
    const addrsRaw = addresses.map((addr) => {
        return addr.split('-')[1];
    });
    const rootUrl = 'v2/transactions';
    const req = {
        address: addrsRaw,
        sort: ['timestamp-desc'],
        disableCount: ['1'],
        chainID: [chainID],
        disableGenesis: ['false'],
    };
    // Add limit if given
    if (limit > 0) {
        //@ts-ignore
        req.limit = [limit.toString()];
    }
    // Add end time if given
    if (endTime) {
        //@ts-ignore
        req.endTime = [endTime];
    }
    const res = await network_1.explorer_api.post(rootUrl, req);
    const resTxs = res.transactions;
    const next = res.next;
    let allTxs = resTxs === null ? [] : resTxs;
    // If we need to fetch more for this address
    if (next && !limit) {
        let endTime = next.split('&')[0].split('=')[1];
        let nextRes = await getAddressHistory(addresses, limit, chainID, endTime);
        allTxs.push(...nextRes);
    }
    return allTxs;
}
/**
 * Returns, X or P chain transactions belonging to the given address array.
 * @param addrs Addresses to check for.
 * @param limit
 * @param chainID The blockchain ID of X or P chain
 * @param endTime
 */
async function getAddressHistory(addrs, limit = 20, chainID, endTime) {
    if (!network_1.explorer_api) {
        throw errors_1.NO_EXPLORER_API;
    }
    const ADDR_SIZE = 1024;
    const addrsChunks = [];
    for (let i = 0; i < addrs.length; i += ADDR_SIZE) {
        const chunk = addrs.slice(i, i + ADDR_SIZE);
        addrsChunks.push(chunk);
    }
    // Get histories in parallel
    const promises = addrsChunks.map((chunk) => {
        return getTransactionsAvalanche(chunk, limit, chainID, endTime);
    });
    const results = await Promise.all(promises);
    return results.reduce((acc, txs) => {
        return [...acc, ...txs];
    }, []);
}
exports.getAddressHistory = getAddressHistory;
/**
 * Given an array of addresses, checks which chain each address was already used on
 * @param addrs
 */
async function getAddressChains(addrs) {
    if (!network_1.explorer_api) {
        throw errors_1.NO_EXPLORER_API;
    }
    // Strip the prefix
    let rawAddrs = addrs.map((addr) => {
        return addr.split('-')[1];
    });
    let urlRoot = `v2/addressChains`;
    let res = await network_1.explorer_api.post(urlRoot, {
        address: rawAddrs,
        disableCount: ['1'],
    });
    return res.addressChains;
}
exports.getAddressChains = getAddressChains;
async function getAddressDetailX(addr) {
    if (!network_1.explorer_api) {
        throw errors_1.NO_EXPLORER_API;
    }
    let addrRaw = addr.split('-')[1];
    let url = `x/addresses/${addrRaw}`;
    return await network_1.explorer_api.get(url);
}
exports.getAddressDetailX = getAddressDetailX;
//# sourceMappingURL=requests.js.map