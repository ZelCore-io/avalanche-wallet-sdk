/// <reference types="bn.js" />
import { KeyPair as AVMKeyPair } from '@avalabs/avalanchejs/dist/apis/avm';
import { BN } from '@avalabs/avalanchejs';
import { SingletonWallet } from '../Wallet/SingletonWallet';
import { iAssetDescriptionClean } from '../Asset/types';
export interface IIndexKeyCache {
    [index: number]: AVMKeyPair;
}
export declare type ChainAlias = 'X' | 'P';
export declare type ExportChainsX = 'P' | 'C';
export declare type ExportChainsP = 'X' | 'C';
export declare type ExportChainsC = 'X' | 'P';
export declare type HdChainType = 'X' | 'P';
export declare type WalletNameType = 'mnemonic' | 'singleton' | 'xpub';
export declare type WalletType = SingletonWallet;
export interface WalletBalanceX {
    [assetId: string]: AssetBalanceX;
}
export interface WalletCollectiblesX {
    [familyId: string]: WalletCollectiblesXFamily;
}
export interface WalletCollectiblesXFamily {
    groups: {
        [groupID: number]: WalletCollectiblesXGroup;
    };
}
export interface WalletCollectiblesXGroup {
    payload: string;
    quantity: number;
    id: number;
}
export interface iAvaxBalance {
    X: AssetBalanceRawX;
    P: AssetBalanceP;
    C: BN;
}
export interface AssetBalanceRawX {
    /**
     * UTXOs with locktime in the future
     */
    locked: BN;
    unlocked: BN;
    /**
     * UTXOs with threshold > 1
     */
    multisig: BN;
}
export interface AssetBalanceX extends AssetBalanceRawX {
    meta: iAssetDescriptionClean;
}
export interface AssetBalanceP {
    locked: BN;
    unlocked: BN;
    multisig: BN;
    lockedStakeable: BN;
}
export interface WalletBalanceERC20 {
    [address: string]: ERC20Balance;
}
export interface ERC20Balance {
    balance: BN;
    balanceParsed: string;
    name: string;
    symbol: string;
    denomination: number;
    address: string;
}
export interface ILedgerAppConfig {
    version: string;
    commit: string;
    name: 'Avalanche';
}
export declare type WalletEventType = 'addressChanged' | 'balanceChangedX' | 'balanceChangedP' | 'balanceChangedC' | 'hd_ready';
export declare type WalletEventArgsType = iWalletAddressChanged | WalletBalanceX | AssetBalanceP | BN | iHDWalletIndex;
export interface iWalletAddressChanged {
    X: string;
    P: string;
    changeX: string;
}
export interface iHDWalletIndex {
    external: number;
    internal: number;
}
export declare type BTCNetworkType = 'bitcoin' | 'testnet' | 'regtest';
/**
 * Used by wallets which can access their private keys
 */
export interface UnsafeWallet {
    getEvmPrivateKeyHex(): string;
}
//# sourceMappingURL=types.d.ts.map