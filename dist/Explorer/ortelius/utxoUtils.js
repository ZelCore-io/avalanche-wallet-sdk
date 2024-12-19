"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOutputsAssetIDs = exports.getOutputsAssetOwners = exports.getOutputsOfType = exports.getOutputsOfChain = exports.getRewardOuts = exports.getOutputTotals = exports.getNotOwnedOutputs = exports.getAssetOutputs = exports.getAddresses = exports.getOwnedOutputs = exports.getEvmAssetBalanceFromUTXOs = exports.getAssetBalanceFromUTXOs = exports.isOutputOwnerC = exports.isOutputOwner = exports.isArraysOverlap = exports.filterDuplicateStrings = void 0;
const avalanchejs_1 = require("@avalabs/avalanchejs");
const utils_1 = require("../../utils");
function filterDuplicateStrings(vals) {
    return vals.filter((val, i) => vals.indexOf(val) === i);
}
exports.filterDuplicateStrings = filterDuplicateStrings;
function isArraysOverlap(arr1, arr2) {
    let overlaps = arr1.filter((item) => arr2.includes(item));
    return overlaps.length > 0;
}
exports.isArraysOverlap = isArraysOverlap;
/**
 * Returns true if this utxo is owned by any of the given addresses
 * @param ownerAddrs Addresses to check against
 * @param output The UTXO
 */
function isOutputOwner(ownerAddrs, output) {
    // Remove prefix from owner addresses
    ownerAddrs = ownerAddrs.map((addr) => {
        const split = addr.split('-');
        return split[1] || split[0];
    });
    let outAddrs = output.addresses;
    if (!outAddrs)
        return false;
    let totAddrs = outAddrs.filter((addr) => {
        return ownerAddrs.includes(addr);
    });
    return totAddrs.length > 0;
}
exports.isOutputOwner = isOutputOwner;
function isOutputOwnerC(ownerAddr, output) {
    let outAddrs = output.caddresses;
    if (!outAddrs)
        return false;
    return outAddrs.includes(ownerAddr);
}
exports.isOutputOwnerC = isOutputOwnerC;
/**
 * Returns the total amount of `assetID` in the given `utxos` owned by `address`. Checks for X/P addresses.
 * @param utxos UTXOs to calculate balance from.
 * @param addresses The wallet's  addresses.
 * @param assetID Only count outputs of this asset ID.
 * @param chainID Only count the outputs on this chain.
 * @param isStake Set to `true` if looking for staking utxos.
 */
function getAssetBalanceFromUTXOs(utxos, addresses, assetID, chainID, isStake = false) {
    let myOuts = utxos.filter((utxo) => {
        if (assetID === utxo.assetID &&
            isOutputOwner(addresses, utxo) &&
            chainID === utxo.chainID &&
            utxo.stake === isStake) {
            return true;
        }
        return false;
    });
    let tot = myOuts.reduce((acc, utxo) => {
        return acc.add(new avalanchejs_1.BN(utxo.amount));
    }, new avalanchejs_1.BN(0));
    return tot;
}
exports.getAssetBalanceFromUTXOs = getAssetBalanceFromUTXOs;
/**
 * Returns the total amount of `assetID` in the given `utxos` owned by `address`. Checks for EVM address.
 * @param utxos UTXOs to calculate balance from.
 * @param address The wallet's  evm address `0x...`.
 * @param assetID Only count outputs of this asset ID.
 * @param chainID Only count the outputs on this chain.
 * @param isStake Set to `true` if looking for staking utxos.
 */
function getEvmAssetBalanceFromUTXOs(utxos, address, assetID, chainID, isStake = false) {
    let myOuts = utxos.filter((utxo) => {
        if (assetID === utxo.assetID &&
            isOutputOwnerC(address, utxo) &&
            chainID === utxo.chainID &&
            utxo.stake === isStake) {
            return true;
        }
        return false;
    });
    let tot = myOuts.reduce((acc, utxo) => {
        return acc.add(new avalanchejs_1.BN(utxo.amount));
    }, new avalanchejs_1.BN(0));
    return tot;
}
exports.getEvmAssetBalanceFromUTXOs = getEvmAssetBalanceFromUTXOs;
/**
 * Returns UTXOs owned by the given addresses
 * @param outs UTXOs to filter
 * @param myAddrs Addresses to filter by
 */
