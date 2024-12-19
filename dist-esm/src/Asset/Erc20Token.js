import { activeNetwork, web3 } from '@/Network/network';
import ERC20Abi from './ERC20.json';
import { NO_NETWORK } from '@/errors';
import { BN } from 'avalanche';
import xss from 'xss';
export class Erc20Token {
    contract;
    address;
    name;
    symbol;
    decimals;
    chainId;
    data;
    constructor(data) {
        this.name = xss(data.name);
        this.symbol = xss(data.symbol);
        this.address = data.address;
        this.decimals = data.decimals;
        this.chainId = data.chainId;
        this.data = data;
        //@ts-ignore
        this.contract = new web3.eth.Contract(ERC20Abi.abi, data.address);
    }
    toData() {
        return this.data;
    }
    static async getData(address) {
        //@ts-ignore
        let contract = new web3.eth.Contract(ERC20Abi.abi, address);
        let contractCalls = await Promise.all([
            contract.methods.name().call(),
            contract.methods.symbol().call(),
            contract.methods.decimals().call(),
        ]);
        // Purify the values for XSS protection
        let name = xss(typeof contractCalls[0] === 'string' ? contractCalls[0] : '');
        let symbol = xss(typeof contractCalls[1] === 'string' ? contractCalls[1] : '');
        let decimals = parseInt(typeof contractCalls[2] === 'string' ? contractCalls[2] : '0');
        if (!activeNetwork) {
            throw NO_NETWORK;
        }
        return {
            name,
            symbol,
            decimals,
            address,
            chainId: activeNetwork.evmChainID,
        };
    }
    async balanceOf(address) {
        let bal = await this.contract.methods.balanceOf(address).call();
        if (typeof bal === 'string') {
            return new BN(bal);
        }
        return new BN(0);
    }
}
//# sourceMappingURL=Erc20Token.js.map