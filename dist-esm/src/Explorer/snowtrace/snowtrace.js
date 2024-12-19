import { SNOWTRACE_MAINNET, SNOWTRACE_TESTNET } from '@/Explorer/snowtrace/constants';
import { isFujiNetwork, isMainnetNetwork } from '@/Network';
import { filterDuplicateTransactions } from './utils';
async function fetchSnowtraceAPI(query, isMainnet = true) {
    const baseUrl = isMainnet ? SNOWTRACE_MAINNET : SNOWTRACE_TESTNET;
    const response = await fetch(`${baseUrl}/${query}`);
    return response.json();
}
export async function getErc20History(address, networkConfig, page = 0, offset = 0, contractAddress) {
    const contractQuery = contractAddress ? `&contractaddress=${contractAddress}` : '';
    const sort = 'desc';
    const query = `api?module=account&action=tokentx&address=${address}&sort=${sort}&page=${page}&offset=${offset}${contractQuery}`;
    let resp;
    if (isMainnetNetwork(networkConfig)) {
        resp = await fetchSnowtraceAPI(query);
    }
    else if (isFujiNetwork(networkConfig)) {
        resp = await fetchSnowtraceAPI(query, false);
    }
    else {
        throw new Error('Snow trace is only available for Avalanche Mainnet and Testnet');
    }
    return filterDuplicateTransactions(resp.result);
}
export async function getNormalHistory(address, networkConfig, page = 0, offset = 0) {
    const sort = 'desc';
    const query = `api?module=account&action=txlist&address=${address}&sort=${sort}&page=${page}&offset=${offset}`;
    let resp;
    if (isMainnetNetwork(networkConfig)) {
        resp = await fetchSnowtraceAPI(query);
    }
    else if (isFujiNetwork(networkConfig)) {
        resp = await fetchSnowtraceAPI(query, false);
    }
    else {
        throw new Error('Snow trace is only available for Avalanche Mainnet and Testnet');
    }
    return filterDuplicateTransactions(resp.result);
}
/**
 * https://docs.etherscan.io/api-endpoints/contracts#get-contract-abi-for-verified-contract-source-codes
 *
 * @param address
 * @param networkConfig
 * @returns string array, the first index is the ABI
 */
export async function getABIForContract(address, networkConfig) {
    const isMainnet = isMainnetNetwork(networkConfig);
    const isFuji = isFujiNetwork(networkConfig);
    if (!isMainnet && !isFuji) {
        throw new Error('Snow trace is only available for Avalanche Mainnet and Testnet');
    }
    const params = new window.URLSearchParams({ module: 'contract', action: 'getabi', address });
    return await fetchSnowtraceAPI(`api?${params.toString()}`, isMainnet);
}
//# sourceMappingURL=snowtrace.js.map