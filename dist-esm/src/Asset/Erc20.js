import { Erc20Token } from '@/Asset/Erc20Token';
export let erc20Cache = {};
export function getErc20Cache() {
    return {
        ...erc20Cache,
    };
}
/**
 * Clears the internal erc20 cache.
 */
export function bustErc20Cache() {
    erc20Cache = {};
}
/**
 * Fetches ERC20 data from the given contract address and adds the token to the given store.
 * @param address ERC20 Contract address
 */
async function addErc20Token(address) {
    let existing = erc20Cache[address];
    if (existing) {
        return existing;
    }
    try {
        let data = await Erc20Token.getData(address);
        let token = new Erc20Token(data);
        erc20Cache[address] = token;
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
export function addErc20TokenFromData(data) {
    let address = data.address;
    let existing = erc20Cache[address];
    if (existing) {
        return existing;
    }
    let token = new Erc20Token(data);
    erc20Cache[address] = token;
    return token;
}
export async function getContractDataErc20(address) {
    try {
        let data = await Erc20Token.getData(address);
        return data;
    }
    catch (e) {
        throw new Error(`ERC20 contract ${address} does not exist.`);
    }
}
export async function getErc20Token(address) {
    let storeItem = erc20Cache[address];
    if (storeItem) {
        return storeItem;
    }
    else {
        return await addErc20Token(address);
    }
}
//# sourceMappingURL=Erc20.js.map