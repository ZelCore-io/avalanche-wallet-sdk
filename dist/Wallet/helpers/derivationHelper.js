"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccountPathEVM = exports.getAccountPathAvalanche = void 0;
const constants_1 = require("../../Wallet/constants");
/**
 * Given an account number, returns the Avalanche account derivation path as a string
 * @param accountIndex
 */
function getAccountPathAvalanche(accountIndex) {
    if (accountIndex < 0)
        throw new Error('Account index can not be less than 0.');
    return `${constants_1.AVAX_TOKEN_PATH}/${accountIndex}'`;
}
exports.getAccountPathAvalanche = getAccountPathAvalanche;
/**
 * Returns the string `m/44'/60'/0'/0/n` where `n` is the account index.
 * @param accountIndex
 */
function getAccountPathEVM(accountIndex) {
    if (accountIndex < 0)
        throw new Error('Account index can not be less than 0.');
    return `${constants_1.ETH_ACCOUNT_PATH}/0/${accountIndex}`;
}
exports.getAccountPathEVM = getAccountPathEVM;
//# sourceMappingURL=derivationHelper.js.map