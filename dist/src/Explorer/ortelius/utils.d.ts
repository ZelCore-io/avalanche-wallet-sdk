/// <reference types="bn.js" />
import { OrteliusAvalancheTx } from '@/Explorer';
import { BN } from 'avalanche';
/**
 * Given an array of transactions from the explorer, filter out duplicate transactions
 * @param txs
 */
export declare function filterDuplicateOrtelius(txs: OrteliusAvalancheTx[]): OrteliusAvalancheTx[];
/**
 * Returns the source chain id.
 * @param tx Tx data from the explorer.
 */
export declare function findSourceChain(tx: OrteliusAvalancheTx): string;
/**
 * Returns the destination chain id.
 * @param tx Tx data from the explorer.
 */
export declare function findDestinationChain(tx: OrteliusAvalancheTx): string;
export declare function getStakeAmount(tx: OrteliusAvalancheTx): BN;
//# sourceMappingURL=utils.d.ts.map