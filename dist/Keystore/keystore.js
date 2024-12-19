"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractKeysFromDecryptedFile = exports.extractKeysV6 = exports.extractKeysV5 = exports.extractKeysV2 = exports.readKeyFile = exports.readV6 = exports.readV5 = exports.readV4 = exports.readV3 = exports.readV2 = void 0;
const tslib_1 = require("tslib");
const network_1 = require("../Network/network");
const Crypto_1 = tslib_1.__importDefault(require("./Crypto"));
// import { keyToKeypair } from '../helpers/helper'
const bip39 = tslib_1.__importStar(require("bip39"));
const common_1 = require("../common");
const avalanchejs_1 = require("@avalabs/avalanchejs");
const constants_1 = require("../Keystore/constants");
const cryptoHelpers = new Crypto_1.default();
async function readV2(data, pass) {
    const version = data.version;
    cryptoHelpers.keygenIterations = constants_1.ITERATIONS_V2;
    let salt = common_1.bintools.cb58Decode(data.salt);
    let pass_hash = data.pass_hash;
    let checkHashString;
    let checkHash = await cryptoHelpers._pwcleaner(pass, salt);
    checkHashString = common_1.bintools.cb58Encode(avalanchejs_1.Buffer.from(checkHash));
    if (checkHashString !== pass_hash) {
        throw 'INVALID_PASS';
    }
    let keys = data.keys;
    let keysDecrypt = [];
    for (let i = 0; i < keys.length; i++) {
        let key_data = keys[i];
        let key = common_1.bintools.cb58Decode(key_data.key);
        let nonce = common_1.bintools.cb58Decode(key_data.iv);
        let key_decrypt = await cryptoHelpers.decrypt(pass, key, salt, nonce);
        let key_string = common_1.bintools.cb58Encode(avalanchejs_1.Buffer.from(key_decrypt));
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
exports.readV2 = readV2;
async function readV3(data, pass) {
    const version = data.version;
    cryptoHelpers.keygenIterations = constants_1.ITERATIONS_V3;
    let salt = common_1.bintools.cb58Decode(data.salt);
    let pass_hash = data.pass_hash;
    let checkHashString;
    let checkHash = await cryptoHelpers.pwhash(pass, salt);
    checkHashString = common_1.bintools.cb58Encode(avalanchejs_1.Buffer.from(checkHash.hash));
    if (checkHashString !== pass_hash) {
        throw 'INVALID_PASS';
    }
    let keys = data.keys;
    let keysDecrypt = [];
    for (let i = 0; i < keys.length; i++) {
        let key_data = keys[i];
        let key = common_1.bintools.cb58Decode(key_data.key);
        let nonce = common_1.bintools.cb58Decode(key_data.iv);
        let key_decrypt = await cryptoHelpers.decrypt(pass, key, salt, nonce);
        let key_string = common_1.bintools.cb58Encode(avalanchejs_1.Buffer.from(key_decrypt));
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
exports.readV3 = readV3;
async function readV4(data, pass) {
    const version = data.version;
    cryptoHelpers.keygenIterations = constants_1.ITERATIONS_V3;
    let salt = common_1.bintools.cb58Decode(data.salt);
    let pass_hash = data.pass_hash;
    let checkHashString;
    let checkHash = await cryptoHelpers.pwhash(pass, salt);
    checkHashString = common_1.bintools.cb58Encode(avalanchejs_1.Buffer.from(checkHash.hash));
    if (checkHashString !== pass_hash) {
        throw 'INVALID_PASS';
    }
    let keys = data.keys;
    let keysDecrypt = [];
    for (let i = 0; i < keys.length; i++) {
        let key_data = keys[i];
        let key = common_1.bintools.cb58Decode(key_data.key);
        let nonce = common_1.bintools.cb58Decode(key_data.iv);
        let key_decrypt = await cryptoHelpers.decrypt(pass, key, salt, nonce);
        let key_string = common_1.bintools.cb58Encode(avalanchejs_1.Buffer.from(key_decrypt));
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
exports.readV4 = readV4;
async function readV5(data, pass) {
    const version = data.version;
    cryptoHelpers.keygenIterations = constants_1.ITERATIONS_V3;
    let salt = common_1.bintools.cb58Decode(data.salt);
    let pass_hash = data.pass_hash;
    let checkHashString;
    let checkHash = await cryptoHelpers.pwhash(pass, salt);
    checkHashString = common_1.bintools.cb58Encode(avalanchejs_1.Buffer.from(checkHash.hash));
    if (checkHashString !== pass_hash) {
        throw 'INVALID_PASS';
    }
    let keys = data.keys;
    let keysDecrypt = [];
    for (let i = 0; i < keys.length; i++) {
        let key_data = keys[i];
        let key = common_1.bintools.cb58Decode(key_data.key);
        let nonce = common_1.bintools.cb58Decode(key_data.iv);
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
exports.readV5 = readV5;
async function readV6(data, pass) {
    const version = data.version;
    const activeIndex = data.activeIndex;
    cryptoHelpers.keygenIterations = constants_1.ITERATIONS_V3;
    let salt = common_1.bintools.cb58Decode(data.salt);
    let keys = data.keys;
    let keysDecrypt = [];
    for (let i = 0; i < keys.length; i++) {
        let key_data = keys[i];
        let key = common_1.bintools.cb58Decode(key_data.key);
        let type = key_data.type;
        let nonce = common_1.bintools.cb58Decode(key_data.iv);
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
exports.readV6 = readV6;
/**
 * Will decrypt and return the keys of the encrypted wallets in the given json file
 * @param data A JSON file of encrypted wallet keys
 * @param pass The password to decrypt the keys
 */
async function readKeyFile(data, pass) {
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
exports.readKeyFile = readKeyFile;
function extractKeysV2(file) {
    let chainID = network_1.xChain.getBlockchainAlias();
    let keys = file.keys;
    return keys.map((key) => {
        // Private keys from the keystore file do not have the PrivateKey- prefix
        let pk = 'PrivateKey-' + key.key;
        // let keypair = keyToKeypair(pk, chainID)
        let keypair = network_1.xChain.newKeyChain().importKey(pk);
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
exports.extractKeysV2 = extractKeysV2;
function extractKeysV5(file) {
    return file.keys.map((key) => ({
        key: key.key,
        type: 'mnemonic',
    }));
}
exports.extractKeysV5 = extractKeysV5;
function extractKeysV6(file) {
    return file.keys.map((key) => ({
        type: key.type,
        key: key.key,
    }));
}
exports.extractKeysV6 = extractKeysV6;
function extractKeysFromDecryptedFile(file) {
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
exports.extractKeysFromDecryptedFile = extractKeysFromDecryptedFile;
//# sourceMappingURL=keystore.js.map