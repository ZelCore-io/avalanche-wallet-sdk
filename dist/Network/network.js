"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfigFromUrl = exports.setRpcNetwork = exports.setRpcNetworkAsync = exports.getEvmChainID = exports.activeNetwork = exports.explorer_api = exports.ethersProvider = exports.web3 = exports.infoApi = exports.pChain = exports.cChain = exports.xChain = exports.avalanche = void 0;
const tslib_1 = require("tslib");
const dist_1 = require("avalanche/dist");
const web3_1 = tslib_1.__importDefault(require("web3"));
const constants_1 = require("./constants");
const rpcFromConfig_1 = require("./helpers/rpcFromConfig");
const url_1 = tslib_1.__importDefault(require("url"));
const common_1 = require("../common");
const network_helper_1 = require("../helpers/network_helper");
const FetchHTTPProvider_1 = require("../utils/FetchHTTPProvider");
const getEthersProvider_1 = require("../Network/getEthersProvider");
exports.avalanche = (0, network_helper_1.createAvalancheProvider)(constants_1.DefaultConfig);
exports.xChain = exports.avalanche.XChain();
exports.cChain = exports.avalanche.CChain();
exports.pChain = exports.avalanche.PChain();
exports.infoApi = exports.avalanche.Info();
function getProviderFromUrl(url, credentials = false) {
    return new FetchHTTPProvider_1.FetchHttpProvider(url, {
        timeout: 20000,
        withCredentials: credentials,
    });
}
const rpcUrl = (0, rpcFromConfig_1.getRpcC)(constants_1.DefaultConfig);
exports.web3 = new web3_1.default(getProviderFromUrl(rpcUrl, true));
// JSON RPC Ethers provider
exports.ethersProvider = (0, getEthersProvider_1.getEthersJsonRpcProvider)(constants_1.DefaultConfig);
exports.explorer_api = null;
exports.activeNetwork = constants_1.DefaultConfig;
/**
 * Returns the evm chain ID of the active network
 */
function getEvmChainID() {
    return exports.activeNetwork.evmChainID;
}
exports.getEvmChainID = getEvmChainID;
/**
 * Similar to `setRpcNetwork`, but checks if credentials can be used with the api.
 * @param config
 */
async function setRpcNetworkAsync(config) {
    let credentials = await (0, network_helper_1.canUseCredentials)(config);
    setRpcNetwork(config, credentials);
}
exports.setRpcNetworkAsync = setRpcNetworkAsync;
/**
 * Changes the connected network of the SDK.
 * This is a synchronous call that does not do any network requests.
 * @param conf
 * @param credentials
 */
function setRpcNetwork(conf, credentials = true) {
    exports.avalanche.setAddress(conf.apiIp, conf.apiPort, conf.apiProtocol);
    exports.avalanche.setNetworkID(conf.networkID);
    if (credentials) {
        exports.avalanche.setRequestConfig('withCredentials', credentials);
    }
    else {
        exports.avalanche.removeRequestConfig('withCredentials');
    }
    exports.xChain.refreshBlockchainID(conf.xChainID);
    exports.xChain.setBlockchainAlias('X');
    exports.pChain.refreshBlockchainID(conf.pChainID);
    exports.pChain.setBlockchainAlias('P');
    exports.cChain.refreshBlockchainID(conf.cChainID);
    exports.cChain.setBlockchainAlias('C');
    exports.xChain.setAVAXAssetID(conf.avaxID);
    exports.pChain.setAVAXAssetID(conf.avaxID);
    exports.cChain.setAVAXAssetID(conf.avaxID);
    if (conf.explorerURL) {
        exports.explorer_api = (0, network_helper_1.createExplorerApi)(conf);
    }
    else {
        exports.explorer_api = null;
    }
    let rpcUrl = (0, rpcFromConfig_1.getRpcC)(conf);
    exports.web3.setProvider(getProviderFromUrl(rpcUrl, credentials));
    // Update ethers provider
    exports.ethersProvider = (0, getEthersProvider_1.getEthersJsonRpcProvider)(conf);
    exports.activeNetwork = conf;
}
exports.setRpcNetwork = setRpcNetwork;
/**
 * Given the base url for an Avalanche API, returns a NetworkConfig object.
 * @param url A string including protocol, base domain, and ports (if any). Ex: `http://localhost:9650`
 */
async function getConfigFromUrl(url) {
    let urlObj = url_1.default.parse(url);
    let portStr = urlObj.port;
    if (!urlObj.hostname || !urlObj.protocol)
        throw new Error('Invalid url.');
    if (!portStr) {
        portStr = urlObj.protocol === 'http:' ? '80' : '443';
    }
    // get network ID
    let netID = await (0, network_helper_1.getNetworkIdFromURL)(url);
    let protocol = urlObj.protocol === 'http:' ? 'http' : 'https';
    let connection = new dist_1.Avalanche(urlObj.hostname, parseInt(portStr), protocol, netID);
    // TODO: Use a helper for this
    let connectionEvm = new web3_1.default(getProviderFromUrl(urlObj.href + 'ext/bc/C/rpc'));
    let infoApi = connection.Info();
    let xApi = connection.XChain();
    let fetchIdX = infoApi.getBlockchainID('X');
    let fetchIdP = infoApi.getBlockchainID('P');
    let fetchIdC = infoApi.getBlockchainID('C');
    let fetchEvmChainID = connectionEvm.eth.getChainId();
    let fetchAvaxId = await xApi.getAVAXAssetID();
    let values = await Promise.all([fetchIdX, fetchIdP, fetchIdC, fetchAvaxId, fetchEvmChainID]);
    let idX = values[0];
    let idP = values[1];
    let idC = values[2];
    let avaxId = common_1.bintools.cb58Encode(values[3]);
    let evmChainId = values[4];
    let config = {
        rawUrl: url,
        apiProtocol: protocol,
        apiIp: urlObj.hostname,
        apiPort: parseInt(portStr),
        networkID: netID,
        xChainID: idX,
        pChainID: idP,
        cChainID: idC,
        avaxID: avaxId,
        evmChainID: Number(evmChainId.toString()),
        get rpcUrl() {
            return {
                c: (0, rpcFromConfig_1.getRpcC)(this),
                p: (0, rpcFromConfig_1.getRpcP)(this),
                x: (0, rpcFromConfig_1.getRpcX)(this),
            };
        },
    };
    return config;
}
exports.getConfigFromUrl = getConfigFromUrl;
//# sourceMappingURL=network.js.map