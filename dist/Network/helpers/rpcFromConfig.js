"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRpcP = exports.getRpcX = exports.getRpcC = void 0;
function getRpcC(conf) {
    return `${conf.apiProtocol}://${conf.apiIp}:${conf.apiPort}/ext/bc/C/rpc`;
}
exports.getRpcC = getRpcC;
function getRpcX(conf) {
    return `${conf.apiProtocol}://${conf.apiIp}:${conf.apiPort}/ext/bc/X`;
}
exports.getRpcX = getRpcX;
function getRpcP(conf) {
    return `${conf.apiProtocol}://${conf.apiIp}:${conf.apiPort}/ext/bc/P`;
}
exports.getRpcP = getRpcP;
//# sourceMappingURL=rpcFromConfig.js.map