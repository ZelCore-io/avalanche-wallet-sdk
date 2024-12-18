"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionSummaryEVM = void 0;
const utils_1 = require("../utils");
const avalanche_1 = require("avalanche");
function getTransactionSummaryEVM(tx, walletAddress) {
    let isSender = tx.fromAddr.toUpperCase() === walletAddress.toUpperCase();
    let amt = new avalanche_1.BN(tx.value);
    let amtClean = (0, utils_1.bnToAvaxC)(amt);
    let date = new Date(tx.createdAt);
    let gasLimit = new avalanche_1.BN(tx.gasLimit);
    let gasPrice = new avalanche_1.BN(tx.gasPrice);
    let feeBN = gasLimit.mul(gasPrice); // in gwei
    return {
        id: tx.hash,
        fee: feeBN,
        memo: '',
        block: tx.block,
        isSender,
        type: 'transaction_evm',
        amount: amt,
        amountDisplayValue: amtClean,
        gasLimit: tx.gasLimit,
        gasPrice: tx.gasPrice,
        from: tx.fromAddr,
        to: tx.toAddr,
        timestamp: date,
        input: tx.input,
        tx,
    };
}
exports.getTransactionSummaryEVM = getTransactionSummaryEVM;
//# sourceMappingURL=evmParser.js.map