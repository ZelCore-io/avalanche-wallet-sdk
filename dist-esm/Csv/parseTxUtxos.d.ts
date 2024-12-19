import { OrteliusAvalancheTx, OrteliusTransactionType } from '../Explorer';
import { ChainIdType } from '../common';
interface ParsedTxUtxos {
    txID: string;
    timeStamp: Date;
    unixTime: string;
    txType: OrteliusTransactionType;
    chain: ChainIdType;
    isInput: boolean;
    isOwner: boolean;
    amount: string;
    owners: string[];
    locktime: number;
    threshold: number;
    assetID: string;
}
/**
 * Given an array of Ortelius transaction data return input and outputs as a single unified array
 * @param txs
 * @param ownedAddresses
 */
export declare function parseTxUtxos(txs: OrteliusAvalancheTx[], ownedAddresses: string[]): ParsedTxUtxos[];
/**
 * Create CSV file contents from the given Ortelius transactions.
 * @param txs Array of Ortelius Transactions
 * @param ownedAddresses Addresses owned by the wallet.
 */
export declare function createCsvFileOrtelius(txs: OrteliusAvalancheTx[], ownedAddresses: string[]): string;
export {};
