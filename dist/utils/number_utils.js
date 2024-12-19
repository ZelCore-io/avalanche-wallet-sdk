"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bigToBN = exports.stringToBN = exports.bigToLocaleString = exports.bnToLocaleString = exports.numberToBNAvaxC = exports.numberToBNAvaxP = exports.numberToBNAvaxX = exports.numberToBN = exports.bnToAvaxP = exports.bnToAvaxX = exports.bnToAvaxC = exports.bnToBigAvaxC = exports.bnToBigAvaxP = exports.bnToBigAvaxX = exports.avaxPtoC = exports.avaxXtoC = exports.avaxCtoX = exports.bnToBig = void 0;
const tslib_1 = require("tslib");
const avalanchejs_1 = require("@avalabs/avalanchejs");
const big_js_1 = tslib_1.__importDefault(require("big.js"));
big_js_1.default.prototype.toLocaleString = function (toFixed = 9) {
    let fixedStr = this.toFixed(toFixed, 0);
    let split = fixedStr.split('.');
    let wholeStr = parseInt(split[0]).toLocaleString('en-US');
    if (split.length === 1) {
        return wholeStr;
    }
    else {
        let remainderStr = split[1];
        // remove trailing 0s
        let lastChar = remainderStr.charAt(remainderStr.length - 1);
        while (lastChar === '0') {
            remainderStr = remainderStr.substring(0, remainderStr.length - 1);
            lastChar = remainderStr.charAt(remainderStr.length - 1);
        }
        let trimmed = remainderStr.substring(0, toFixed);
        if (!trimmed)
            return wholeStr;
        return `${wholeStr}.${trimmed}`;
    }
};
/**
 * @param val the amount to parse
 * @param denomination number of decimal places to parse with
 */
function bnToBig(val, denomination = 0) {
    let mult = (0, big_js_1.default)(10).pow(denomination);
    return new big_js_1.default(val.toString()).div(mult);
}
exports.bnToBig = bnToBig;
/**
 * Converts a BN amount of 18 decimals to 9.
 * Used for AVAX C <-> X,P conversions
 * @param amount
 */
function avaxCtoX(amount) {
    let tens = new avalanchejs_1.BN(10).pow(new avalanchejs_1.BN(9));
    return amount.div(tens);
}
exports.avaxCtoX = avaxCtoX;
function avaxXtoC(amount) {
    let tens = new avalanchejs_1.BN(10).pow(new avalanchejs_1.BN(9));
    return amount.mul(tens);
}
exports.avaxXtoC = avaxXtoC;
function avaxPtoC(amount) {
    return avaxXtoC(amount);
}
exports.avaxPtoC = avaxPtoC;
function bnToBigAvaxX(val) {
    return bnToBig(val, 9);
}
exports.bnToBigAvaxX = bnToBigAvaxX;
function bnToBigAvaxP(val) {
    return bnToBigAvaxX(val);
}
exports.bnToBigAvaxP = bnToBigAvaxP;
function bnToBigAvaxC(val) {
    return bnToBig(val, 18);
}
exports.bnToBigAvaxC = bnToBigAvaxC;
/**
 * Parses the value using a denomination of 18
 *
 * @param val the amount to parse given in WEI
 *
 * @example
 * ```
 * bnToAvaxC(new BN('22500000000000000000')
 * // will return  22.5
 *```
 *
 */
function bnToAvaxC(val) {
    return bnToLocaleString(val, 18);
}
exports.bnToAvaxC = bnToAvaxC;
/**
 * Parses the value using a denomination of 9
 *
 * @param val the amount to parse given in nAVAX
 */
function bnToAvaxX(val) {
    return bnToLocaleString(val, 9);
}
exports.bnToAvaxX = bnToAvaxX;
/**
 * Parses the value using a denomination of 9
 *
 * @param val the amount to parse given in nAVAX
 */
function bnToAvaxP(val) {
    return bnToAvaxX(val);
}
exports.bnToAvaxP = bnToAvaxP;
/**
 *
 * @param val the number to parse
 * @param decimals number of decimal places used to parse the number
 */
function numberToBN(val, decimals) {
    let valBig = (0, big_js_1.default)(val);
    let tens = (0, big_js_1.default)(10).pow(decimals);
    let valBN = new avalanchejs_1.BN(valBig.times(tens).toFixed(0));
    return valBN;
}
exports.numberToBN = numberToBN;
function numberToBNAvaxX(val) {
    return numberToBN(val, 9);
}
exports.numberToBNAvaxX = numberToBNAvaxX;
function numberToBNAvaxP(val) {
    return numberToBNAvaxX(val);
}
exports.numberToBNAvaxP = numberToBNAvaxP;
function numberToBNAvaxC(val) {
    return numberToBN(val, 18);
}
exports.numberToBNAvaxC = numberToBNAvaxC;
/**
 * @Remarks
 * A helper method to convert BN numbers to human readable strings.
 *
 * @param val The amount to convert
 * @param decimals Number of decimal places to parse the amount with
 *
 * @example
 * ```
 * bnToLocaleString(new BN(100095),2)
 * // will return '1,000.95'
 * ```
 */
function bnToLocaleString(val, decimals = 9) {
    let bigVal = bnToBig(val, decimals);
    return bigToLocaleString(bigVal, decimals);
}
exports.bnToLocaleString = bnToLocaleString;
function bigToLocaleString(bigVal, decimals = 9) {
    let fixedStr = bigVal.toFixed(decimals);
    let split = fixedStr.split('.');
    let wholeStr = parseInt(split[0]).toLocaleString('en-US');
    if (split.length === 1) {
        return wholeStr;
    }
    else {
        let remainderStr = split[1];
        // remove trailing 0s
        let lastChar = remainderStr.charAt(remainderStr.length - 1);
        while (lastChar === '0') {
            remainderStr = remainderStr.substring(0, remainderStr.length - 1);
            lastChar = remainderStr.charAt(remainderStr.length - 1);
        }
        let trimmed = remainderStr.substring(0, decimals);
        if (!trimmed)
            return wholeStr;
        return `${wholeStr}.${trimmed}`;
    }
}
exports.bigToLocaleString = bigToLocaleString;
/**
 * Converts a string to a BN value of the given denomination.
 * @param value The string value of the
 * @param decimals
 *
 * @example
 * ```
 * stringToBN('1.32', 5) // is same as BN(132000)
 * ```
 */
function stringToBN(value, decimals) {
    let big = (0, big_js_1.default)(value);
    let tens = (0, big_js_1.default)(10).pow(decimals);
    let mult = big.times(tens);
    let rawStr = mult.toFixed(0, 0);
    return new avalanchejs_1.BN(rawStr);
}
exports.stringToBN = stringToBN;
function bigToBN(val, denom) {
    let denomFlr = Math.floor(denom);
    if (denomFlr < 0)
        throw new Error('Denomination can not be less that 0.');
    const bnBig = val.mul((0, big_js_1.default)(10).pow(denomFlr));
    const bnStr = bnBig.toFixed(0, 0);
    return new avalanchejs_1.BN(bnStr);
}
exports.bigToBN = bigToBN;
//# sourceMappingURL=number_utils.js.map