"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const buffer_1 = require("buffer/");
const create_hash_1 = tslib_1.__importDefault(require("create-hash"));
const node_crypto_1 = tslib_1.__importDefault(require("node:crypto"));
/**
 * @ignore
 */
/**
 * Helper utility for encryption and password hashing, browser-safe.
 * Encryption is using AES-GCM with a random public nonce.
 */
class CryptoHelpers {
    ivSize = 12;
    saltSize = 16;
    tagLength = 128;
    aesLength = 256;
    keygenIterations = 200000; //3.0, 2.0 uses 100000
    /**
     * Internal-intended function for cleaning passwords.
     *
     * @param password
     * @param salt
     */
    _pwcleaner(password, slt) {
        const pw = buffer_1.Buffer.from(password, 'utf8');
        return this.sha256(buffer_1.Buffer.concat([pw, slt]));
    }
    /**
     * Internal-intended function for producing an intermediate key.
     *
     * @param pwkey
     */
    async _keyMaterial(pwkey) {
        return node_crypto_1.default.subtle.importKey('raw', new Uint8Array(pwkey), { name: 'PBKDF2' }, false, ['deriveKey']);
    }
    /**
     * Internal-intended function for turning an intermediate key into a salted key.
     *
     * @param keyMaterial
     * @param salt
     */
    async _deriveKey(keyMaterial, salt) {
        return node_crypto_1.default.subtle.deriveKey({
            name: 'PBKDF2',
            salt,
            iterations: this.keygenIterations,
            hash: 'SHA-256',
        }, keyMaterial, { name: 'AES-GCM', length: this.aesLength }, false, ['encrypt', 'decrypt']);
    }
    /**
     * A SHA256 helper function.
     *
     * @param message The message to hash
     *
     * @returns A {@link https://github.com/feross/buffer|Buffer} containing the SHA256 hash of the message
     */
    sha256(message) {
        let buff;
        if (typeof message === 'string') {
            buff = buffer_1.Buffer.from(message, 'utf8');
        }
        else {
            buff = buffer_1.Buffer.from(message);
        }
        return buffer_1.Buffer.from((0, create_hash_1.default)('sha256').update(buff).digest()); // ensures correct Buffer class is used
    }
    /**
     * Generates a randomized {@link https://github.com/feross/buffer|Buffer} to be used as a salt
     */
    makeSalt() {
        const salt = buffer_1.Buffer.alloc(this.saltSize);
        node_crypto_1.default.getRandomValues(salt);
        return salt;
    }
    /**
     * Produces a password-safe hash.
     *
     * @param password A string for the password
     * @param salt An optional {@link https://github.com/feross/buffer|Buffer} containing a salt used in the password hash
     *
     * @returns An object containing the "salt" and the "hash" produced by this function, both as {@link https://github.com/feross/buffer|Buffer}.
     */
    async pwhash(password, salt) {
        let slt;
        if (salt instanceof buffer_1.Buffer) {
            slt = salt;
            // @ts-ignore
        }
        else if (salt instanceof Uint8Array && process.env.NODE_ENV === 'test') {
            slt = salt;
        }
        else {
            slt = this.makeSalt();
        }
        const hash = this._pwcleaner(password, this._pwcleaner(password, slt));
        return { salt: slt, hash };
    }
    /**
     * Encrypts plaintext with the provided password using AES-GCM.
     *
     * @param password A string for the password
     * @param plaintext The plaintext to encrypt
     * @param salt An optional {@link https://github.com/feross/buffer|Buffer} for the salt to use in the encryption process
     *
     * @returns An object containing the "salt", "iv", and "ciphertext", all as {@link https://github.com/feross/buffer|Buffer}.
     */
    async encrypt(password, plaintext, salt = undefined) {
        let slt;
        if (typeof salt !== 'undefined' && salt instanceof buffer_1.Buffer) {
            slt = salt;
        }
        else {
            slt = this.makeSalt();
        }
        let pt;
        if (typeof plaintext !== 'undefined' && plaintext instanceof buffer_1.Buffer) {
            pt = plaintext;
        }
        else {
            pt = buffer_1.Buffer.from(plaintext, 'utf8');
        }
        const pwkey = this._pwcleaner(password, slt);
        const keyMaterial = await this._keyMaterial(pwkey);
        const pkey = await this._deriveKey(keyMaterial, slt);
        const iv = buffer_1.Buffer.from(node_crypto_1.default.getRandomValues(new Uint8Array(this.ivSize)));
        const ciphertext = buffer_1.Buffer.from(await node_crypto_1.default.subtle.encrypt({
            name: 'AES-GCM',
            iv,
            additionalData: slt,
            tagLength: this.tagLength,
        }, pkey, pt));
        return {
            salt: slt,
            iv,
            ciphertext,
        };
    }
    /**
     * Decrypts ciphertext with the provided password, iv, and salt.
     *
     * @param password A string for the password
     * @param ciphertext A {@link https://github.com/feross/buffer|Buffer} for the ciphertext
     * @param salt A {@link https://github.com/feross/buffer|Buffer} for the salt
     * @param iv A {@link https://github.com/feross/buffer|Buffer} for the iv
     */
    async decrypt(password, ciphertext, salt, iv) {
        const pwkey = this._pwcleaner(password, salt);
        const keyMaterial = await this._keyMaterial(pwkey);
        const pkey = await this._deriveKey(keyMaterial, salt);
        const pt = buffer_1.Buffer.from(await node_crypto_1.default.subtle.decrypt({
            name: 'AES-GCM',
            iv,
            additionalData: salt,
            tagLength: 128, // The tagLength you used to encrypt (if any)
        }, pkey, // from generateKey or importKey above
        ciphertext // ArrayBuffer of the data
        ));
        return pt;
    }
    constructor() { }
}
exports.default = CryptoHelpers;
//# sourceMappingURL=Crypto.js.map