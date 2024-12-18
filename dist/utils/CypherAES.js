"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CypherAES = void 0;
const tslib_1 = require("tslib");
const core_1 = tslib_1.__importDefault(require("crypto-js/core"));
const aes_1 = tslib_1.__importDefault(require("crypto-js/aes"));
const randomstring_1 = tslib_1.__importDefault(require("randomstring"));
/**
 * A helper class to obfuscate strings when storing in memory. Used as a helper rather than secure encryption.
 * @Remarks Do NOT use this class for actual secure encryption needs.
 */
class CypherAES {
    pass;
    encrypted;
    constructor(value) {
        this.pass = randomstring_1.default.generate(32);
        this.encrypted = aes_1.default.encrypt(value, this.pass).toString();
    }
    getValue() {
        return aes_1.default.decrypt(this.encrypted, this.pass).toString(core_1.default.enc.Utf8);
    }
}
exports.CypherAES = CypherAES;
//# sourceMappingURL=CypherAES.js.map