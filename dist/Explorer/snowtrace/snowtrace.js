"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getABIForContract = exports.getNormalHistory = exports.getErc20History = void 0;
const constants_1 = require("../../Explorer/snowtrace/constants");
const Network_1 = require("../../Network");
const utils_1 = require("./utils");
async function fetchSnowtraceAPI(query, isMainnet = true) {
    const baseUrl = isMainnet ? constants_1.SNOWTRACE_MAINNET : constants_1.SNOWTRACE_TESTNET;
    const response = await fetch(`${baseUrl}/${query}`);
    return response.json();
}
async function getErc20History(address, networkConfig, page = 0, offset = 0, contractAddress) {
    const contractQuery = contractAddress ? `&contractaddress=${contractAddress}` : '';
    const sort = 'desc';
    const query = `api?module=account&action=tokentx&address=${address}&sort=${sort}&page=${page}&offset=${offset}${contractQuery}`;
    let resp;
    if ((0, Network_1.isMainnetNetwork)(networkConfig)) {
        resp = await fetchSnowtraceAPI(query);
    }
    else if ((0, Network_1.isFujiNetwork)(networkConfig)) {
        resp = await fetchSnowtraceAPI(query, false);
    }
    else {
        throw new Error('Snow trace is only available for Avalanche Mainnet and Testnet');
    }
    return (0, utils_1.filterDuplicateTransactions)(resp.result);
}
exports.getErc20History = getErc20History;
async function getNormalHistory(address, networkConfig, page = 0, offset = 0) {
    const sort = 'desc';
    const query = `api?module=account&action=txlist&address=${address}&sort=${sort}&page=${page}&offset=${offset}`;
    let resp;
    if ((0, Network_1.isMainnetNetwork)(networkConfig)) {
        resp = await fetchSnowtraceAPI(query);
    }
    else if ((0, Network_1.isFujiNetwork)(networkConfig)) {
        resp = await fetchSnowtraceAPI(query, false);
    }
    else {
        throw new Error('Snow trace is only available for Avalanche Mainnet and Testnet');
    }
    return (0, utils_1.filterDuplicateTransactions)(resp.result);
}
exports.getNormalHistory = getNormalHistory;
/**
 * https://docs.etherscan.io/api-endpoints/contracts#get-contract-abi-for-verified-contract-source-codes
 *
 * @param address
 * @param networkConfig
 * @returns string array, the first index is the ABI
 */
async function getABIForContract(address, networkConfig) {
    const isMainnet = (0, Network_1.isMainnetNetwork)(networkConfig);
    const isFuji = (0, Network_1.isFujiNetwork)(networkConfig);
    if (!isMainnet && !isFuji) {
        throw new Error('Snow trace is only available for Avalanche Mainnet and Testnet');
    }
    // eslint-disable-next-line no-undef
    const params = new window.URLSearchParams({ module: 'contract', action: 'getabi', address });
    return await fetchSnowtraceAPI(`api?${params.toString()}`, isMainnet);
}
exports.getABIForContract = getABIForContract;
//# sourceMappingURL=snowtrace.js.map