import { setRpcNetwork, setRpcNetworkAsync } from '../Network/network';
import { emitNetworkChange } from '../Network/eventEmitter';
import { bustErc20Cache } from '../Asset/Erc20';
export function setNetwork(conf) {
    setRpcNetwork(conf);
    emitNetworkChange(conf);
    bustErc20Cache();
}
/**
 * Unlike `setNetwork` this function will fail if the network is not available.
 * @param conf
 */
export async function setNetworkAsync(conf) {
    await setRpcNetworkAsync(conf);
    emitNetworkChange(conf);
    bustErc20Cache();
}
//# sourceMappingURL=setNetwork.js.map