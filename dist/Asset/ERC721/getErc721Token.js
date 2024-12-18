"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErc721TokenEthers = void 0;
const ERC721_json_1 = require("./ERC721.json");
const ethers_1 = require("ethers");
// import { web3 } from '../Network';
// import { AbiItem } from 'web3-utils';
/**
 * Returns an ethers ERC721 Contract
 * @param address
 */
function getErc721TokenEthers(address) {
    return ethers_1.ContractFactory.getContract(address, ERC721_json_1.abi);
}
exports.getErc721TokenEthers = getErc721TokenEthers;
/**
 * Returns an web3 ERC721 Contract
 * @param address
 */
// export function getErc721TokenWeb3(address: string) {
//     return new web3.eth.Contract(abi as AbiItem[], address);
// }
//# sourceMappingURL=getErc721Token.js.map