function getOwnedOutputs(outs, myAddrs) {
    return outs.filter((out) => {
        let outAddrs = out.addresses || [];
        let cAddrs = out.caddresses || [];
        // Strip 0x and normalize C addresses
        const cAddrsClean = cAddrs.map((addr) => {
            return (0, utils_1.strip0x)(addr.toLowerCase());
        });
        return isArraysOverlap(myAddrs, [...outAddrs, ...cAddrsClean]);
    });
}
exports.getOwnedOutputs = getOwnedOutputs;
/**
 * Returns addresses of the given UTXOs
 * @param outs UTXOs to get the addresses of.
 */
function getAddresses(outs) {
    let allAddrs = [];
    for (let i = 0; i < outs.length; i++) {
        let out = outs[i];
        let addrs = out.addresses || [];
        allAddrs.push(...addrs);
    }
    // Remove duplicated
    return allAddrs.filter((addr, i) => allAddrs.indexOf(addr) === i);
}
exports.getAddresses = getAddresses;
/**
 * Returns only the UTXOs of the given asset id.
 * @param outs
 * @param assetID
 */
function getAssetOutputs(outs, assetID) {
    return outs.filter((out) => out.assetID === assetID);
}
exports.getAssetOutputs = getAssetOutputs;
/**
 * Returns UTXOs not owned by the given addresses
 * @param outs UTXOs to filter
 * @param myAddrs Addresses to filter by
 */
function getNotOwnedOutputs(outs, myAddrs) {
    return outs.filter((out) => {
        let outAddrs = out.addresses || [];
        return !isArraysOverlap(myAddrs, outAddrs);
    });
}
exports.getNotOwnedOutputs = getNotOwnedOutputs;
function getOutputTotals(outs) {
    return outs.reduce((acc, out) => {
        return acc.add(new avalanchejs_1.BN(out.amount));
    }, new avalanchejs_1.BN(0));
}
exports.getOutputTotals = getOutputTotals;
function getRewardOuts(outs) {
    return outs.filter((out) => out.rewardUtxo);
}
exports.getRewardOuts = getRewardOuts;
/**
 * Returns outputs belonging to the given chain ID
 * @param outs UTXOs to filter
 * @param chainID Chain ID to filter by
 */
function getOutputsOfChain(outs, chainID) {
    return outs.filter((out) => out.chainID === chainID);
}
exports.getOutputsOfChain = getOutputsOfChain;
/**
 * Filters the UTXOs of a certain output type
 * @param outs UTXOs to filter
 * @param type Output type to filter by
 */
function getOutputsOfType(outs, type) {
    return outs.filter((out) => out.outputType === type);
}
exports.getOutputsOfType = getOutputsOfType;
/**
 * Returns a map of asset id to owner addresses
 * @param outs
 */
function getOutputsAssetOwners(outs) {
    let assetIDs = getOutputsAssetIDs(outs);
    let res = {};
    for (let i = 0; i < assetIDs.length; i++) {
        let id = assetIDs[i];
        let assetUTXOs = getAssetOutputs(outs, id);
        let addrs = getAddresses(assetUTXOs);
        res[id] = addrs;
    }
    return res;
}
exports.getOutputsAssetOwners = getOutputsAssetOwners;
/**
 * Returns an array of Asset IDs from the given UTXOs
 * @param outs Array of UTXOs
 */
function getOutputsAssetIDs(outs) {
    let res = [];
    for (let i = 0; i < outs.length; i++) {
        let out = outs[i];
        res.push(out.assetID);
    }
    return filterDuplicateStrings(res);
}
exports.getOutputsAssetIDs = getOutputsAssetIDs;
//# sourceMappingURL=utxoUtils.js.map