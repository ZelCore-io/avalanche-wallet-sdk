"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.strip0x = void 0;
function strip0x(addr) {
    if (addr.substring(0, 2) === '0x') {
        return addr.substring(2);
    }
    return addr;
}
exports.strip0x = strip0x;
//# sourceMappingURL=strip0x.js.map