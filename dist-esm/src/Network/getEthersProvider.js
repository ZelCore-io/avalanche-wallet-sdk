import { ethers } from 'ethers';
export function getEthersJsonRpcProvider(config) {
    return new ethers.providers.JsonRpcProvider(config.rpcUrl.c, {
        name: '',
        chainId: config.evmChainID,
    });
}
//# sourceMappingURL=getEthersProvider.js.map