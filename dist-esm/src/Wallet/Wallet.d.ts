/// <reference types="node" />
/// <reference types="bn.js" />
import { AssetBalanceP, AssetBalanceRawX, BTCNetworkType, ERC20Balance, ExportChainsC, ExportChainsP, ExportChainsX, iAvaxBalance, WalletBalanceX, WalletEventArgsType, WalletEventType, WalletNameType } from './types';
import { BN } from 'avalanche';
import { TypedTransaction } from '@ethereumjs/tx';
import { EvmWallet } from '@/Wallet/EVM/EvmWallet';
import { UTXOSet as AVMUTXOSet, UnsignedTx as AVMUnsignedTx, UTXO as AVMUTXO, Tx as AvmTx } from 'avalanche/dist/apis/avm';
import { UTXOSet as PlatformUTXOSet, UTXO as PlatformUTXO, UnsignedTx as PlatformUnsignedTx, Tx as PlatformTx } from 'avalanche/dist/apis/platformvm';
import { UnsignedTx as EVMUnsignedTx, Tx as EVMTx, UTXOSet as EVMUTXOSet } from 'avalanche/dist/apis/evm';
import { PayloadBase } from 'avalanche/dist/utils';
import { EvmWalletReadonly } from '@/Wallet/EVM/EvmWalletReadonly';
import EventEmitter from 'events';
import { HistoryItemType } from '@/History';
import { ChainIdType } from '@/common';
import { UniversalTx } from '@/UniversalTx';
import { GetStakeResponse } from 'avalanche/dist/apis/platformvm/interfaces';
import { NetworkConfig } from '@/Network';
import { OrteliusAvalancheTx } from '@/Explorer';
import { TypedDataV1, TypedMessage } from '@metamask/eth-sig-util';
export declare abstract class WalletProvider {
    abstract type: WalletNameType;
    abstract evmWallet: EvmWallet | EvmWalletReadonly;
    /**
     * The X chain UTXOs of the wallet's current state
     */
    utxosX: AVMUTXOSet;
    /**
     * The P chain UTXOs of the wallet's current state
     */
    utxosP: PlatformUTXOSet;
    balanceX: WalletBalanceX;
    abstract signEvm(tx: TypedTransaction): Promise<TypedTransaction>;
    abstract signX(tx: AVMUnsignedTx): Promise<AvmTx>;
    abstract signP(tx: PlatformUnsignedTx): Promise<PlatformTx>;
    abstract signC(tx: EVMUnsignedTx): Promise<EVMTx>;
    abstract getAddressX(): string;
    abstract getChangeAddressX(): string;
    abstract getAddressP(): string;
    abstract getExternalAddressesX(): Promise<string[]>;
    abstract getExternalAddressesXSync(): string[];
    abstract getInternalAddressesX(): Promise<string[]>;
    abstract getInternalAddressesXSync(): string[];
    abstract getExternalAddressesP(): Promise<string[]>;
    abstract getExternalAddressesPSync(): string[];
    abstract getAllAddressesX(): Promise<string[]>;
    abstract getAllAddressesXSync(): string[];
    abstract getAllAddressesP(): Promise<string[]>;
    abstract getAllAddressesPSync(): string[];
    abstract personalSign(data: string): Promise<string>;
    abstract signTypedData_V1(data: TypedDataV1): Promise<string>;
    abstract signTypedData_V3(data: TypedMessage<any>): Promise<string>;
    abstract signTypedData_V4(data: TypedMessage<any>): Promise<string>;
    protected constructor();
    /**
     * Call after getting done with the wallet to avoi memory leaks and remove event listeners
     */
    destroy(): void;
    /**
     * Fired when the network changes
     * @param config
     * @protected
     */
    protected onNetworkChange(config: NetworkConfig): void;
    /***
     * Used to get an identifier string that is consistent across different network connections.
     * Currently returns the C address of this wallet.
     */
    getBaseAddress(): string;
    protected emitter: EventEmitter;
    on(event: WalletEventType, listener: (...args: any[]) => void): void;
    off(event: WalletEventType, listener: (...args: any[]) => void): void;
    protected emit(event: WalletEventType, args?: WalletEventArgsType): void;
    protected emitAddressChange(): void;
    protected emitBalanceChangeX(): void;
    protected emitBalanceChangeP(): void;
    protected emitBalanceChangeC(): void;
    /**
     * Gets the active address on the C chain
     * @return Hex representation of the EVM address.
     */
    getAddressC(): string;
    getEvmAddressBech(): string;
    /**
     * Returns the BTC address of the C-Chain public key.
     */
    getAddressBTC(type: BTCNetworkType): string;
    /**
     *
     * @param to - the address funds are being send to.
     * @param amount - amount of AVAX to send in nAVAX
     * @param memo - A MEMO for the transaction
     */
    sendAvaxX(to: string, amount: BN, memo?: string): Promise<string>;
    /**
     * Sends AVAX to another address on the C chain using legacy transaction format.
     * @param to Hex address to send AVAX to.
     * @param amount Amount of AVAX to send, represented in WEI format.
     * @param gasPrice Gas price in WEI format
     * @param gasLimit Gas limit
     *
     * @return Returns the transaction hash
     */
    sendAvaxC(to: string, amount: BN, gasPrice: BN, gasLimit: number): Promise<string>;
    /**
     * Send Avalanche Native Tokens on X chain
     * @param assetID ID of the token to send
     * @param amount How many units of the token to send. Based on smallest divisible unit.
     * @param to X chain address to send tokens to
     */
    sendANT(assetID: string, amount: BN, to: string): Promise<string>;
    /**
     * Makes a transfer call on a ERC20 contract.
     * @param to Hex address to transfer tokens to.
     * @param amount Amount of the ERC20 token to send, donated in the token's correct denomination.
     * @param gasPrice Gas price in WEI format
     * @param gasLimit Gas limit
     * @param contractAddress Contract address of the ERC20 token
     */
    sendErc20(to: string, amount: BN, gasPrice: BN, gasLimit: number, contractAddress: string): Promise<string>;
    /**
     * Makes a `safeTransferFrom` call on a ERC721 contract.
     * @param to Hex address to transfer the NFT to.
     * @param tokenID ID of the token to transfer inside the ERC71 family.
     * @param gasPrice Gas price in WEI format
     * @param gasLimit Gas limit
     * @param contractAddress Contract address of the ERC721 token
     */
    sendErc721(contractAddress: string, to: string, tokenID: number, gasPrice: BN, gasLimit: number): Promise<string>;
    /**
     * Estimate the gas needed for an ERC20 Transfer transaction
     * @param contractAddress The ERC20 contract address
     * @param to Address receiving the tokens
     * @param amount Amount to send. Given in the smallest divisible unit.
     */
    estimateErc20Gas(contractAddress: string, to: string, amount: BN): Promise<number>;
    /**
     * Estimate the gas needed for an ERC721 `safeTransferFrom` transaction
     * @param contractAddress The ERC20 contract address
     * @param to Address receiving the tokens
     * @param tokenID ID of the token to transfer inside the ERC71 family.
     */
    estimateErc721TransferGasLimit(contractAddress: string, to: string, tokenID: number): Promise<number>;
    /**
     * Estimate gas limit for the given inputs.
     * @param to
     * @param data
     */
    estimateGas(to: string, data: string): Promise<bigint>;
    /**
     * Estimate the gas needed for a AVAX send transaction on the C chain.
     * @param to Destination address.
     * @param amount Amount of AVAX to send, in WEI.
     */
    estimateAvaxGasLimit(to: string, amount: BN, gasPrice: BN): Promise<number>;
    /**
     * A method to create custom EVM transactions.
     * @param gasPrice
     * @param gasLimit
     * @param data `data` field of the transaction, in hex format
     * @param to `to` field of the transaction, in hex format
     * @param value `value` field of the transaction, in hex format
     * @param nonce Nonce of the transaction, in number. If not provided, SDK will get the latest nonce from the network
     */
    sendCustomEvmTx(gasPrice: BN, gasLimit: number, data?: string, to?: string, value?: string, nonce?: number): Promise<string>;
    /**
     * Returns the maximum spendable AVAX balance for the given chain.
     * Scans all chains and take cross over fees into account
     * @param chainType X, P or C
     */
    getUsableAvaxBalanceForChain(chainType: ChainIdType, atomicFeeXP: BN, atomicFeeC: BN): BN;
    /**
     * Create a new instance of a UniversalNode for the given chain using current balance state
     * @param chain Chain of the universal node.
     * @private
     */
    private createUniversalNode;
    /**
     * Can this wallet have the given amount on the given chain after a series of internal transactions (if required).
     * @param chain X/P/C
     * @param amount The amount to check against
     */
    canHaveBalanceOnChain(chain: ChainIdType, amount: BN, atomicFeeXP: BN, atomicFeeC: BN): boolean;
    /**
     * Returns an array of transaction to do in order to have the target amount on the given chain
     * @param chain The chain (X/P/C) to have the desired amount on
     * @param amount The desired amount
     */
    getTransactionsForBalance(chain: ChainIdType, amount: BN, atomicFeeXP: BN, atomicFeeC: BN): UniversalTx[];
    /**
     * Given a `Transaction`, it will sign and issue it to the network.
     * @param tx The unsigned transaction to issue.
     */
    issueEvmTx(tx: TypedTransaction): Promise<string>;
    /**
     * Returns the C chain AVAX balance of the wallet in WEI format.
     */
    updateAvaxBalanceC(): Promise<BN>;
    /**
     *  Returns UTXOs on the X chain that belong to this wallet.
     *  - Makes network request.
     *  - Updates `this.utxosX` with new UTXOs
     *  - Calls `this.updateBalanceX()` after success.
     *  */
    updateUtxosX(): Promise<AVMUTXOSet>;
    /**
     *  Returns the fetched UTXOs on the X chain that belong to this wallet.
     */
    getUtxosX(): AVMUTXOSet;
    /**
     *  Returns UTXOs on the P chain that belong to this wallet.
     *  - Makes network request.
     *  - Updates `this.utxosP` with the new UTXOs
     */
    updateUtxosP(): Promise<PlatformUTXOSet>;
    /**
     * Returns the fetched UTXOs on the P chain that belong to this wallet.
     */
    getUtxosP(): PlatformUTXOSet;
    /**
     * Returns the number AVAX staked by this wallet.
     */
    getStake(): Promise<GetStakeResponse>;
    /**
     * Returns the wallet's balance of the given ERC20 contracts
     * @param addresses ERC20 Contract addresses
     */
    getBalanceERC20(addresses: string[]): Promise<ERC20Balance[]>;
    private updateUnknownAssetsX;
    /**
     * Uses the X chain UTXOs owned by this wallet, gets asset description for unknown assets,
     * and returns a dictionary of Asset IDs to balance amounts.
     * - Updates `this.balanceX`
     * - Expensive operation if there are unknown assets
     * - Uses existing UTXOs
     * @private
     */
    private updateBalanceX;
    getBalanceX(): WalletBalanceX;
    /**
     * A helpful method that returns the AVAX balance on X, P, C chains.
     * Internally calls chain specific getAvaxBalance methods.
     */
    getAvaxBalance(): iAvaxBalance;
    /**
     * Returns the X chain AVAX balance of the current wallet state.
     * - Does not make a network request.
     * - Does not refresh wallet balance.
     */
    getAvaxBalanceX(): AssetBalanceRawX;
    getAvaxBalanceC(): BN;
    /**
     * Returns the P chain AVAX balance of the current wallet state.
     * - Does not make a network request.
     * - Does not refresh wallet balance.
     */
    getAvaxBalanceP(): AssetBalanceP;
    /**
     * Exports AVAX from P chain to X chain
     * @remarks
     * The export fee is added automatically to the amount. Make sure the exported amount includes the import fee for the destination chain.
     *
     * @param amt amount of nAVAX to transfer. Fees excluded.
     * @param destinationChain Either `X` or `C`
     * @return returns the transaction id.
     */
    exportPChain(amt: BN, destinationChain: ExportChainsP): Promise<string>;
    /***
     * Estimates the required fee for a C chain export transaction
     * @param destinationChain Either `X` or `P`
     * @param baseFee Current base fee of the network, use a padded amount.
     * @return BN C chain atomic export transaction fee in nAVAX.
     */
    estimateAtomicFeeExportC(destinationChain: ExportChainsC, baseFee: BN): BN;
    /**
     * Exports AVAX from C chain to X chain
     * @remarks
     * Make sure the exported `amt` includes the import fee for the destination chain.
     *
     * @param amt amount of nAVAX to transfer
     * @param destinationChain either `X` or `P`
     * @param exportFee Export fee in nAVAX
     * @return returns the transaction id.
     */
    exportCChain(amt: BN, destinationChain: ExportChainsC, exportFee?: BN): Promise<string>;
    /**
     * Exports AVAX from X chain to either P or C chain
     * @remarks
     * The export fee will be added to the amount automatically. Make sure the exported amount has the import fee for the destination chain.
     *
     * @param amt amount of nAVAX to transfer
     * @param destinationChain Which chain to export to.
     * @return returns the transaction id.
     */
    exportXChain(amt: BN, destinationChain: ExportChainsX): Promise<string>;
    getAtomicUTXOsX(sourceChain: ExportChainsX): Promise<AVMUTXOSet>;
    getAtomicUTXOsP(sourceChain: ExportChainsP): Promise<PlatformUTXOSet>;
    getAtomicUTXOsC(sourceChain: ExportChainsC): Promise<EVMUTXOSet>;
    /**
     * Fetches X-Chain atomic utxos from all source networks and returns them as one set.
     */
    getAllAtomicUTXOsX(): Promise<AVMUTXOSet>;
    /**
     * Fetches P-Chain atomic utxos from all source networks and returns them as one set.
     */
    getAllAtomicUTXOsP(): Promise<PlatformUTXOSet>;
    /**
     * Fetches C-Chain atomic utxos from all source networks and returns them as one set.
     */
    getAllAtomicUTXOsC(): Promise<EVMUTXOSet>;
    /**
     * Imports atomic X chain UTXOs to the current active X chain address
     * @param sourceChain The chain to import from, either `P` or `C`
     */
    importX(sourceChain: ExportChainsX): Promise<string>;
    /**
     * Import utxos in atomic memory to the P chain.
     * @param sourceChain Either `X` or `C`
     * @param [toAddress] The destination P chain address assets will get imported to. Defaults to the P chain address of the wallet.
     */
    importP(sourceChain: ExportChainsP, toAddress?: string): Promise<string>;
    /**
     *
     * @param sourceChain Which chain to import from. `X` or `P`
     * @param [fee] The import fee to use in the transactions. If omitted the SDK will try to calculate the fee. For deterministic transactions you should always pre calculate and provide this value.
     * @param [utxoSet] If omitted imports all atomic UTXOs.
     */
    importC(sourceChain: ExportChainsC, fee?: BN, utxoSet?: EVMUTXOSet): Promise<string>;
    createNftFamily(name: string, symbol: string, groupNum: number): Promise<string>;
    mintNft(mintUtxo: AVMUTXO, payload: PayloadBase, quantity: number): Promise<string>;
    /**
     * Adds a validator to the network using the given node id.
     *
     * @param nodeID The node id you are adding as a validator
     * @param amt Amount of AVAX to stake in nAVAX
     * @param start Validation period start date
     * @param end Validation period end date
     * @param delegationFee Minimum 2%
     * @param rewardAddress P chain address to send staking rewards
     * @param utxos
     *
     * @return Transaction id
     */
    validate(nodeID: string, amt: BN, start: Date, end: Date, delegationFee: number, rewardAddress?: string, utxos?: PlatformUTXO[]): Promise<string>;
    delegate(nodeID: string, amt: BN, start: Date, end: Date, rewardAddress?: string, utxos?: PlatformUTXO[]): Promise<string>;
    /**
     * Issues the given transaction.
     * @param tx A universal transaction json object.
     */
    issueUniversalTx(tx: UniversalTx): Promise<string>;
    getHistoryX(limit?: number): Promise<OrteliusAvalancheTx[]>;
    getHistoryP(limit?: number): Promise<OrteliusAvalancheTx[]>;
    /**
     * Returns atomic history for this wallet on the C chain.
     * @remarks Excludes EVM transactions.
     * @param limit
     */
    getHistoryC(limit?: number): Promise<OrteliusAvalancheTx[]>;
    /**
     * Returns history for this wallet on the C chain.
     * @remarks Excludes atomic C chain import/export transactions.
     */
    getHistoryEVM(): Promise<import("@/Explorer").OrteliusEvmTx[]>;
    /**
     * Returns the erc 20 activity for this wallet's C chain address. Uses Snowtrace APIs.
     * @param offset Number of items per page. Optional.
     * @param page If provided will paginate the results. Optional.
     * @param contractAddress Filter activity by the ERC20 contract address. Optional.
     */
    getHistoryERC20(page?: number, offset?: number, contractAddress?: string): Promise<import("@/Explorer").SnowtraceErc20Tx[]>;
    /**
     * Get a list of 'Normal' Transactions for wallet's C chain address. Uses Snowtrace APIs.
     * @param offset Number of items per page. Optional.
     * @param page If provided will paginate the results. Optional.
     */
    getHistoryNormalTx(page?: number, offset?: number): Promise<import("@/Explorer").SnowtraceNormalTx[]>;
    getHistory(limit?: number): Promise<HistoryItemType[]>;
    /**
     * Return sorted history from Ortelius.
     * @param limit
     */
    getHistoryRaw(limit?: number): Promise<OrteliusAvalancheTx[]>;
    /**
     * Fetches information about the given txId and parses it from the wallet's perspective
     * @param txId
     */
    getHistoryTx(txId: string): Promise<HistoryItemType>;
    /**
     * Fetches information about the given txId and parses it from the wallet's perspective
     * @param txHash
     */
    getHistoryTxEvm(txHash: string): Promise<HistoryItemType>;
    parseOrteliusTx(tx: OrteliusAvalancheTx): Promise<HistoryItemType>;
}
