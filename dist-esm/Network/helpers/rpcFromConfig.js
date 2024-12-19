export function getRpcC(conf) {
    return `${conf.apiProtocol}://${conf.apiIp}:${conf.apiPort}/ext/bc/C/rpc`;
}
export function getRpcX(conf) {
    return `${conf.apiProtocol}://${conf.apiIp}:${conf.apiPort}/ext/bc/X`;
}
export function getRpcP(conf) {
    return `${conf.apiProtocol}://${conf.apiIp}:${conf.apiPort}/ext/bc/P`;
}
//# sourceMappingURL=rpcFromConfig.js.map