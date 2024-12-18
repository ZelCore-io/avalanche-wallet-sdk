"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseNftPayload = exports.digestMessage = exports.isValidAddress = void 0;
const tslib_1 = require("tslib");
const avalanche_1 = require("avalanche");
const address_helper_1 = require("../helpers/address_helper");
const create_hash_1 = tslib_1.__importDefault(require("create-hash"));
const utils_1 = require("avalanche/dist/utils");
/**
 * Checks if address is valid.
 *
 * @return
 * boolean if address is valid, error message if not valid.
 */
function isValidAddress(address) {
    return (0, address_helper_1.validateAddress)(address) === true;
}
exports.isValidAddress = isValidAddress;
function digestMessage(msgStr) {
    let mBuf = Buffer.from(msgStr, 'utf8');
    let msgSize = Buffer.alloc(4);
    msgSize.writeUInt32BE(mBuf.length, 0);
    let msgBuf = Buffer.from(`\x1AAvalanche Signed Message:\n${msgSize}${msgStr}`, 'utf8');
    return (0, create_hash_1.default)('sha256').update(msgBuf).digest();
}
exports.digestMessage = digestMessage;
let payloadtypes = utils_1.PayloadTypes.getInstance();
function parseNftPayload(rawPayload) {
    let payload = avalanche_1.Buffer.from(rawPayload, 'base64');
    payload = avalanche_1.Buffer.concat([new avalanche_1.Buffer(4).fill(payload.length), payload]);
    let typeId = payloadtypes.getTypeID(payload);
    let pl = payloadtypes.getContent(payload);
    let payloadbase = payloadtypes.select(typeId, pl);
    return payloadbase;
}
exports.parseNftPayload = parseNftPayload;
//# sourceMappingURL=utils.js.map