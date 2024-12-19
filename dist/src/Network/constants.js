"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultConfig = exports.LocalnetConfig = exports.TestnetConfig = exports.MainnetConfig = void 0;
const utils_1 = require("avalanche/dist/utils");
const rpcFromConfig_1 = require("./helpers/rpcFromConfig");
exports.MainnetConfig = {
    rawUrl: 'https://api.avax.network',
    apiProtocol: 'https',
    apiIp: 'api.avax.network',
    apiPort: 443,
    explorerURL: 'https://explorerapi.avax.network',
    explorerSiteURL: 'https://explorer.avax.network',
    networkID: 1,
    // @ts-ignore
    xChainID: utils_1.Defaults.network[1]['X']['blockchainID'],
    // @ts-ignore
    pChainID: utils_1.Defaults.network[1]['P']['blockchainID'],
    // @ts-ignore
    cChainID: utils_1.Defaults.network[1]['C']['blockchainID'],
    // @ts-ignore
    evmChainID: utils_1.Defaults.network[1]['C']['chainID'],
    // @ts-ignore
    avaxID: utils_1.Defaults.network[1]['X']['avaxAssetID'],
    get rpcUrl() {
        return {
            c: (0, rpcFromConfig_1.getRpcC)(this),
            p: (0, rpcFromConfig_1.getRpcP)(this),
            x: (0, rpcFromConfig_1.getRpcX)(this),
        };
    },
};
exports.TestnetConfig = {
    rawUrl: 'https://api.avax-test.network',
    apiProtocol: 'https',
    apiIp: 'api.avax-test.network',
    apiPort: 443,
    explorerURL: 'https://explorerapi.avax-test.network',
    explorerSiteURL: 'https://explorer.avax-test.network',
    networkID: 5,
    // @ts-ignore
    xChainID: utils_1.Defaults.network[5]['X']['blockchainID'],
    // @ts-ignore
    pChainID: utils_1.Defaults.network[5]['P']['blockchainID'],
    // @ts-ignore
    cChainID: utils_1.Defaults.network[5]['C']['blockchainID'],
    // @ts-ignore
    evmChainID: utils_1.Defaults.network[5]['C']['chainID'],
    // @ts-ignore
    avaxID: utils_1.Defaults.network[5]['X']['avaxAssetID'],
    get rpcUrl() {
        return {
            c: (0, rpcFromConfig_1.getRpcC)(this),
            p: (0, rpcFromConfig_1.getRpcP)(this),
            x: (0, rpcFromConfig_1.getRpcX)(this),
        };
    },
};
exports.LocalnetConfig = {
    rawUrl: 'http://localhost:9650',
    apiProtocol: 'http',
    apiIp: 'localhost',
    apiPort: 9650,
    networkID: 12345,
    // @ts-ignore
    xChainID: utils_1.Defaults.network[12345]['X']['blockchainID'],
    // @ts-ignore
    pChainID: utils_1.Defaults.network[12345]['P']['blockchainID'],
    // @ts-ignore
    cChainID: utils_1.Defaults.network[12345]['C']['blockchainID'],
    // @ts-ignore
    evmChainID: utils_1.Defaults.network[12345]['C']['chainID'],
    // @ts-ignore
    avaxID: utils_1.Defaults.network[12345]['X']['avaxAssetID'],
    get rpcUrl() {
        return {
            c: (0, rpcFromConfig_1.getRpcC)(this),
            p: (0, rpcFromConfig_1.getRpcP)(this),
            x: (0, rpcFromConfig_1.getRpcX)(this),
        };
    },
};
// Default network connection
exports.DefaultConfig = exports.MainnetConfig;
//# sourceMappingURL=constants.js.map