// Functions to manage import/export of keystore files
import {
    AllKeyFileDecryptedTypes,
    AllKeyFileTypes,
    KeyFileDecryptedV2,
    KeyFileDecryptedV3,
    KeyFileDecryptedV4,
    KeyFileDecryptedV5,
    KeyFileDecryptedV6,
    KeyFileKeyDecryptedV2,
    KeyFileKeyDecryptedV3,
    KeyFileKeyDecryptedV4,
    KeyFileKeyDecryptedV5,
    KeyFileKeyDecryptedV6,
    KeyFileKeyV2,
    KeyFileKeyV3,
    KeyFileKeyV4,
    KeyFileKeyV5,
    KeyFileKeyV6,
    KeyFileV2,
    KeyFileV3,
    KeyFileV4,
    KeyFileV5,
    KeyFileV6,
    KeystoreFileKeyType,
} from './types';
import { xChain } from '../Network/network';
import { Buffer } from 'buffer/';
import Crypto from './Crypto';
import { SingletonWallet } from '../Wallet/SingletonWallet';
import { AccessWalletMultipleInput } from './types';
// import { keyToKeypair } from '../helpers/helper'
import * as bip39 from 'bip39';
import { bintools } from '../common';
import { Buffer as AjsBuffer } from 'avalanche';
import { ITERATIONS_V2, ITERATIONS_V3, KEYSTORE_VERSION } from '../Keystore/constants';

const cryptoHelpers = new Crypto();

interface IHash {
    salt: Buffer;
    hash: Buffer;
}

interface PKCrypt {
    salt: Buffer;
    iv: Buffer;
    ciphertext: Buffer;
}

export async function readV2(data: KeyFileV2, pass: string) {
    const version: string = data.version;
    cryptoHelpers.keygenIterations = ITERATIONS_V2;

    let salt: Buffer = bintools.cb58Decode(data.salt);
    let pass_hash: string = data.pass_hash;

    let checkHashString: string;
    let checkHash: Buffer = await cryptoHelpers._pwcleaner(pass, salt);
    checkHashString = bintools.cb58Encode(AjsBuffer.from(checkHash));

    if (checkHashString !== pass_hash) {
        throw 'INVALID_PASS';
    }

    let keys: KeyFileKeyV2[] = data.keys;
    let keysDecrypt: KeyFileKeyDecryptedV2[] = [];

    for (let i = 0; i < keys.length; i++) {
        let key_data: KeyFileKeyV2 = keys[i];

        let key: Buffer = bintools.cb58Decode(key_data.key);
        let nonce: Buffer = bintools.cb58Decode(key_data.iv);

        let key_decrypt: Buffer = await cryptoHelpers.decrypt(pass, key, salt, nonce);
        let key_string = bintools.cb58Encode(AjsBuffer.from(key_decrypt));

        keysDecrypt.push({
            key: key_string,
        });
    }

    return {
        version,
        activeIndex: 0,
        keys: keysDecrypt,
    };
}
export async function readV3(data: KeyFileV3, pass: string) {
    const version: string = data.version;
    cryptoHelpers.keygenIterations = ITERATIONS_V3;

    let salt: Buffer = bintools.cb58Decode(data.salt);
    let pass_hash: string = data.pass_hash;

    let checkHashString: string;
    let checkHash: IHash = await cryptoHelpers.pwhash(pass, salt);
    checkHashString = bintools.cb58Encode(AjsBuffer.from(checkHash.hash));

    if (checkHashString !== pass_hash) {
        throw 'INVALID_PASS';
    }

    let keys: KeyFileKeyV3[] = data.keys;
    let keysDecrypt: KeyFileKeyDecryptedV3[] = [];

    for (let i = 0; i < keys.length; i++) {
        let key_data: KeyFileKeyV3 = keys[i];

        let key: Buffer = bintools.cb58Decode(key_data.key);
        let nonce: Buffer = bintools.cb58Decode(key_data.iv);

        let key_decrypt: Buffer = await cryptoHelpers.decrypt(pass, key, salt, nonce);
        let key_string = bintools.cb58Encode(AjsBuffer.from(key_decrypt));

        keysDecrypt.push({
            key: key_string,
        });
    }

    return {
        version,
        activeIndex: 0,
        keys: keysDecrypt,
    };
}
export async function readV4(data: KeyFileV4, pass: string): Promise<KeyFileDecryptedV5> {
    const version = data.version;
    cryptoHelpers.keygenIterations = ITERATIONS_V3;

    let salt: Buffer = bintools.cb58Decode(data.salt);
    let pass_hash: string = data.pass_hash;

    let checkHashString: string;
    let checkHash: IHash = await cryptoHelpers.pwhash(pass, salt);
    checkHashString = bintools.cb58Encode(AjsBuffer.from(checkHash.hash));

    if (checkHashString !== pass_hash) {
        throw 'INVALID_PASS';
    }

    let keys: KeyFileKeyV4[] = data.keys;
    let keysDecrypt: KeyFileKeyDecryptedV4[] = [];

    for (let i = 0; i < keys.length; i++) {
        let key_data: KeyFileKeyV4 = keys[i];

        let key: Buffer = bintools.cb58Decode(key_data.key);
        let nonce: Buffer = bintools.cb58Decode(key_data.iv);

        let key_decrypt: Buffer = await cryptoHelpers.decrypt(pass, key, salt, nonce);
        let key_string = bintools.cb58Encode(AjsBuffer.from(key_decrypt));

        keysDecrypt.push({
            key: key_string,
        });
    }

    return {
        version,
        activeIndex: 0,
        keys: keysDecrypt,
    };
}

