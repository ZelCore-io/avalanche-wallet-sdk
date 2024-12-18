"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErc20Token = exports.getContractDataErc20 = exports.addErc20TokenFromData = exports.bustErc20Cache = exports.getErc20Cache = exports.erc20Cache = void 0;
const Erc20Token_1 = require("@/Asset/Erc20Token");
exports.erc20Cache = {};
function getErc20Cache() {
    return {
        ...exports.erc20Cache,
    };
}
exports.getErc20Cache = getErc20Cache;
/**
 * Clears the internal erc20 cache.
 */
function bustErc20Cache() {
    exports.erc20Cache = {};
}
exports.bustErc20Cache = bustErc20Cache;
/**
 * Fetches ERC20 data from the given contract address and adds the token to the given store.
 * @param address ERC20 Contract address
 */
async function addErc20Token(address) {
    let existing = exports.erc20Cache[address];
    if (existing) {
        return existing;
    }
    try {
        let data = await Erc20Token_1.Erc20Token.getData(address);
        let token = new Erc20Token_1.Erc20Token(data);
        exports.erc20Cache[address] = token;
        return token;
    }
    catch (e) {
        throw new Error('Unable to add ERC20 contract.');
    }
}
/**
 * Initates and caches an erc20 token from the given data.
 * @param data Information such as name, symbol, and address about the ERC20 token.
 */
function addErc20TokenFromData(data) {
    let address = data.address;
    let existing = exports.erc20Cache[address];
    if (existing) {
        return existing;
    }
    let token = new Erc20Token_1.Erc20Token(data);
    exports.erc20Cache[address] = token;
    return token;
}
exports.addErc20TokenFromData = addErc20TokenFromData;
async function getContractDataErc20(address) {
    try {
        let data = await Erc20Token_1.Erc20Token.getData(address);
        return data;
    }
    catch (e) {
        throw new Error(`ERC20 contract ${address} does not exist.`);
    }
}
exports.getContractDataErc20 = getContractDataErc20;
async function getErc20Token(address) {
    let storeItem = exports.erc20Cache[address];
    if (storeItem) {
        return storeItem;
    }
    else {
        return await addErc20Token(address);
    }
}
exports.getErc20Token = getErc20Token;
//# sourceMappingURL=Erc20.js.map