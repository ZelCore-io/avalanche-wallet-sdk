"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Erc20Token = void 0;
const tslib_1 = require("tslib");
const network_1 = require("@/Network/network");
const ERC20_json_1 = tslib_1.__importDefault(require("./ERC20.json"));
const errors_1 = require("@/errors");
const avalanche_1 = require("avalanche");
const xss_1 = tslib_1.__importDefault(require("xss"));
class Erc20Token {
    contract;
    address;
    name;
    symbol;
    decimals;
    chainId;
    data;
    constructor(data) {
        this.name = (0, xss_1.default)(data.name);
        this.symbol = (0, xss_1.default)(data.symbol);
        this.address = data.address;
        this.decimals = data.decimals;
        this.chainId = data.chainId;
        this.data = data;
        //@ts-ignore
        this.contract = new network_1.web3.eth.Contract(ERC20_json_1.default.abi, data.address);
    }
    toData() {
        return this.data;
    }
    static async getData(address) {
        //@ts-ignore
        let contract = new network_1.web3.eth.Contract(ERC20_json_1.default.abi, address);
        let contractCalls = await Promise.all([
            contract.methods.name().call(),
            contract.methods.symbol().call(),
            contract.methods.decimals().call(),
        ]);
        // Purify the values for XSS protection
        let name = (0, xss_1.default)(typeof contractCalls[0] === 'string' ? contractCalls[0] : '');
        let symbol = (0, xss_1.default)(typeof contractCalls[1] === 'string' ? contractCalls[1] : '');
        let decimals = parseInt(typeof contractCalls[2] === 'string' ? contractCalls[2] : '0');
        if (!network_1.activeNetwork) {
            throw errors_1.NO_NETWORK;
        }
        return {
            name,
            symbol,
            decimals,
            address,
            chainId: network_1.activeNetwork.evmChainID,
        };
    }
    async balanceOf(address) {
        let bal = await this.contract.methods.balanceOf(address).call();
        if (typeof bal === 'string') {
            return new avalanche_1.BN(bal);
        }
        return new avalanche_1.BN(0);
    }
}
exports.Erc20Token = Erc20Token;
//# sourceMappingURL=Erc20Token.js.map