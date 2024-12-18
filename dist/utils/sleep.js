"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = void 0;
async function sleep(durMs) {
    return new Promise((resolve) => {
        setTimeout(resolve, durMs);
    });
}
exports.sleep = sleep;
//# sourceMappingURL=sleep.js.map