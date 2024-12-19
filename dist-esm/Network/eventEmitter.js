import EventEmitter from 'events';
/**
 * Fire network change event
 * @param newNetwork The newly connected network config
 */
export function emitNetworkChange(newNetwork) {
    networkEvents.emit('network_change', newNetwork);
}
const MAX_LISTENERS = 100;
export const networkEvents = new EventEmitter();
networkEvents.setMaxListeners(MAX_LISTENERS);
//# sourceMappingURL=eventEmitter.js.map