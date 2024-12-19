export function strip0x(addr) {
    if (addr.substring(0, 2) === '0x') {
        return addr.substring(2);
    }
    return addr;
}
//# sourceMappingURL=strip0x.js.map