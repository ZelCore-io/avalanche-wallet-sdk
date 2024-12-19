import { ethers } from 'ethers';
import { NetworkConfig } from '../Network/types';
export declare function getEthersJsonRpcProvider(config: NetworkConfig): ethers.providers.JsonRpcProvider;
