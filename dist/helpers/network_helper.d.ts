import { NetworkConfig } from '../Network/types';
import { Avalanche } from '@avalabs/avalanchejs';
import { HttpClient } from './http_client';
export declare function wsUrlFromConfigX(config: NetworkConfig): string;
export declare function wsUrlFromConfigEVM(config: NetworkConfig): string;
/**
 * Given the base url of an Avalanche API, requests the Network ID
 * @param url The base url for the Avalanche API
 */
export declare function getNetworkIdFromURL(url: string): Promise<number>;
export declare function createAvalancheProvider(config: NetworkConfig): Avalanche;
/**
 * Given a network configuration returns an HttpClient instance connected to the explorer
 */
export declare function createExplorerApi(networkConfig: NetworkConfig): HttpClient;
/**
 * Checks if the given network accepts credentials.
 * This must be true to use cookies.
 */
export declare function canUseCredentials(config: NetworkConfig): Promise<boolean>;
//# sourceMappingURL=network_helper.d.ts.map