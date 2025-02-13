import { AVMWebSocketProvider } from '../../Network/providers/AVMWebSocketProvider';
import { EVMWebSocketProvider } from '../../Network/providers/EVMWebSocketProvider';
import { WalletType } from '../../Wallet/types';
import { NetworkConfig } from '../../Network/types';
export declare class WebsocketProvider {
    avmProvider: AVMWebSocketProvider;
    evmProvider: EVMWebSocketProvider;
    constructor(avmEndpoint: string, evmEndpoint: string);
    static fromActiveNetwork(): WebsocketProvider;
    static fromNetworkConfig(config: NetworkConfig): WebsocketProvider;
    setEndpoints(avmEndpoint: string, evmEndpoint: string): void;
    setNetwork(config: NetworkConfig): void;
    trackWallet(wallet: WalletType): void;
    removeWallet(wallet: WalletType): void;
}
//# sourceMappingURL=WebsocketProvider.d.ts.map