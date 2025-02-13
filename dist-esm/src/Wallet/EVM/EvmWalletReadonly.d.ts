/// <reference types="bn.js" />
/// <reference types="node" />
/// <reference types="node" />
import { BN } from 'avalanche';
import { BTCNetworkType } from '@/Wallet';
export declare class EvmWalletReadonly {
    balance: BN;
    address: string;
    publicKey: string;
    publicKeyBuff: Buffer;
    /**
     *
     * @param publicKey 64 byte uncompressed public key. Starts with `0x`.
     */
    constructor(publicKey: string);
    getBalance(): BN;
    getAddress(): string;
    getCompressedPublicKey(): string;
    getAddressBech32(): string;
    /**
     * Returns a native P2WPKH address with the prefix `bc1q`. This bitcoin address is
     * derived from the same public key of the C chain address.
     */
    getAddressBTC(networkType?: BTCNetworkType): string;
    updateBalance(): Promise<BN>;
    /**
     * Builds an unsigned ERC721 transfer transaction from this wallet.
     * @param contract The ERC721 Contract address
     * @param tokenID Token ID
     * @param to Recipient hex address.
     * @param gasPrice Gas price in `BN`
     * @param gasLimit Gas limit
     */
    buildErc721TransferTx(contract: string, tokenID: number, to: string, gasPrice: BN, gasLimit: number): Promise<import("@ethereumjs/tx").FeeMarketEIP1559Transaction | import("@ethereumjs/tx").LegacyTransaction | import("@ethereumjs/tx").AccessListEIP2930Transaction | import("@ethereumjs/tx").BlobEIP4844Transaction | import("@ethereumjs/tx").EOACodeEIP7702Transaction>;
    estimateErc721TransferGasLimit(contract: string, to: string, tokenID: number): Promise<number>;
}
