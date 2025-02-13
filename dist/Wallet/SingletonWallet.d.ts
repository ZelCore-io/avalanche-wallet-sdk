import { WalletProvider } from '../Wallet/Wallet';
import { UnsafeWallet, WalletNameType } from '../Wallet/types';
import { UnsignedTx as AVMUnsignedTx, Tx as AVMTx } from '@avalabs/avalanchejs/dist/apis/avm';
import { UnsignedTx as PlatformUnsignedTx, Tx as PlatformTx } from '@avalabs/avalanchejs/dist/apis/platformvm';
import { Buffer as BufferAvalanche } from '@avalabs/avalanchejs';
import { EvmWallet } from '../Wallet/EVM/EvmWallet';
import { UnsignedTx, Tx } from '@avalabs/avalanchejs/dist/apis/evm';
import { TypedTransaction } from '@ethereumjs/tx';
import { TypedDataV1, TypedMessage } from '@metamask/eth-sig-util';
export declare class SingletonWallet extends WalletProvider implements UnsafeWallet {
    type: WalletNameType;
    key: string;
    keyBuff: BufferAvalanche;
    evmWallet: EvmWallet;
    /**
     *
     * @param privateKey An avalanche private key, starts with `PrivateKey-`
     */
    constructor(privateKey: string);
    static fromPrivateKey(key: string): SingletonWallet;
    static fromEvmKey(key: string): SingletonWallet;
    private getKeyChainX;
    private getKeyChainP;
    /**
     * Returns the derived private key used by the EVM wallet.
     */
    getEvmPrivateKeyHex(): string;
    getAddressP(): string;
    getAddressX(): string;
    getAllAddressesP(): Promise<string[]>;
    getAllAddressesPSync(): string[];
    getAllAddressesX(): Promise<string[]>;
    getAllAddressesXSync(): string[];
    getChangeAddressX(): string;
    getExternalAddressesP(): Promise<string[]>;
    getExternalAddressesPSync(): string[];
    getExternalAddressesX(): Promise<string[]>;
    getExternalAddressesXSync(): string[];
    getInternalAddressesX(): Promise<string[]>;
    getInternalAddressesXSync(): string[];
    signC(tx: UnsignedTx): Promise<Tx>;
    signEvm(tx: TypedTransaction): Promise<TypedTransaction>;
    signP(tx: PlatformUnsignedTx): Promise<PlatformTx>;
    signX(tx: AVMUnsignedTx): Promise<AVMTx>;
    /**
     * This function is equivalent to the eth_sign Ethereum JSON-RPC method as specified in EIP-1417,
     * as well as the MetaMask's personal_sign method.
     * @param data The hex data to sign
     */
    personalSign(data: string): Promise<string>;
    /**
     * V1 is based upon an early version of EIP-712 that lacked some later security improvements, and should generally be neglected in favor of later versions.
     * @param data The typed data to sign.
     * */
    signTypedData_V1(data: TypedDataV1): Promise<string>;
    /**
     * V3 is based on EIP-712, except that arrays and recursive data structures are not supported.
     * @param data The typed data to sign.
     */
    signTypedData_V3(data: TypedMessage<any>): Promise<string>;
    /**
     * V4 is based on EIP-712, and includes full support of arrays and recursive data structures.
     * @param data The typed data to sign.
     */
    signTypedData_V4(data: TypedMessage<any>): Promise<string>;
}
//# sourceMappingURL=SingletonWallet.d.ts.map