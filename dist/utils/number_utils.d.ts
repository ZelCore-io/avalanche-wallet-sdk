/// <reference types="bn.js" />
import { BN } from '@avalabs/avalanchejs';
import Big from 'big.js';
declare module 'big.js' {
    interface Big {
        toLocaleString(toFixed?: number): string;
    }
}
/**
 * @param val the amount to parse
 * @param denomination number of decimal places to parse with
 */
export declare function bnToBig(val: BN, denomination?: number): Big;
/**
 * Converts a BN amount of 18 decimals to 9.
 * Used for AVAX C <-> X,P conversions
 * @param amount
 */
export declare function avaxCtoX(amount: BN): BN;
export declare function avaxXtoC(amount: BN): BN;
export declare function avaxPtoC(amount: BN): BN;
export declare function bnToBigAvaxX(val: BN): Big;
export declare function bnToBigAvaxP(val: BN): Big;
export declare function bnToBigAvaxC(val: BN): Big;
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
export declare function bnToAvaxC(val: BN): string;
/**
 * Parses the value using a denomination of 9
 *
 * @param val the amount to parse given in nAVAX
 */
export declare function bnToAvaxX(val: BN): string;
/**
 * Parses the value using a denomination of 9
 *
 * @param val the amount to parse given in nAVAX
 */
export declare function bnToAvaxP(val: BN): string;
/**
 *
 * @param val the number to parse
 * @param decimals number of decimal places used to parse the number
 */
export declare function numberToBN(val: number | string, decimals: number): BN;
export declare function numberToBNAvaxX(val: number | string): BN;
export declare function numberToBNAvaxP(val: number | string): BN;
export declare function numberToBNAvaxC(val: number | string): BN;
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
export declare function bnToLocaleString(val: BN, decimals?: number): string;
export declare function bigToLocaleString(bigVal: Big, decimals?: number): string;
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
export declare function stringToBN(value: string, decimals: number): BN;
export declare function bigToBN(val: Big, denom: number): BN;
//# sourceMappingURL=number_utils.d.ts.map