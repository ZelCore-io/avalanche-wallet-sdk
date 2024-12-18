import { Buffer as BufferAvalanche } from 'avalanche';
import { avalanche } from '../../Network/network';
import { KeyChain as EVMKeyChain, } from 'avalanche/dist/apis/evm';
import { EvmWalletReadonly } from '../../Wallet/EVM/EvmWalletReadonly';
import { bintools } from '../../common';
import { computePublicKey } from 'ethers/lib/utils';
import { personalSign, signTypedData, SignTypedDataVersion, } from '@metamask/eth-sig-util';
import * as bitcoin from 'bitcoinjs-lib';
export class EvmWallet extends EvmWalletReadonly {
    privateKey;
    btcPair;
    constructor(key) {
        // Compute the uncompressed public key from private key
        let pubKey = computePublicKey(key);
        super(pubKey);
        this.btcPair = bitcoin.ECPair.fromPrivateKey(key);
        this.privateKey = key;
    }
    static fromPrivateKey(key) {
        return new EvmWallet(Buffer.from(key, 'hex'));
    }
    getPrivateKeyBech() {
        return `PrivateKey-` + bintools.cb58Encode(BufferAvalanche.from(this.privateKey));
    }
    getKeyChain() {
        let keychain = new EVMKeyChain(avalanche.getHRP(), 'C');
        keychain.importKey(this.getPrivateKeyBech());
        return keychain;
    }
    getKeyPair() {
        let keychain = new EVMKeyChain(avalanche.getHRP(), 'C');
        return keychain.importKey(this.getPrivateKeyBech());
    }
    signEVM(tx) {
        return tx.sign(this.privateKey);
    }
    signBTCHash(hash) {
        return this.btcPair.sign(hash);
    }
    signC(tx) {
        return tx.sign(this.getKeyChain());
    }
    getPrivateKeyHex() {
        return this.privateKey.toString('hex');
    }
    /**
     * This function is equivalent to the eth_sign Ethereum JSON-RPC method as specified in EIP-1417,
     * as well as the MetaMask's personal_sign method.
     * @param data The hex data to sign. Must start with `0x`.
     */
    personalSign(data) {
        return personalSign({ privateKey: this.privateKey, data });
    }
    /**
     * Sign typed data according to EIP-712. The signing differs based upon the version.
     * V1 is based upon an early version of EIP-712 that lacked some later security improvements, and should generally be neglected in favor of later versions.
     * V3 is based on EIP-712, except that arrays and recursive data structures are not supported.
     * V4 is based on EIP-712, and includes full support of arrays and recursive data structures.
     * @param data The typed data to sign.
     * @param version The signing version to use.
     */
    signTypedData(data, version) {
        return signTypedData({
            privateKey: this.privateKey,
            data,
            version,
        });
    }
    /**
     * V1 is based upon an early version of EIP-712 that lacked some later security improvements, and should generally be neglected in favor of later versions.
     * @param data The typed data to sign.
     * */
    signTypedData_V1(data) {
        return this.signTypedData(data, SignTypedDataVersion.V1);
    }
    /**
     * V3 is based on EIP-712, except that arrays and recursive data structures are not supported.
     * @param data The typed data to sign.
     */
    signTypedData_V3(data) {
        return this.signTypedData(data, SignTypedDataVersion.V3);
    }
    /**
     * V4 is based on EIP-712, and includes full support of arrays and recursive data structures.
     * @param data The typed data to sign.
     */
    signTypedData_V4(data) {
        return this.signTypedData(data, SignTypedDataVersion.V4);
    }
}
//# sourceMappingURL=EvmWallet.js.map