import { BN, Buffer as BufferAvalanche } from 'avalanche';
import { avalanche, web3 } from '@/Network/network';
import { ethers } from 'ethers';
import { KeyPair as EVMKeyPair } from 'avalanche/dist/apis/evm/keychain';
import { bintools } from '@/common';
import { computePublicKey, computeAddress } from 'ethers/lib/utils';
import { payments, networks, ECPair } from 'bitcoinjs-lib';
import { buildEvmTransferErc721Tx, estimateErc721TransferGas } from '@/helpers/tx_helper';
export class EvmWalletReadonly {
    balance = new BN(0);
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
        this.address = computeAddress(publicKey);
    }
    getBalance() {
        return this.balance;
    }
    getAddress() {
        return ethers.utils.getAddress(this.address);
    }
    getCompressedPublicKey() {
        return computePublicKey(this.publicKey, true);
    }
    getAddressBech32() {
        const compressedKey = this.getCompressedPublicKey();
        let addr = EVMKeyPair.addressFromPublicKey(BufferAvalanche.from(compressedKey.substring(2), 'hex'));
        return bintools.addressToString(avalanche.getHRP(), 'C', addr);
    }
    /**
     * Returns a native P2WPKH address with the prefix `bc1q`. This bitcoin address is
     * derived from the same public key of the C chain address.
     */
    getAddressBTC(networkType = 'bitcoin') {
        let network;
        if (networkType === 'bitcoin') {
            network = networks.bitcoin;
        }
        else if (networkType === 'testnet') {
            network = networks.testnet;
        }
        else {
            network = networks.regtest;
        }
        const compressedBuff = Buffer.from(this.getCompressedPublicKey().substring(2), 'hex');
        let ecPair = ECPair.fromPublicKey(compressedBuff);
        let { address } = payments.p2wpkh({ pubkey: ecPair.publicKey, network });
        if (!address)
            throw new Error('Unable to get BTC address.');
        return address;
    }
    async updateBalance() {
        let bal = await web3.eth.getBalance(this.address);
        this.balance = new BN(bal.toString());
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
        return buildEvmTransferErc721Tx(this.getAddress(), to, gasPrice, gasLimit, contract, tokenID);
    }
    async estimateErc721TransferGasLimit(contract, to, tokenID) {
        return estimateErc721TransferGas(contract, this.getAddress(), to, tokenID);
    }
}
//# sourceMappingURL=EvmWalletReadonly.js.map