import { LocalnetConfig, MainnetConfig, TestnetConfig } from '@/Network/constants';
import { activeNetwork } from '@/Network/network';
export function isFujiNetwork(activeNetwork) {
    return activeNetwork.networkID === TestnetConfig.networkID;
}
export function isFujiNetworkId(id) {
    return id === TestnetConfig.networkID;
}
export function isMainnetNetwork(activeNetwork) {
    return activeNetwork.networkID === MainnetConfig.networkID;
}
export function isMainnetNetworkId(id) {
    return id === MainnetConfig.networkID;
}
export function isLocalNetwork(activeNetwork) {
    return activeNetwork.networkID === LocalnetConfig.networkID;
}
export function getAvaxAssetID() {
    return activeNetwork.avaxID;
}
export function getActiveNetworkConfig() {
    return activeNetwork;
}
//# sourceMappingURL=utils.js.map