"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.platformGetAllUTXOsForAddresses = exports.platformGetAllUTXOs = exports.avmGetAllUTXOsForAddresses = exports.avmGetAllUTXOs = exports.getStakeForAddresses = exports.evmGetAtomicUTXOs = exports.platformGetAtomicUTXOs = exports.avmGetAtomicUTXOs = void 0;
const network_1 = require("@/Network/network");
const idFromAlias_1 = require("@/Network/helpers/idFromAlias");
/**
 *
 * @param addrs an array of X chain addresses to get the atomic utxos of
 * @param sourceChain Which chain to check against, either `P` or `C`
 */
async function avmGetAtomicUTXOs(addrs, sourceChain) {
    const selection = addrs.slice(0, 1024);
    const remaining = addrs.slice(1024);
    const sourceChainId = (0, idFromAlias_1.chainIdFromAlias)(sourceChain);
    let utxoSet = (await network_1.xChain.getUTXOs(selection, sourceChainId)).utxos;
    if (remaining.length > 0) {
        const nextSet = await avmGetAtomicUTXOs(remaining, sourceChain);
        utxoSet = utxoSet.merge(nextSet);
    }
    return utxoSet;
}
exports.avmGetAtomicUTXOs = avmGetAtomicUTXOs;
// todo: Use end index to get ALL utxos
async function platformGetAtomicUTXOs(addrs, sourceChain) {
    let selection = addrs.slice(0, 1024);
    let remaining = addrs.slice(1024);
    const sourceChainId = (0, idFromAlias_1.chainIdFromAlias)(sourceChain);
    let utxoSet = (await network_1.pChain.getUTXOs(selection, sourceChainId)).utxos;
    if (remaining.length > 0) {
        let nextSet = await platformGetAtomicUTXOs(remaining, sourceChain);
        utxoSet = utxoSet.merge(nextSet);
    }
    return utxoSet;
}
exports.platformGetAtomicUTXOs = platformGetAtomicUTXOs;
// todo: Use end index to get ALL utxos
async function evmGetAtomicUTXOs(addrs, sourceChain) {
    if (addrs.length > 1024) {
        throw new Error('Number of addresses can not be greater than 1024.');
    }
    const sourceChainId = (0, idFromAlias_1.chainIdFromAlias)(sourceChain);
    let result = (await network_1.cChain.getUTXOs(addrs, sourceChainId)).utxos;
    return result;
}
exports.evmGetAtomicUTXOs = evmGetAtomicUTXOs;
async function getStakeForAddresses(addrs) {
    if (addrs.length <= 256) {
        let data = await network_1.pChain.getStake(addrs);
        return data;
    }
    else {
        //Break the list in to 1024 chunks
        let chunk = addrs.slice(0, 256);
        let remainingChunk = addrs.slice(256);
        let chunkData = await network_1.pChain.getStake(chunk);
        let chunkStake = chunkData.staked;
        let chunkUtxos = chunkData.stakedOutputs;
        let next = await getStakeForAddresses(remainingChunk);
        return {
            staked: chunkStake.add(next.staked),
            stakedOutputs: [...chunkUtxos, ...next.stakedOutputs],
        };
    }
}
exports.getStakeForAddresses = getStakeForAddresses;
async function avmGetAllUTXOs(addrs) {
    if (addrs.length <= 1024) {
        let utxos = await avmGetAllUTXOsForAddresses(addrs);
        return utxos;
    }
    else {
        //Break the list in to 1024 chunks
        let chunk = addrs.slice(0, 1024);
        let remainingChunk = addrs.slice(1024);
        let newSet = await avmGetAllUTXOsForAddresses(chunk);
        return newSet.merge(await avmGetAllUTXOs(remainingChunk));
    }
}
exports.avmGetAllUTXOs = avmGetAllUTXOs;
async function avmGetAllUTXOsForAddresses(addrs, endIndex) {
    if (addrs.length > 1024)
        throw new Error('Maximum length of addresses is 1024');
    let response;
    if (!endIndex) {
        response = await network_1.xChain.getUTXOs(addrs);
    }
    else {
        response = await network_1.xChain.getUTXOs(addrs, undefined, 0, endIndex);
    }
    let utxoSet = response.utxos;
    let nextEndIndex = response.endIndex;
    let len = response.numFetched;
    if (len >= 1024) {
        let subUtxos = await avmGetAllUTXOsForAddresses(addrs, nextEndIndex);
        return utxoSet.merge(subUtxos);
    }
    return utxoSet;
}
exports.avmGetAllUTXOsForAddresses = avmGetAllUTXOsForAddresses;
// helper method to get utxos for more than 1024 addresses
async function platformGetAllUTXOs(addrs) {
    if (addrs.length <= 1024) {
        let newSet = await platformGetAllUTXOsForAddresses(addrs);
        return newSet;
    }
    else {
        //Break the list in to 1024 chunks
        let chunk = addrs.slice(0, 1024);
        let remainingChunk = addrs.slice(1024);
        let newSet = await platformGetAllUTXOsForAddresses(chunk);
        return newSet.merge(await platformGetAllUTXOs(remainingChunk));
    }
}
exports.platformGetAllUTXOs = platformGetAllUTXOs;
async function platformGetAllUTXOsForAddresses(addrs, endIndex) {
    let response;
    if (!endIndex) {
        response = await network_1.pChain.getUTXOs(addrs);
    }
    else {
        response = await network_1.pChain.getUTXOs(addrs, undefined, 0, endIndex);
    }
    let utxoSet = response.utxos;
    let nextEndIndex = response.endIndex;
    let len = response.numFetched;
    if (len >= 1024) {
        let subUtxos = await platformGetAllUTXOsForAddresses(addrs, nextEndIndex);
        return utxoSet.merge(subUtxos);
    }
    return utxoSet;
}
exports.platformGetAllUTXOsForAddresses = platformGetAllUTXOsForAddresses;
//# sourceMappingURL=utxo_helper.js.map