export async function readV5(data: KeyFileV5, pass: string): Promise<KeyFileDecryptedV5> {
    const version: string = data.version;
    cryptoHelpers.keygenIterations = ITERATIONS_V3;

    let salt: Buffer = bintools.cb58Decode(data.salt);
    let pass_hash = data.pass_hash;

    let checkHashString: string;
    let checkHash: IHash = await cryptoHelpers.pwhash(pass, salt);
    checkHashString = bintools.cb58Encode(AjsBuffer.from(checkHash.hash));

    if (checkHashString !== pass_hash) {
        throw 'INVALID_PASS';
    }

    let keys: KeyFileKeyV5[] = data.keys;
    let keysDecrypt: KeyFileKeyDecryptedV5[] = [];

    for (let i = 0; i < keys.length; i++) {
        let key_data: KeyFileKeyV5 = keys[i];

        let key: Buffer = bintools.cb58Decode(key_data.key);
        let nonce: Buffer = bintools.cb58Decode(key_data.iv);

        let key_decrypt: Buffer = await cryptoHelpers.decrypt(pass, key, salt, nonce);
        let key_string = key_decrypt.toString();

        keysDecrypt.push({
            key: key_string,
        });
    }

    return {
        version,
        activeIndex: 0,
        keys: keysDecrypt,
    };
}

export async function readV6(data: KeyFileV6, pass: string): Promise<KeyFileDecryptedV6> {
    const version: string = data.version;
    const activeIndex = data.activeIndex;
    cryptoHelpers.keygenIterations = ITERATIONS_V3;

    let salt: Buffer = bintools.cb58Decode(data.salt);

    let keys: KeyFileKeyV6[] = data.keys;
    let keysDecrypt: KeyFileKeyDecryptedV6[] = [];

    for (let i = 0; i < keys.length; i++) {
        let key_data: KeyFileKeyV6 = keys[i];

        let key: Buffer = bintools.cb58Decode(key_data.key);
        let type: KeystoreFileKeyType = key_data.type;
        let nonce: Buffer = bintools.cb58Decode(key_data.iv);

        let key_decrypt: Buffer;
        try {
            key_decrypt = await cryptoHelpers.decrypt(pass, key, salt, nonce);
        } catch (e) {
            throw 'INVALID_PASS';
        }

        const key_string = key_decrypt.toString();

        keysDecrypt.push({
            key: key_string,
            type: type,
        });
    }

    return {
        version,
        activeIndex: activeIndex || 0,
        keys: keysDecrypt,
    };
}

/**
 * Will decrypt and return the keys of the encrypted wallets in the given json file
 * @param data A JSON file of encrypted wallet keys
 * @param pass The password to decrypt the keys
 */
export async function readKeyFile(data: AllKeyFileTypes, pass: string): Promise<AllKeyFileDecryptedTypes> {
    switch (data.version) {
        case '6.0':
            return await readV6(data as KeyFileV6, pass);
        case '5.0':
            return await readV5(data as KeyFileV5, pass);
        case '4.0':
            return await readV4(data as KeyFileV4, pass);
        case '3.0':
            return await readV3(data as KeyFileV3, pass);
        case '2.0':
            return await readV2(data as KeyFileV2, pass);
        default:
            throw 'INVALID_VERSION';
    }
}

export function extractKeysV2(
    file: KeyFileDecryptedV2 | KeyFileDecryptedV3 | KeyFileDecryptedV4
): AccessWalletMultipleInput[] {
    let chainID = xChain.getBlockchainAlias();
    let keys = (file as KeyFileDecryptedV2 | KeyFileDecryptedV3 | KeyFileDecryptedV4).keys;

    return keys.map((key) => {
        // Private keys from the keystore file do not have the PrivateKey- prefix
        let pk = 'PrivateKey-' + key.key;
        // let keypair = keyToKeypair(pk, chainID)
        let keypair = xChain.newKeyChain().importKey(pk);

        let keyBuf = keypair.getPrivateKey();
        let keyHex: string = keyBuf.toString('hex');
        let paddedKeyHex = keyHex.padStart(64, '0');
        let mnemonic: string = bip39.entropyToMnemonic(paddedKeyHex);

        return {
            key: mnemonic,
            type: 'mnemonic',
        };
    });
}

export function extractKeysV5(file: KeyFileDecryptedV5): AccessWalletMultipleInput[] {
    return file.keys.map((key) => ({
        key: key.key,
        type: 'mnemonic',
    }));
}

export function extractKeysV6(file: KeyFileDecryptedV6): AccessWalletMultipleInput[] {
    return file.keys.map((key) => ({
        type: key.type,
        key: key.key,
    }));
}

export function extractKeysFromDecryptedFile(file: AllKeyFileDecryptedTypes): AccessWalletMultipleInput[] {
    switch (file.version) {
        case '6.0':
            return extractKeysV6(file as KeyFileDecryptedV6);
        case '5.0':
            return extractKeysV5(file as KeyFileDecryptedV5);
        case '4.0':
            return extractKeysV2(file as KeyFileDecryptedV4);
        case '3.0':
            return extractKeysV2(file as KeyFileDecryptedV3);
        case '2.0':
            return extractKeysV2(file as KeyFileDecryptedV2);
        default:
            throw 'INVALID_VERSION';
    }
}
