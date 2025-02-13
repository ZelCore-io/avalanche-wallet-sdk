import { AllKeyFileDecryptedTypes, AllKeyFileTypes, KeyFileDecryptedV2, KeyFileDecryptedV3, KeyFileDecryptedV4, KeyFileDecryptedV5, KeyFileDecryptedV6, KeyFileKeyDecryptedV2, KeyFileKeyDecryptedV3, KeyFileV2, KeyFileV3, KeyFileV4, KeyFileV5, KeyFileV6 } from './types';
import { AccessWalletMultipleInput } from './types';
export declare function readV2(data: KeyFileV2, pass: string): Promise<{
    version: string;
    activeIndex: number;
    keys: KeyFileKeyDecryptedV2[];
}>;
export declare function readV3(data: KeyFileV3, pass: string): Promise<{
    version: string;
    activeIndex: number;
    keys: KeyFileKeyDecryptedV3[];
}>;
export declare function readV4(data: KeyFileV4, pass: string): Promise<KeyFileDecryptedV5>;
export declare function readV5(data: KeyFileV5, pass: string): Promise<KeyFileDecryptedV5>;
export declare function readV6(data: KeyFileV6, pass: string): Promise<KeyFileDecryptedV6>;
/**
 * Will decrypt and return the keys of the encrypted wallets in the given json file
 * @param data A JSON file of encrypted wallet keys
 * @param pass The password to decrypt the keys
 */
export declare function readKeyFile(data: AllKeyFileTypes, pass: string): Promise<AllKeyFileDecryptedTypes>;
export declare function extractKeysV2(file: KeyFileDecryptedV2 | KeyFileDecryptedV3 | KeyFileDecryptedV4): AccessWalletMultipleInput[];
export declare function extractKeysV5(file: KeyFileDecryptedV5): AccessWalletMultipleInput[];
export declare function extractKeysV6(file: KeyFileDecryptedV6): AccessWalletMultipleInput[];
export declare function extractKeysFromDecryptedFile(file: AllKeyFileDecryptedTypes): AccessWalletMultipleInput[];
