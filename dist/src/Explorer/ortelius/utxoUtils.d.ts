/// <reference types="bn.js" />
import { OrteliusUTXO } from '@/Explorer';
import { BN } from 'avalanche';
import { iHistoryBaseTxTokenOwners } from '@/History';
export declare function filterDuplicateStrings(vals: string[]): string[];
export declare function isArraysOverlap(arr1: any[], arr2: any[]): boolean;
/**
 * Returns true if this utxo is owned by any of the given addresses
 * @param ownerAddrs Addresses to check against
 * @param output The UTXO
 */
export declare function isOutputOwner(ownerAddrs: string[], output: OrteliusUTXO): boolean;
export declare function isOutputOwnerC(ownerAddr: string, output: OrteliusUTXO): boolean;
/**
 * Returns the total amount of `assetID` in the given `utxos` owned by `address`. Checks for X/P addresses.
 * @param utxos UTXOs to calculate balance from.
 * @param addresses The wallet's  addresses.
 * @param assetID Only count outputs of this asset ID.
 * @param chainID Only count the outputs on this chain.
 * @param isStake Set to `true` if looking for staking utxos.
 */
export declare function getAssetBalanceFromUTXOs(utxos: OrteliusUTXO[], addresses: string[], assetID: string, chainID: string, isStake?: boolean): BN;
/**
 * Returns the total amount of `assetID` in the given `utxos` owned by `address`. Checks for EVM address.
 * @param utxos UTXOs to calculate balance from.
 * @param address The wallet's  evm address `0x...`.
 * @param assetID Only count outputs of this asset ID.
 * @param chainID Only count the outputs on this chain.
 * @param isStake Set to `true` if looking for staking utxos.
 */
export declare function getEvmAssetBalanceFromUTXOs(utxos: OrteliusUTXO[], address: string, assetID: string, chainID: string, isStake?: boolean): BN;
/**
 * Returns UTXOs owned by the given addresses
 * @param outs UTXOs to filter
 * @param myAddrs Addresses to filter by
 */
export declare function getOwnedOutputs(outs: OrteliusUTXO[], myAddrs: string[]): OrteliusUTXO[];
/**
 * Returns addresses of the given UTXOs
 * @param outs UTXOs to get the addresses of.
 */
export declare function getAddresses(outs: OrteliusUTXO[]): string[];
/**
 * Returns only the UTXOs of the given asset id.
 * @param outs
 * @param assetID
 */
export declare function getAssetOutputs(outs: OrteliusUTXO[], assetID: string): OrteliusUTXO[];
/**
 * Returns UTXOs not owned by the given addresses
 * @param outs UTXOs to filter
 * @param myAddrs Addresses to filter by
 */
export declare function getNotOwnedOutputs(outs: OrteliusUTXO[], myAddrs: string[]): OrteliusUTXO[];
export declare function getOutputTotals(outs: OrteliusUTXO[]): BN;
export declare function getRewardOuts(outs: OrteliusUTXO[]): OrteliusUTXO[];
/**
 * Returns outputs belonging to the given chain ID
 * @param outs UTXOs to filter
 * @param chainID Chain ID to filter by
 */
export declare function getOutputsOfChain(outs: OrteliusUTXO[], chainID: string): OrteliusUTXO[];
/**
 * Filters the UTXOs of a certain output type
 * @param outs UTXOs to filter
 * @param type Output type to filter by
 */
export declare function getOutputsOfType(outs: OrteliusUTXO[], type: number): OrteliusUTXO[];
/**
 * Returns a map of asset id to owner addresses
 * @param outs
 */
export declare function getOutputsAssetOwners(outs: OrteliusUTXO[]): iHistoryBaseTxTokenOwners;
/**
 * Returns an array of Asset IDs from the given UTXOs
 * @param outs Array of UTXOs
 */
export declare function getOutputsAssetIDs(outs: OrteliusUTXO[]): string[];
//# sourceMappingURL=utxoUtils.d.ts.map