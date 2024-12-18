import { WalletProvider } from '../Wallet/Wallet';
import { pChain, xChain } from '../Network/network';
import { Buffer as BufferAvalanche } from 'avalanche';
import { EvmWallet } from '../Wallet/EVM/EvmWallet';
import { bintools } from '../common';
export class SingletonWallet extends WalletProvider {
    type = 'singleton';
    key = '';
    keyBuff;
    evmWallet;
    /**
     *
     * @param privateKey An avalanche private key, starts with `PrivateKey-`
     */
    constructor(privateKey) {
        super();
        this.key = privateKey;
        // Derive EVM key and address
        let pkBuf = bintools.cb58Decode(privateKey.split('-')[1]);
        this.keyBuff = pkBuf;
        let pkHex = pkBuf.toString('hex');
        let pkBuffNative = Buffer.from(pkHex, 'hex');
        this.evmWallet = new EvmWallet(pkBuffNative);
    }
    static fromPrivateKey(key) {
        return new SingletonWallet(key);
    }
    static fromEvmKey(key) {
        let keyBuff = bintools.cb58Encode(BufferAvalanche.from(key, 'hex'));
        let avmKeyStr = `PrivateKey-${keyBuff}`;
        return new SingletonWallet(avmKeyStr);
    }
    getKeyChainX() {
        let keyChain = xChain.newKeyChain();
        keyChain.importKey(this.key);
        return keyChain;
    }
    getKeyChainP() {
        let keyChain = pChain.newKeyChain();
        keyChain.importKey(this.key);
        return keyChain;
    }
    /**
     * Returns the derived private key used by the EVM wallet.
     */
    getEvmPrivateKeyHex() {
        return this.evmWallet.getPrivateKeyHex();
    }
    getAddressP() {
        let keyChain = this.getKeyChainP();
        return keyChain.getAddressStrings()[0];
    }
    getAddressX() {
        let keyChain = this.getKeyChainX();
        return keyChain.getAddressStrings()[0];
    }
    async getAllAddressesP() {
        return [this.getAddressP()];
    }
    getAllAddressesPSync() {
        return [this.getAddressP()];
    }
    async getAllAddressesX() {
        return [this.getAddressX()];
    }
    getAllAddressesXSync() {
        return [this.getAddressX()];
    }
    getChangeAddressX() {
        return this.getAddressX();
    }
    async getExternalAddressesP() {
        return [this.getAddressP()];
    }
    getExternalAddressesPSync() {
        return [this.getAddressP()];
    }
    async getExternalAddressesX() {
        return [this.getAddressX()];
    }
    getExternalAddressesXSync() {
        return [this.getAddressX()];
    }
    async getInternalAddressesX() {
        return [this.getAddressX()];
    }
    getInternalAddressesXSync() {
        return [this.getAddressX()];
    }
    async signC(tx) {
        return this.evmWallet.signC(tx);
    }
    async signEvm(tx) {
        return this.evmWallet.signEVM(tx);
    }
    async signP(tx) {
        return tx.sign(this.getKeyChainP());
    }
    async signX(tx) {
        return tx.sign(this.getKeyChainX());
    }
    /**
     * This function is equivalent to the eth_sign Ethereum JSON-RPC method as specified in EIP-1417,
     * as well as the MetaMask's personal_sign method.
     * @param data The hex data to sign
     */
    async personalSign(data) {
        return this.evmWallet.personalSign(data);
    }
    /**
     * V1 is based upon an early version of EIP-712 that lacked some later security improvements, and should generally be neglected in favor of later versions.
     * @param data The typed data to sign.
     * */
    async signTypedData_V1(data) {
        return this.evmWallet.signTypedData_V1(data);
    }
    /**
     * V3 is based on EIP-712, except that arrays and recursive data structures are not supported.
     * @param data The typed data to sign.
     */
    async signTypedData_V3(data) {
        return this.evmWallet.signTypedData_V3(data);
    }
    /**
     * V4 is based on EIP-712, and includes full support of arrays and recursive data structures.
     * @param data The typed data to sign.
     */
    async signTypedData_V4(data) {
        return this.evmWallet.signTypedData_V4(data);
    }
}
//# sourceMappingURL=SingletonWallet.js.map