import { xChain } from '../Network/network';
import Crypto from './Crypto';
// import { keyToKeypair } from '../helpers/helper'
import * as bip39 from 'bip39';
import { bintools } from '../common';
import { Buffer as AjsBuffer } from 'avalanche';
import { ITERATIONS_V2, ITERATIONS_V3 } from '../Keystore/constants';
const cryptoHelpers = new Crypto();
export async function readV2(data, pass) {
    const version = data.version;
    cryptoHelpers.keygenIterations = ITERATIONS_V2;
    let salt = bintools.cb58Decode(data.salt);
    let pass_hash = data.pass_hash;
    let checkHashString;
    let checkHash = await cryptoHelpers._pwcleaner(pass, salt);
    checkHashString = bintools.cb58Encode(AjsBuffer.from(checkHash));
    if (checkHashString !== pass_hash) {
        throw 'INVALID_PASS';
    }
    let keys = data.keys;
    let keysDecrypt = [];
    for (let i = 0; i < keys.length; i++) {
        let key_data = keys[i];
        let key = bintools.cb58Decode(key_data.key);
        let nonce = bintools.cb58Decode(key_data.iv);
        let key_decrypt = await cryptoHelpers.decrypt(pass, key, salt, nonce);
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
export async function readV3(data, pass) {
    const version = data.version;
    cryptoHelpers.keygenIterations = ITERATIONS_V3;
    let salt = bintools.cb58Decode(data.salt);
    let pass_hash = data.pass_hash;
    let checkHashString;
    let checkHash = await cryptoHelpers.pwhash(pass, salt);
    checkHashString = bintools.cb58Encode(AjsBuffer.from(checkHash.hash));
    if (checkHashString !== pass_hash) {
        throw 'INVALID_PASS';
    }
    let keys = data.keys;
    let keysDecrypt = [];
    for (let i = 0; i < keys.length; i++) {
        let key_data = keys[i];
        let key = bintools.cb58Decode(key_data.key);
        let nonce = bintools.cb58Decode(key_data.iv);
        let key_decrypt = await cryptoHelpers.decrypt(pass, key, salt, nonce);
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
export async function readV4(data, pass) {
    const version = data.version;
    cryptoHelpers.keygenIterations = ITERATIONS_V3;
    let salt = bintools.cb58Decode(data.salt);
    let pass_hash = data.pass_hash;
    let checkHashString;
    let checkHash = await cryptoHelpers.pwhash(pass, salt);
    checkHashString = bintools.cb58Encode(AjsBuffer.from(checkHash.hash));
    if (checkHashString !== pass_hash) {
        throw 'INVALID_PASS';
    }
    let keys = data.keys;
    let keysDecrypt = [];
    for (let i = 0; i < keys.length; i++) {
        let key_data = keys[i];
        let key = bintools.cb58Decode(key_data.key);
        let nonce = bintools.cb58Decode(key_data.iv);
        let key_decrypt = await cryptoHelpers.decrypt(pass, key, salt, nonce);
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
export async function readV5(data, pass) {
    const version = data.version;
    cryptoHelpers.keygenIterations = ITERATIONS_V3;
    let salt = bintools.cb58Decode(data.salt);
    let pass_hash = data.pass_hash;
    let checkHashString;
    let checkHash = await cryptoHelpers.pwhash(pass, salt);
    checkHashString = bintools.cb58Encode(AjsBuffer.from(checkHash.hash));
    if (checkHashString !== pass_hash) {
        throw 'INVALID_PASS';
    }
    let keys = data.keys;
    let keysDecrypt = [];
    for (let i = 0; i < keys.length; i++) {
        let key_data = keys[i];
        let key = bintools.cb58Decode(key_data.key);
        let nonce = bintools.cb58Decode(key_data.iv);
        let key_decrypt = await cryptoHelpers.decrypt(pass, key, salt, nonce);
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
export async function readV6(data, pass) {
    const version = data.version;
    const activeIndex = data.activeIndex;
    cryptoHelpers.keygenIterations = ITERATIONS_V3;
    let salt = bintools.cb58Decode(data.salt);
    let keys = data.keys;
    let keysDecrypt = [];
    for (let i = 0; i < keys.length; i++) {
        let key_data = keys[i];
        let key = bintools.cb58Decode(key_data.key);
        let type = key_data.type;
        let nonce = bintools.cb58Decode(key_data.iv);
        let key_decrypt;
        try {
            key_decrypt = await cryptoHelpers.decrypt(pass, key, salt, nonce);
        }
        catch (e) {
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
export async function readKeyFile(data, pass) {
    switch (data.version) {
        case '6.0':
            return await readV6(data, pass);
        case '5.0':
            return await readV5(data, pass);
        case '4.0':
            return await readV4(data, pass);
        case '3.0':
            return await readV3(data, pass);
        case '2.0':
            return await readV2(data, pass);
        default:
            throw 'INVALID_VERSION';
    }
}
export function extractKeysV2(file) {
    let chainID = xChain.getBlockchainAlias();
    let keys = file.keys;
    return keys.map((key) => {
        // Private keys from the keystore file do not have the PrivateKey- prefix
        let pk = 'PrivateKey-' + key.key;
        // let keypair = keyToKeypair(pk, chainID)
        let keypair = xChain.newKeyChain().importKey(pk);
        let keyBuf = keypair.getPrivateKey();
        let keyHex = keyBuf.toString('hex');
        let paddedKeyHex = keyHex.padStart(64, '0');
        let mnemonic = bip39.entropyToMnemonic(paddedKeyHex);
        return {
            key: mnemonic,
            type: 'mnemonic',
        };
    });
}
export function extractKeysV5(file) {
    return file.keys.map((key) => ({
        key: key.key,
        type: 'mnemonic',
    }));
}
export function extractKeysV6(file) {
    return file.keys.map((key) => ({
        type: key.type,
        key: key.key,
    }));
}
export function extractKeysFromDecryptedFile(file) {
    switch (file.version) {
        case '6.0':
            return extractKeysV6(file);
        case '5.0':
            return extractKeysV5(file);
        case '4.0':
            return extractKeysV2(file);
        case '3.0':
            return extractKeysV2(file);
        case '2.0':
            return extractKeysV2(file);
        default:
            throw 'INVALID_VERSION';
    }
}
//# sourceMappingURL=keystore.js.map