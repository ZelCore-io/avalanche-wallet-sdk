import { BN } from 'avalanche';
import Big from 'big.js';
Big.prototype.toLocaleString = function (toFixed = 9) {
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
export function bnToBig(val, denomination = 0) {
    let mult = Big(10).pow(denomination);
    return new Big(val.toString()).div(mult);
}
/**
 * Converts a BN amount of 18 decimals to 9.
 * Used for AVAX C <-> X,P conversions
 * @param amount
 */
export function avaxCtoX(amount) {
    let tens = new BN(10).pow(new BN(9));
    return amount.div(tens);
}
export function avaxXtoC(amount) {
    let tens = new BN(10).pow(new BN(9));
    return amount.mul(tens);
}
export function avaxPtoC(amount) {
    return avaxXtoC(amount);
}
export function bnToBigAvaxX(val) {
    return bnToBig(val, 9);
}
export function bnToBigAvaxP(val) {
    return bnToBigAvaxX(val);
}
export function bnToBigAvaxC(val) {
    return bnToBig(val, 18);
}
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
export function bnToAvaxC(val) {
    return bnToLocaleString(val, 18);
}
/**
 * Parses the value using a denomination of 9
 *
 * @param val the amount to parse given in nAVAX
 */
export function bnToAvaxX(val) {
    return bnToLocaleString(val, 9);
}
/**
 * Parses the value using a denomination of 9
 *
 * @param val the amount to parse given in nAVAX
 */
export function bnToAvaxP(val) {
    return bnToAvaxX(val);
}
/**
 *
 * @param val the number to parse
 * @param decimals number of decimal places used to parse the number
 */
export function numberToBN(val, decimals) {
    let valBig = Big(val);
    let tens = Big(10).pow(decimals);
    let valBN = new BN(valBig.times(tens).toFixed(0));
    return valBN;
}
export function numberToBNAvaxX(val) {
    return numberToBN(val, 9);
}
export function numberToBNAvaxP(val) {
    return numberToBNAvaxX(val);
}
export function numberToBNAvaxC(val) {
    return numberToBN(val, 18);
}
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
export function bnToLocaleString(val, decimals = 9) {
    let bigVal = bnToBig(val, decimals);
    return bigToLocaleString(bigVal, decimals);
}
export function bigToLocaleString(bigVal, decimals = 9) {
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
export function stringToBN(value, decimals) {
    let big = Big(value);
    let tens = Big(10).pow(decimals);
    let mult = big.times(tens);
    let rawStr = mult.toFixed(0, 0);
    return new BN(rawStr);
}
export function bigToBN(val, denom) {
    let denomFlr = Math.floor(denom);
    if (denomFlr < 0)
        throw new Error('Denomination can not be less that 0.');
    const bnBig = val.mul(Big(10).pow(denomFlr));
    const bnStr = bnBig.toFixed(0, 0);
    return new BN(bnStr);
}
//# sourceMappingURL=number_utils.js.map