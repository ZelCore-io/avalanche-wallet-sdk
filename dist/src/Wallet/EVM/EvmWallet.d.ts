/// <reference types="node" />
/// <reference types="node" />
import { TypedTransaction } from '@ethereumjs/tx';
import { KeyChain as EVMKeyChain, KeyPair as EVMKeyPair, Tx as EVMTx, UnsignedTx as EVMUnsignedTx } from 'avalanche/dist/apis/evm';
import { EvmWalletReadonly } from '@/Wallet/EVM/EvmWalletReadonly';
import { MessageTypes, SignTypedDataVersion, TypedDataV1, TypedMessage } from '@metamask/eth-sig-util';
export declare class EvmWallet extends EvmWalletReadonly {
    private privateKey;
    private btcPair;
    constructor(key: Buffer);
    static fromPrivateKey(key: string): EvmWallet;
    private getPrivateKeyBech;
    getKeyChain(): EVMKeyChain;
    getKeyPair(): EVMKeyPair;
    signEVM(tx: TypedTransaction): import("@ethereumjs/tx").FeeMarketEIP1559Transaction | import("@ethereumjs/tx").LegacyTransaction | import("@ethereumjs/tx").AccessListEIP2930Transaction | import("@ethereumjs/tx").BlobEIP4844Transaction | import("@ethereumjs/tx").EOACodeEIP7702Transaction;
    signBTCHash(hash: Buffer): Buffer;
    signC(tx: EVMUnsignedTx): EVMTx;
    getPrivateKeyHex(): string;
    /**
     * This function is equivalent to the eth_sign Ethereum JSON-RPC method as specified in EIP-1417,
     * as well as the MetaMask's personal_sign method.
     * @param data The hex data to sign. Must start with `0x`.
     */
    personalSign(data: string): string;
    /**
     * Sign typed data according to EIP-712. The signing differs based upon the version.
     * V1 is based upon an early version of EIP-712 that lacked some later security improvements, and should generally be neglected in favor of later versions.
     * V3 is based on EIP-712, except that arrays and recursive data structures are not supported.
     * V4 is based on EIP-712, and includes full support of arrays and recursive data structures.
     * @param data The typed data to sign.
     * @param version The signing version to use.
     */
    signTypedData<V extends SignTypedDataVersion, T extends MessageTypes>(data: V extends 'V1' ? TypedDataV1 : TypedMessage<T>, version: V): string;
    /**
     * V1 is based upon an early version of EIP-712 that lacked some later security improvements, and should generally be neglected in favor of later versions.
     * @param data The typed data to sign.
     * */
    signTypedData_V1(data: TypedDataV1): string;
    /**
     * V3 is based on EIP-712, except that arrays and recursive data structures are not supported.
     * @param data The typed data to sign.
     */
    signTypedData_V3(data: TypedMessage<any>): string;
    /**
     * V4 is based on EIP-712, and includes full support of arrays and recursive data structures.
     * @param data The typed data to sign.
     */
    signTypedData_V4(data: TypedMessage<any>): string;
}
//# sourceMappingURL=EvmWallet.d.ts.map