"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.networkEvents = exports.emitNetworkChange = void 0;
const tslib_1 = require("tslib");
const events_1 = tslib_1.__importDefault(require("events"));
/**
 * Fire network change event
 * @param newNetwork The newly connected network config
 */
function emitNetworkChange(newNetwork) {
    exports.networkEvents.emit('network_change', newNetwork);
}
exports.emitNetworkChange = emitNetworkChange;
const MAX_LISTENERS = 100;
exports.networkEvents = new events_1.default();
exports.networkEvents.setMaxListeners(MAX_LISTENERS);
//# sourceMappingURL=eventEmitter.js.map