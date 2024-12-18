"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const bip32_1 = tslib_1.__importDefault(require("bip32"));
const ecc = tslib_1.__importStar(require("tiny-secp256k1"));
// You must wrap a tiny-secp256k1 compatible implementation
const bip32 = (0, bip32_1.default)(ecc);
exports.default = bip32;
//# sourceMappingURL=bip32.js.map