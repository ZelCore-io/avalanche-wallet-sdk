"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketProvider = void 0;
const AVMWebSocketProvider_1 = require("../../Network/providers/AVMWebSocketProvider");
const EVMWebSocketProvider_1 = require("../../Network/providers/EVMWebSocketProvider");
const network_helper_1 = require("../../helpers/network_helper");
const network_1 = require("../../Network/network");
class WebsocketProvider {
    avmProvider;
    evmProvider;
    constructor(avmEndpoint, evmEndpoint) {
        this.avmProvider = new AVMWebSocketProvider_1.AVMWebSocketProvider(avmEndpoint);
        this.evmProvider = new EVMWebSocketProvider_1.EVMWebSocketProvider(evmEndpoint);
    }
    static fromActiveNetwork() {
        return WebsocketProvider.fromNetworkConfig(network_1.activeNetwork);
    }
    static fromNetworkConfig(config) {
        let evm = (0, network_helper_1.wsUrlFromConfigEVM)(config);
        let avm = (0, network_helper_1.wsUrlFromConfigX)(config);
        return new WebsocketProvider(avm, evm);
    }
    setEndpoints(avmEndpoint, evmEndpoint) {
        this.avmProvider.setEndpoint(avmEndpoint);
        this.evmProvider.setEndpoint(evmEndpoint);
    }
    setNetwork(config) {
        let evm = (0, network_helper_1.wsUrlFromConfigEVM)(config);
        let avm = (0, network_helper_1.wsUrlFromConfigX)(config);
        this.setEndpoints(avm, evm);
    }
    trackWallet(wallet) {
        this.avmProvider.trackWallet(wallet);
        this.evmProvider.trackWallet(wallet);
    }
    removeWallet(wallet) {
        this.avmProvider.removeWallet(wallet);
        this.evmProvider.removeWallet(wallet);
    }
}
exports.WebsocketProvider = WebsocketProvider;
//# sourceMappingURL=WebsocketProvider.js.map