/// <reference types="bn.js" />
import ERC20Abi from './ERC20.json';
import { Erc20TokenData } from '@/Asset/types';
import { BN } from 'avalanche';
import { Contract } from 'web3-eth-contract';
export declare class Erc20Token {
    contract: Contract<typeof ERC20Abi.abi>;
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    chainId: number;
    data: Erc20TokenData;
    constructor(data: Erc20TokenData);
    toData(): Erc20TokenData;
    static getData(address: string): Promise<Erc20TokenData>;
    balanceOf(address: string): Promise<BN>;
}
