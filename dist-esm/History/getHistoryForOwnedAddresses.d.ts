import { OrteliusAvalancheTx } from '@/Explorer';
export declare function getHistoryX(addrs: string[], limit?: number): Promise<OrteliusAvalancheTx[]>;
export declare function getHistoryP(addrs: string[], limit?: number): Promise<OrteliusAvalancheTx[]>;
/**
 * Returns atomic history for this wallet on the C chain.
 * @remarks Excludes EVM transactions.
 * @param limit
 */
export declare function getHistoryC(addrC: string, addrsX: string[], limit?: number): Promise<OrteliusAvalancheTx[]>;
/**
 * Returns history for this wallet on the C chain.
 * @remarks Excludes atomic C chain import/export transactions.
 */
export declare function getHistoryEVM(addr: string): Promise<import("@/Explorer").OrteliusEvmTx[]>;
/**
 *
 * @param xAddresses A list of owned X chain addresses
 * @param pAddresses A list of owned P chain addresses
 * @param cAddress Bech32 C chain address
 * @param evmAddress Hex C chain address
 * @param limit
 */
export declare function getHistoryForOwnedAddresses(xAddresses: string[], pAddresses: string[], cAddress: string, evmAddress: string, limit?: number): Promise<import("./types").iHistoryItem[]>;
/**
 * Returns sorted history data from Ortelius for X, P, and C chains.
 * @param xAddresses A list of owned X chain addresses
 * @param pAddresses A list of owned P chain addresses
 * @param cAddress Bech32 C chain address
 * @param limit Number of transactions to fetch, undefined or 0 for all history
 */
export declare function getHistoryForOwnedAddressesRaw(xAddresses: string[], pAddresses: string[], cAddress: string, limit?: number): Promise<OrteliusAvalancheTx[]>;
