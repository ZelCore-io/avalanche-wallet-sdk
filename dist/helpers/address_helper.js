"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddressChain = exports.getAddressHRP = exports.validateAddressEVM = exports.validateAddressP = exports.validateAddressC = exports.validateAddressX = exports.validateAddress = void 0;
const tslib_1 = require("tslib");
const web3_1 = tslib_1.__importDefault(require("web3"));
const common_1 = require("../common");
const validateAddress = (address) => {
    return (validateAddressX(address) ||
        validateAddressP(address) ||
        validateAddressC(address) ||
        validateAddressEVM(address));
};
exports.validateAddress = validateAddress;
function validateAddressX(address) {
    try {
        let buff = common_1.bintools.parseAddress(address, 'X');
        if (!buff)
            return false;
        return true;
    }
    catch (error) {
        return false;
    }
}
exports.validateAddressX = validateAddressX;
function validateAddressC(address) {
    try {
        let buff = common_1.bintools.parseAddress(address, 'C');
        if (!buff)
            return false;
        return true;
    }
    catch (error) {
        return false;
    }
}
exports.validateAddressC = validateAddressC;
function validateAddressP(address) {
    try {
        let buff = common_1.bintools.parseAddress(address, 'P');
        if (!buff)
            return false;
        return true;
    }
    catch (error) {
        return false;
    }
}
exports.validateAddressP = validateAddressP;
function validateAddressEVM(address) {
    return web3_1.default.utils.isAddress(address);
}
exports.validateAddressEVM = validateAddressEVM;
/**
 * Returns the human readable part of a X or P bech32 address.
 * @param address
 */
function getAddressHRP(address) {
    if (!(0, exports.validateAddress)(address)) {
        throw new Error('Invalid X or P address.');
    }
    return address.split('-')[1].split('1')[0];
}
exports.getAddressHRP = getAddressHRP;
/**
 * Given an address, return which Chain it belongs to
 * @param address
 */
function getAddressChain(address) {
    if (!(0, exports.validateAddress)(address)) {
        throw new Error('Invalid address.');
    }
    if (web3_1.default.utils.isAddress(address)) {
        return 'C';
    }
    else {
        return address[0];
    }
}
exports.getAddressChain = getAddressChain;
//# sourceMappingURL=address_helper.js.map