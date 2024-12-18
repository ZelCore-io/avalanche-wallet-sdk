"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvmWalletReadonly = void 0;
const avalanche_1 = require("avalanche");
const network_1 = require("@/Network/network");
const ethers_1 = require("ethers");
const keychain_1 = require("avalanche/dist/apis/evm/keychain");
const common_1 = require("@/common");
const utils_1 = require("ethers/lib/utils");
const bitcoinjs_lib_1 = require("bitcoinjs-lib");
const tx_helper_1 = require("@/helpers/tx_helper");
class EvmWalletReadonly {
    balance = new avalanche_1.BN(0);
    address;
    publicKey;
    publicKeyBuff;
    /**
     *
     * @param publicKey 64 byte uncompressed public key. Starts with `0x`.
     */
    constructor(publicKey) {
        this.publicKey = publicKey;
        this.publicKeyBuff = Buffer.from(publicKey.substr(2), 'hex');
        this.address = (0, utils_1.computeAddress)(publicKey);
    }
    getBalance() {
        return this.balance;
    }
    getAddress() {
        return ethers_1.ethers.utils.getAddress(this.address);
    }
    getCompressedPublicKey() {
        return (0, utils_1.computePublicKey)(this.publicKey, true);
    }
    getAddressBech32() {
        const compressedKey = this.getCompressedPublicKey();
        let addr = keychain_1.KeyPair.addressFromPublicKey(avalanche_1.Buffer.from(compressedKey.substring(2), 'hex'));
        return common_1.bintools.addressToString(network_1.avalanche.getHRP(), 'C', addr);
    }
    /**
     * Returns a native P2WPKH address with the prefix `bc1q`. This bitcoin address is
     * derived from the same public key of the C chain address.
     */
    getAddressBTC(networkType = 'bitcoin') {
        let network;
        if (networkType === 'bitcoin') {
            network = bitcoinjs_lib_1.networks.bitcoin;
        }
        else if (networkType === 'testnet') {
            network = bitcoinjs_lib_1.networks.testnet;
        }
        else {
            network = bitcoinjs_lib_1.networks.regtest;
        }
        const compressedBuff = Buffer.from(this.getCompressedPublicKey().substring(2), 'hex');
        let ecPair = bitcoinjs_lib_1.ECPair.fromPublicKey(compressedBuff);
        let { address } = bitcoinjs_lib_1.payments.p2wpkh({ pubkey: ecPair.publicKey, network });
        if (!address)
            throw new Error('Unable to get BTC address.');
        return address;
    }
    async updateBalance() {
        let bal = await network_1.web3.eth.getBalance(this.address);
        this.balance = new avalanche_1.BN(bal.toString());
        return this.balance;
    }
    /**
     * Builds an unsigned ERC721 transfer transaction from this wallet.
     * @param contract The ERC721 Contract address
     * @param tokenID Token ID
     * @param to Recipient hex address.
     * @param gasPrice Gas price in `BN`
     * @param gasLimit Gas limit
     */
    buildErc721TransferTx(contract, tokenID, to, gasPrice, gasLimit) {
        return (0, tx_helper_1.buildEvmTransferErc721Tx)(this.getAddress(), to, gasPrice, gasLimit, contract, tokenID);
    }
    async estimateErc721TransferGasLimit(contract, to, tokenID) {
        return (0, tx_helper_1.estimateErc721TransferGas)(contract, this.getAddress(), to, tokenID);
    }
}
exports.EvmWalletReadonly = EvmWalletReadonly;
//# sourceMappingURL=EvmWalletReadonly.js.map