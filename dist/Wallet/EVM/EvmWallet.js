"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvmWallet = void 0;
const tslib_1 = require("tslib");
const avalanche_1 = require("avalanche");
const network_1 = require("../../Network/network");
const evm_1 = require("avalanche/dist/apis/evm");
const EvmWalletReadonly_1 = require("../../Wallet/EVM/EvmWalletReadonly");
const common_1 = require("../../common");
const utils_1 = require("ethers/lib/utils");
const eth_sig_util_1 = require("@metamask/eth-sig-util");
const bitcoin = tslib_1.__importStar(require("bitcoinjs-lib"));
class EvmWallet extends EvmWalletReadonly_1.EvmWalletReadonly {
    privateKey;
    btcPair;
    constructor(key) {
        // Compute the uncompressed public key from private key
        let pubKey = (0, utils_1.computePublicKey)(key);
        super(pubKey);
        this.btcPair = bitcoin.ECPair.fromPrivateKey(key);
        this.privateKey = key;
    }
    static fromPrivateKey(key) {
        return new EvmWallet(Buffer.from(key, 'hex'));
    }
    getPrivateKeyBech() {
        return `PrivateKey-` + common_1.bintools.cb58Encode(avalanche_1.Buffer.from(this.privateKey));
    }
    getKeyChain() {
        let keychain = new evm_1.KeyChain(network_1.avalanche.getHRP(), 'C');
        keychain.importKey(this.getPrivateKeyBech());
        return keychain;
    }
    getKeyPair() {
        let keychain = new evm_1.KeyChain(network_1.avalanche.getHRP(), 'C');
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
        return (0, eth_sig_util_1.personalSign)({ privateKey: this.privateKey, data });
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
        return (0, eth_sig_util_1.signTypedData)({
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
        return this.signTypedData(data, eth_sig_util_1.SignTypedDataVersion.V1);
    }
    /**
     * V3 is based on EIP-712, except that arrays and recursive data structures are not supported.
     * @param data The typed data to sign.
     */
    signTypedData_V3(data) {
        return this.signTypedData(data, eth_sig_util_1.SignTypedDataVersion.V3);
    }
    /**
     * V4 is based on EIP-712, and includes full support of arrays and recursive data structures.
     * @param data The typed data to sign.
     */
    signTypedData_V4(data) {
        return this.signTypedData(data, eth_sig_util_1.SignTypedDataVersion.V4);
    }
}
exports.EvmWallet = EvmWallet;
//# sourceMappingURL=EvmWallet.js.map