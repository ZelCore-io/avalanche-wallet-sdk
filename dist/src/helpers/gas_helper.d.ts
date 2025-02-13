/// <reference types="bn.js" />
import { BN } from 'avalanche';
import { ExportChainsC } from '@/Wallet/types';
/**
 * Returns the current gas price in WEI from the network
 */
export declare function getGasPrice(): Promise<BN>;
/**
 * Returns the gas price + 25%, or max gas
 */
export declare function getAdjustedGasPrice(): Promise<BN>;
/**
 *
 * @param val
 * @param perc What percentage to adjust with
 */
export declare function adjustValue(val: BN, perc: number): BN;
/**
 * Returns the base fee from the network.
 */
export declare function getBaseFee(): Promise<BN>;
/**
 * Returns the current base fee + 25%
 */
export declare function getBaseFeeRecommended(): Promise<BN>;
/**
 * Returns the base max priority fee from the network.
 */
export declare function getMaxPriorityFee(): Promise<BN>;
/**
 * Calculate max fee for EIP 1559 transactions given baseFee and maxPriorityFee.
 * According to https://www.blocknative.com/blog/eip-1559-fees
 * @param baseFee in WEI
 * @param maxPriorityFee in WEI
 */
export declare function calculateMaxFee(baseFee: BN, maxPriorityFee: BN): BN;
/**
 * Creates a mock import transaction and estimates the gas required for it. Returns fee in units of gas.
 * @param numIns Number of inputs for the import transaction.
 * @param numSigs Number of signatures used in the import transactions. This value is the sum of owner addresses in every UTXO.
 */
export declare function estimateImportGasFeeFromMockTx(numIns: number | undefined, numSigs: number): number;
/**
 * Estimates the gas fee using a mock ExportTx built from the passed values.
 * @param destinationChain `X` or `P`
 * @param amount in nAVAX
 * @param from The C chain hex address exported from
 * @param to The destination X or P address
 */
export declare function estimateExportGasFeeFromMockTx(destinationChain: ExportChainsC, amount: BN, from: string, to: string): number;
/**
 * Returns the estimated gas for the export transaction.
 * @param destinationChain Either `X` or `P`
 * @param amount The amount to export. In nAVAX.
 * @param from The C chain hex address exporting the asset
 * @param fromBech The C chain bech32 address exporting the asset
 * @param to The destination address on the destination chain
 */
export declare function estimateExportGasFee(destinationChain: ExportChainsC, from: string, fromBech: string, to: string, amount: BN): Promise<number>;
//# sourceMappingURL=gas_helper.d.ts.map