import { Buffer as BufferAvalanche } from '@avalabs/avalanchejs';
import { validateAddress } from '../helpers/address_helper';
import createHash from 'create-hash';
import { PayloadTypes } from '@avalabs/avalanchejs/dist/utils';
/**
 * Checks if address is valid.
 *
 * @return
 * boolean if address is valid, error message if not valid.
 */
export function isValidAddress(address) {
    return validateAddress(address) === true;
}
export function digestMessage(msgStr) {
    let mBuf = Buffer.from(msgStr, 'utf8');
    let msgSize = Buffer.alloc(4);
    msgSize.writeUInt32BE(mBuf.length, 0);
    let msgBuf = Buffer.from(`\x1AAvalanche Signed Message:\n${msgSize}${msgStr}`, 'utf8');
    return createHash('sha256').update(msgBuf).digest();
}
let payloadtypes = PayloadTypes.getInstance();
export function parseNftPayload(rawPayload) {
    let payload = BufferAvalanche.from(rawPayload, 'base64');
    payload = BufferAvalanche.concat([new BufferAvalanche(4).fill(payload.length), payload]);
    let typeId = payloadtypes.getTypeID(payload);
    let pl = payloadtypes.getContent(payload);
    let payloadbase = payloadtypes.select(typeId, pl);
    return payloadbase;
}
//# sourceMappingURL=utils.js.map