/// <reference types="bn.js" />
import { BN } from 'avalanche';
import { UnsignedTx as AVMUnsignedTx, UTXO as AVMUTXO, UTXOSet as AVMUTXOSet, UTXOSet } from 'avalanche/dist/apis/avm';
import { PayloadBase } from 'avalanche/dist/utils';
import { UTXOSet as PlatformUTXOSet } from 'avalanche/dist/apis/platformvm';
import { FeeMarketEIP1559Transaction, TypedTransaction } from '@ethereumjs/tx';
import { ExportChainsC, ExportChainsP, ExportChainsX } from '@/Wallet/types';
export declare function buildCreateNftFamilyTx(name: string, symbol: string, groupNum: number, fromAddrs: string[], minterAddr: string, changeAddr: string, utxoSet: UTXOSet): Promise<AVMUnsignedTx>;
export declare function buildMintNftTx(mintUtxo: AVMUTXO, payload: PayloadBase, quantity: number, ownerAddress: string, changeAddress: string, fromAddresses: string[], utxoSet: UTXOSet): Promise<AVMUnsignedTx>;
export declare function buildAvmExportTransaction(destinationChain: ExportChainsX, utxoSet: AVMUTXOSet, fromAddresses: string[], toAddress: string, amount: BN, // export amount + fee
sourceChangeAddress: string): Promise<AVMUnsignedTx>;
export declare function buildPlatformExportTransaction(utxoSet: PlatformUTXOSet, fromAddresses: string[], toAddress: string, amount: BN, // export amount + fee
sourceChangeAddress: string, destinationChain: ExportChainsP): Promise<import("avalanche/dist/apis/platformvm").UnsignedTx>;
/**
 *
 * @param fromAddresses
 * @param toAddress
 * @param amount
 * @param fromAddressBech
 * @param destinationChain Either `X` or `P`
 * @param fee Export fee in nAVAX
 */
export declare function buildEvmExportTransaction(fromAddresses: string[], toAddress: string, amount: BN, // export amount + fee
fromAddressBech: string, destinationChain: ExportChainsC, fee: BN): Promise<import("avalanche/dist/apis/evm").UnsignedTx>;
export declare function buildEvmTransferEIP1559Tx(from: string, to: string, amount: BN, // in wei
priorityFee: BN, maxFee: BN, gasLimit: number): Promise<FeeMarketEIP1559Transaction>;
export declare function buildEvmTransferNativeTx(from: string, to: string, amount: BN, // in wei
gasPrice: BN, gasLimit: number): Promise<FeeMarketEIP1559Transaction | import("@ethereumjs/tx").LegacyTransaction | import("@ethereumjs/tx").AccessListEIP2930Transaction | import("@ethereumjs/tx").BlobEIP4844Transaction | import("@ethereumjs/tx").EOACodeEIP7702Transaction>;
export declare function buildCustomEvmTx(from: string, gasPrice: BN, gasLimit: number, data?: string, to?: string, value?: string, nonce?: number): Promise<TypedTransaction>;
export declare function buildEvmTransferErc20Tx(from: string, to: string, amount: BN, // in wei
gasPrice: BN, gasLimit: number, contractAddress: string): Promise<TypedTransaction>;
export declare function buildEvmTransferErc721Tx(from: string, to: string, gasPrice: BN, gasLimit: number, tokenContract: string, tokenId: number): Promise<FeeMarketEIP1559Transaction | import("@ethereumjs/tx").LegacyTransaction | import("@ethereumjs/tx").AccessListEIP2930Transaction | import("@ethereumjs/tx").BlobEIP4844Transaction | import("@ethereumjs/tx").EOACodeEIP7702Transaction>;
export declare function estimateErc20Gas(tokenContract: string, from: string, to: string, value: BN): Promise<bigint>;
/**
 * Estimate the gas limit for the ERC721 `safeTransferFrom(address,address,uint256)` method.
 * @param contract
 * @param from
 * @param to
 * @param tokenID
 */
export declare function estimateErc721TransferGas(contract: string, from: string, to: string, tokenID: number): Promise<number>;
/**
 * Estimates the gas needed to send AVAX
 * @param to Destination address
 * @param amount Amount of AVAX to send, given in WEI
 * @param gasPrice Given in WEI
 */
export declare function estimateAvaxGas(from: string, to: string, amount: BN, gasPrice: BN): Promise<number>;
export declare enum AvmTxNameEnum {
    'Transaction',
    'Mint',
    'Operation',
    'Import',
    'Export'
}
export declare enum PlatfromTxNameEnum {
    'Transaction',
    'Add Validator',
    'Add Delegator',
    'Import',
    'Export',
    'Add Subnet Validator',
    'Create Chain',
    'Create Subnet',
    'Advance Time',
    'Reward Validator'
}
export declare enum ParseableAvmTxEnum {
    'Transaction',
    'Import',
    'Export'
}
export declare enum ParseablePlatformEnum {
    'Transaction',
    'Add Validator',
    'Add Delegator',
    'Import',
    'Export'
}
export declare enum ParseableEvmTxEnum {
    'Import',
    'Export'
}
