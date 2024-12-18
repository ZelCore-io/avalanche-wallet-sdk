import { AVMWebSocketProvider } from '../../Network/providers/AVMWebSocketProvider';
import { EVMWebSocketProvider } from '../../Network/providers/EVMWebSocketProvider';
import { wsUrlFromConfigEVM, wsUrlFromConfigX } from '../../helpers/network_helper';
import { activeNetwork } from '../../Network/network';
export class WebsocketProvider {
    avmProvider;
    evmProvider;
    constructor(avmEndpoint, evmEndpoint) {
        this.avmProvider = new AVMWebSocketProvider(avmEndpoint);
        this.evmProvider = new EVMWebSocketProvider(evmEndpoint);
    }
    static fromActiveNetwork() {
        return WebsocketProvider.fromNetworkConfig(activeNetwork);
    }
    static fromNetworkConfig(config) {
        let evm = wsUrlFromConfigEVM(config);
        let avm = wsUrlFromConfigX(config);
        return new WebsocketProvider(avm, evm);
    }
    setEndpoints(avmEndpoint, evmEndpoint) {
        this.avmProvider.setEndpoint(avmEndpoint);
        this.evmProvider.setEndpoint(evmEndpoint);
    }
    setNetwork(config) {
        let evm = wsUrlFromConfigEVM(config);
        let avm = wsUrlFromConfigX(config);
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
//# sourceMappingURL=WebsocketProvider.js.map