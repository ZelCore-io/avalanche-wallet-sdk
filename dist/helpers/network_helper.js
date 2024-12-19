"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canUseCredentials = exports.createExplorerApi = exports.createAvalancheProvider = exports.getNetworkIdFromURL = exports.wsUrlFromConfigEVM = exports.wsUrlFromConfigX = void 0;
const avalanchejs_1 = require("@avalabs/avalanchejs");
const http_client_1 = require("./http_client");
function wsUrlFromConfigX(config) {
    let protocol = config.apiProtocol === 'http' ? 'ws' : 'wss';
    return `${protocol}://${config.apiIp}:${config.apiPort}/ext/bc/X/events`;
}
exports.wsUrlFromConfigX = wsUrlFromConfigX;
function wsUrlFromConfigEVM(config) {
    let protocol = config.apiProtocol === 'http' ? 'ws' : 'wss';
    return `${protocol}://${config.apiIp}:${config.apiPort}/ext/bc/C/ws`;
}
exports.wsUrlFromConfigEVM = wsUrlFromConfigEVM;
/**
 * Given the base url of an Avalanche API, requests the Network ID
 * @param url The base url for the Avalanche API
 */
async function getNetworkIdFromURL(url) {
    // TODO: Not be the best to assume /ext/info but Avalanchejs complicates things
    let res = await fetch(url + '/ext/info', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'info.getNetworkID',
        }),
    });
    const data = await res.json();
    return parseInt(data.result.networkID);
}
exports.getNetworkIdFromURL = getNetworkIdFromURL;
function createAvalancheProvider(config) {
    return new avalanchejs_1.Avalanche(config.apiIp, config.apiPort, config.apiProtocol, config.networkID);
}
exports.createAvalancheProvider = createAvalancheProvider;
/**
 * Given a network configuration returns an HttpClient instance connected to the explorer
 */
function createExplorerApi(networkConfig) {
    if (!networkConfig.explorerURL) {
        throw new Error('Network configuration does not specify an explorer API.');
    }
    return new http_client_1.HttpClient(networkConfig.explorerURL);
}
exports.createExplorerApi = createExplorerApi;
/**
 * Checks if the given network accepts credentials.
 * This must be true to use cookies.
 */
async function canUseCredentials(config) {
    let provider = createAvalancheProvider(config);
    provider.setRequestConfig('withCredentials', true);
    let infoApi = provider.Info();
    // Make a dummy request with credentials
    try {
        await infoApi.getNetworkID();
        return true;
        // eslint-disable-next-line
    }
    catch (e) { }
    provider.setRequestConfig('withCredentials', false);
    try {
        await infoApi.getNetworkID();
    }
    catch (e) {
        throw new Error('Unable to connect.');
    }
    return false;
}
exports.canUseCredentials = canUseCredentials;
//# sourceMappingURL=network_helper.js.map