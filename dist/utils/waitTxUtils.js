"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitTxC = exports.waitTxEvm = exports.waitTxP = exports.waitTxX = void 0;
const network_1 = require("../Network/network");
/**
 * Waits until the given tx id is accepted on X chain
 * @param txId Tx ID to wait for
 * @param tryCount Number of attempts until timeout
 */
async function waitTxX(txId, tryCount = 10) {
    if (tryCount <= 0) {
        throw new Error('Timeout');
    }
    let resp;
    try {
        resp = (await network_1.xChain.getTxStatus(txId));
    }
    catch (e) {
        throw new Error('Unable to get transaction status.');
    }
    let status;
    let reason;
    if (typeof resp === 'string') {
        status = resp;
    }
    else {
        status = resp.status;
        reason = resp.reason;
    }
    if (status === 'Unknown' || status === 'Processing') {
        return await new Promise((resolve) => {
            setTimeout(async () => {
                resolve(await waitTxX(txId, tryCount - 1));
            }, 1000);
        });
        // return await waitTxX(txId, tryCount - 1);
    }
    else if (status === 'Rejected') {
        throw new Error(reason);
    }
    else if (status === 'Accepted') {
        return txId;
    }
    return txId;
}
exports.waitTxX = waitTxX;
async function waitTxP(txId, tryCount = 10) {
    if (tryCount <= 0) {
        throw new Error('Timeout');
    }
    let resp;
    try {
        resp = (await network_1.pChain.getTxStatus(txId));
    }
    catch (e) {
        throw new Error('Unable to get transaction status.');
    }
    let status;
    let reason;
    if (typeof resp === 'string') {
        status = resp;
    }
    else {
        status = resp.status;
        reason = resp.reason;
    }
    if (status === 'Unknown' || status === 'Processing') {
        return await new Promise((resolve) => {
            setTimeout(async () => {
                resolve(await waitTxP(txId, tryCount - 1));
            }, 1000);
        });
        // return await waitTxX(txId, tryCount - 1);
    }
    else if (status === 'Dropped') {
        throw new Error(reason);
    }
    else if (status === 'Committed') {
        return txId;
    }
    else {
        throw new Error('Unknown status type.');
    }
}
exports.waitTxP = waitTxP;
async function waitTxEvm(txHash, tryCount = 10) {
    if (tryCount <= 0) {
        throw new Error('Timeout');
    }
    let receipt;
    try {
        receipt = await network_1.web3.eth.getTransactionReceipt(txHash);
    }
    catch (e) {
        throw new Error('Unable to get transaction receipt.');
    }
    if (!receipt) {
        return await new Promise((resolve) => {
            setTimeout(async () => {
                resolve(await waitTxEvm(txHash, tryCount - 1));
            }, 1000);
        });
    }
    else {
        if (receipt.status) {
            return txHash;
        }
        else {
            throw new Error('Transaction reverted.');
        }
    }
}
exports.waitTxEvm = waitTxEvm;
async function waitTxC(txId, tryCount = 10) {
    if (tryCount <= 0) {
        throw new Error('Timeout');
    }
    let resp;
    try {
        resp = (await network_1.cChain.getAtomicTxStatus(txId));
    }
    catch (e) {
        throw new Error('Unable to get transaction status.');
    }
    let status;
    let reason;
    if (typeof resp === 'string') {
        status = resp;
    }
    else {
        status = resp.status;
        reason = resp.reason;
    }
    if (status === 'Unknown' || status === 'Processing') {
        return await new Promise((resolve) => {
            setTimeout(async () => {
                resolve(await waitTxC(txId, tryCount - 1));
            }, 1000);
        });
        // return await waitTxX(txId, tryCount - 1);
    }
    else if (status === 'Dropped') {
        throw new Error(reason);
    }
    else if (status === 'Accepted') {
        return txId;
    }
    else {
        throw new Error('Unknown status type.');
    }
}
exports.waitTxC = waitTxC;
//# sourceMappingURL=waitTxUtils.js.map