"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletProvider = void 0;
const tslib_1 = require("tslib");
const tx_helper_1 = require("../helpers/tx_helper");
const avalanche_1 = require("avalanche");
const network_1 = require("../Network/network");
const utxo_helper_1 = require("../helpers/utxo_helper");
const avm_1 = require("avalanche/dist/apis/avm");
const platformvm_1 = require("avalanche/dist/apis/platformvm");
const utils_1 = require("avalanche/dist/utils");
const Assets_1 = require("../Asset/Assets");
const Erc20_1 = require("../Asset/Erc20");
const errors_1 = require("../errors");
const utils_2 = require("../utils");
const events_1 = tslib_1.__importDefault(require("events"));
const History_1 = require("../History");
const common_1 = require("../common");
const UniversalTx_1 = require("../UniversalTx");
const eventEmitter_1 = require("../Network/eventEmitter");
const idFromAlias_1 = require("../Network/helpers/idFromAlias");
const gas_helper_1 = require("../helpers/gas_helper");
const snowtrace_1 = require("../Explorer/snowtrace");
const Explorer_1 = require("../Explorer");
const getHistoryForOwnedAddresses_1 = require("../History/getHistoryForOwnedAddresses");
class WalletProvider {
    /**
     * The X chain UTXOs of the wallet's current state
     */
    utxosX = new avm_1.UTXOSet();
    /**
     * The P chain UTXOs of the wallet's current state
     */
    utxosP = new platformvm_1.UTXOSet();
    balanceX = {};
    constructor() {
        eventEmitter_1.networkEvents.on('network_change', this.onNetworkChange.bind(this));
    }
    /**
     * Call after getting done with the wallet to avoi memory leaks and remove event listeners
     */
    destroy() {
        eventEmitter_1.networkEvents.removeAllListeners('network_change');
    }
    /**
     * Fired when the network changes
     * @param config
     * @protected
     */
    //@ts-ignore
    onNetworkChange(config) { }
    /***
     * Used to get an identifier string that is consistent across different network connections.
     * Currently returns the C address of this wallet.
     */
    getBaseAddress() {
        return this.getAddressC();
    }
    emitter = new events_1.default();
    on(event, listener) {
        this.emitter.on(event, listener);
    }
    off(event, listener) {
        this.emitter.off(event, listener);
    }
    emit(event, args) {
        this.emitter.emit(event, args);
    }
    emitAddressChange() {
        this.emit('addressChanged', {
            X: this.getAddressX(),
            changeX: this.getChangeAddressX(),
            P: this.getAddressP(),
        });
    }
    emitBalanceChangeX() {
        this.emit('balanceChangedX', this.balanceX);
    }
    emitBalanceChangeP() {
        this.emit('balanceChangedP', this.getAvaxBalanceP());
    }
    emitBalanceChangeC() {
        this.emit('balanceChangedC', this.getAvaxBalanceC());
    }
    /**
     * Gets the active address on the C chain
     * @return Hex representation of the EVM address.
     */
    getAddressC() {
        return this.evmWallet.getAddress();
    }
    getEvmAddressBech() {
        return this.evmWallet.getAddressBech32();
    }
    /**
     * Returns the BTC address of the C-Chain public key.
     */
    getAddressBTC(type) {
        return this.evmWallet.getAddressBTC(type);
    }
    /**
     *
     * @param to - the address funds are being send to.
     * @param amount - amount of AVAX to send in nAVAX
     * @param memo - A MEMO for the transaction
     */
    async sendAvaxX(to, amount, memo) {
        if (!network_1.activeNetwork)
            throw errors_1.NO_NETWORK;
        let memoBuff = memo ? avalanche_1.Buffer.from(memo) : undefined;
        let froms = await this.getAllAddressesX();
        let changeAddress = this.getChangeAddressX();
        let utxoSet = this.utxosX;
        let tx = await network_1.xChain.buildBaseTx(utxoSet, amount, network_1.activeNetwork.avaxID, [to], froms, [changeAddress], memoBuff);
        let signedTx = await this.signX(tx);
        let txId = await network_1.xChain.issueTx(signedTx);
        await (0, utils_2.waitTxX)(txId);
        // Update UTXOs
        this.updateUtxosX();
        return txId;
    }
    /**
     * Sends AVAX to another address on the C chain using legacy transaction format.
     * @param to Hex address to send AVAX to.
     * @param amount Amount of AVAX to send, represented in WEI format.
     * @param gasPrice Gas price in WEI format
     * @param gasLimit Gas limit
     *
     * @return Returns the transaction hash
     */
    async sendAvaxC(to, amount, gasPrice, gasLimit) {
        let fromAddr = this.getAddressC();
        let tx = await (0, tx_helper_1.buildEvmTransferNativeTx)(fromAddr, to, amount, gasPrice, gasLimit);
        let txId = await this.issueEvmTx(tx);
        await this.updateAvaxBalanceC();
        return txId;
    }
    /**
     * Send Avalanche Native Tokens on X chain
     * @param assetID ID of the token to send
     * @param amount How many units of the token to send. Based on smallest divisible unit.
     * @param to X chain address to send tokens to
     */
    async sendANT(assetID, amount, to) {
        let utxoSet = this.getUtxosX();
        let fromAddrs = await this.getAllAddressesX();
        let changeAddr = this.getChangeAddressX();
        let tx = await network_1.xChain.buildBaseTx(utxoSet, amount, assetID, [to], fromAddrs, [changeAddr]);
        let signed = await this.signX(tx);
        let txId = await network_1.xChain.issueTx(signed);
        await (0, utils_2.waitTxX)(txId);
        this.updateUtxosX();
        return txId;
    }
    /**
     * Makes a transfer call on a ERC20 contract.
     * @param to Hex address to transfer tokens to.
     * @param amount Amount of the ERC20 token to send, donated in the token's correct denomination.
     * @param gasPrice Gas price in WEI format
     * @param gasLimit Gas limit
     * @param contractAddress Contract address of the ERC20 token
     */
    async sendErc20(to, amount, gasPrice, gasLimit, contractAddress) {
        let fromAddr = this.getAddressC();
        let token = await (0, Erc20_1.getErc20Token)(contractAddress);
        let balOld = await token.balanceOf(fromAddr);
        let tx = await (0, tx_helper_1.buildEvmTransferErc20Tx)(fromAddr, to, amount, gasPrice, gasLimit, contractAddress);
        let txHash = await this.issueEvmTx(tx);
        // TODO: We should not be using setTimeout, wait until tx is confirmed on chain
        // TODO: Can it be an issue with sticky sessions? Nodes behind a LB?
        // If new balance doesnt match old, emit balance change
        setTimeout(async () => {
            let balNew = await token.balanceOf(fromAddr);
            if (!balOld.eq(balNew)) {
                this.emitBalanceChangeC();
            }
        }, 2000);
        return txHash;
    }
    /**
     * Makes a `safeTransferFrom` call on a ERC721 contract.
     * @param to Hex address to transfer the NFT to.
     * @param tokenID ID of the token to transfer inside the ERC71 family.
     * @param gasPrice Gas price in WEI format
     * @param gasLimit Gas limit
     * @param contractAddress Contract address of the ERC721 token
     */
    async sendErc721(contractAddress, to, tokenID, gasPrice, gasLimit) {
        const tx = await (0, tx_helper_1.buildEvmTransferErc721Tx)(this.getAddressC(), to, gasPrice, gasLimit, contractAddress, tokenID);
        return await this.issueEvmTx(tx);
    }
    /**
     * Estimate the gas needed for an ERC20 Transfer transaction
     * @param contractAddress The ERC20 contract address
     * @param to Address receiving the tokens
     * @param amount Amount to send. Given in the smallest divisible unit.
     */
    async estimateErc20Gas(contractAddress, to, amount) {
        let from = this.getAddressC();
        const gas = await (0, tx_helper_1.estimateErc20Gas)(contractAddress, from, to, amount);
        return Number(gas.toString());
    }
    /**
     * Estimate the gas needed for an ERC721 `safeTransferFrom` transaction
     * @param contractAddress The ERC20 contract address
     * @param to Address receiving the tokens
     * @param tokenID ID of the token to transfer inside the ERC71 family.
     */
    async estimateErc721TransferGasLimit(contractAddress, to, tokenID) {
        return this.evmWallet.estimateErc721TransferGasLimit(contractAddress, to, tokenID);
    }
    /**
     * Estimate gas limit for the given inputs.
     * @param to
     * @param data
     */
    async estimateGas(to, data) {
        const from = this.getAddressC();
        const nonce = await network_1.web3.eth.getTransactionCount(from);
        return await network_1.web3.eth.estimateGas({
            from: from,
            nonce: nonce,
            to: to,
            data: data,
        });
    }
    /**
     * Estimate the gas needed for a AVAX send transaction on the C chain.
     * @param to Destination address.
     * @param amount Amount of AVAX to send, in WEI.
     */
    async estimateAvaxGasLimit(to, amount, gasPrice) {
        let from = this.getAddressC();
        return await (0, tx_helper_1.estimateAvaxGas)(from, to, amount, gasPrice);
    }
    /**
     * A method to create custom EVM transactions.
     * @param gasPrice
     * @param gasLimit
     * @param data `data` field of the transaction, in hex format
     * @param to `to` field of the transaction, in hex format
     * @param value `value` field of the transaction, in hex format
     * @param nonce Nonce of the transaction, in number. If not provided, SDK will get the latest nonce from the network
     */
    async sendCustomEvmTx(gasPrice, gasLimit, data, to, value, nonce) {
        let from = this.getAddressC();
        let tx = await (0, tx_helper_1.buildCustomEvmTx)(from, gasPrice, gasLimit, data, to, value, nonce);
        return await this.issueEvmTx(tx);
    }
    /**
     * Returns the maximum spendable AVAX balance for the given chain.
     * Scans all chains and take cross over fees into account
     * @param chainType X, P or C
     */
    getUsableAvaxBalanceForChain(chainType, atomicFeeXP, atomicFeeC) {
        return this.createUniversalNode(chainType, atomicFeeXP, atomicFeeC).reduceTotalBalanceFromParents();
    }
    /**
     * Create a new instance of a UniversalNode for the given chain using current balance state
     * @param chain Chain of the universal node.
     * @private
     */
    createUniversalNode(chain, atomicFeeXP, atomicFeeC) {
        let xBal = this.getAvaxBalanceX().unlocked;
        let pBal = this.getAvaxBalanceP().unlocked;
        let cBal = (0, utils_2.avaxCtoX)(this.getAvaxBalanceC()); // need to use 9 decimal places
        switch (chain) {
            case 'X':
                return (0, UniversalTx_1.createGraphForX)(xBal, pBal, cBal, atomicFeeXP, atomicFeeC);
            case 'P':
                return (0, UniversalTx_1.createGraphForP)(xBal, pBal, cBal, atomicFeeXP, atomicFeeC);
            case 'C':
                return (0, UniversalTx_1.createGraphForC)(xBal, pBal, cBal, atomicFeeXP, atomicFeeC);
        }
    }
    /**
     * Can this wallet have the given amount on the given chain after a series of internal transactions (if required).
     * @param chain X/P/C
     * @param amount The amount to check against
     */
    canHaveBalanceOnChain(chain, amount, atomicFeeXP, atomicFeeC) {
        // The maximum amount of AVAX we can have on this chain
        let maxAmt = this.createUniversalNode(chain, atomicFeeXP, atomicFeeC).reduceTotalBalanceFromParents();
        return maxAmt.gte(amount);
    }
    /**
     * Returns an array of transaction to do in order to have the target amount on the given chain
     * @param chain The chain (X/P/C) to have the desired amount on
     * @param amount The desired amount
     */
    getTransactionsForBalance(chain, amount, atomicFeeXP, atomicFeeC) {
        let xBal = this.getAvaxBalanceX().unlocked;
        let pBal = this.getAvaxBalanceP().unlocked;
        let cBal = (0, utils_2.avaxCtoX)(this.getAvaxBalanceC()); // need to use 9 decimal places
        switch (chain) {
            case 'P':
                return (0, UniversalTx_1.getStepsForBalanceP)(xBal, pBal, cBal, amount, atomicFeeXP, atomicFeeC);
            case 'C':
                return (0, UniversalTx_1.getStepsForBalanceC)(xBal, pBal, cBal, amount, atomicFeeXP, atomicFeeC);
            case 'X':
                return (0, UniversalTx_1.getStepsForBalanceX)(xBal, pBal, cBal, amount, atomicFeeXP, atomicFeeC);
        }
    }
    /**
     * Given a `Transaction`, it will sign and issue it to the network.
     * @param tx The unsigned transaction to issue.
     */
    async issueEvmTx(tx) {
        let signedTx = await this.signEvm(tx);
        let txHex = avalanche_1.Buffer.from(signedTx.serialize()).toString('hex');
        let hash = await network_1.web3.eth.sendSignedTransaction('0x' + txHex);
        const txHash = network_1.web3.utils.bytesToHex(hash.transactionHash);
        return await (0, utils_2.waitTxEvm)(txHash);
    }
    /**
     * Returns the C chain AVAX balance of the wallet in WEI format.
     */
    async updateAvaxBalanceC() {
        let balOld = this.evmWallet.getBalance();
        let balNew = await this.evmWallet.updateBalance();
        if (!balOld.eq(balNew)) {
            this.emitBalanceChangeC();
        }
        return balNew;
    }
    /**
     *  Returns UTXOs on the X chain that belong to this wallet.
     *  - Makes network request.
     *  - Updates `this.utxosX` with new UTXOs
     *  - Calls `this.updateBalanceX()` after success.
     *  */
    async updateUtxosX() {
        const addresses = await this.getAllAddressesX();
        this.utxosX = await (0, utxo_helper_1.avmGetAllUTXOs)(addresses);
        await this.updateUnknownAssetsX();
        await this.updateBalanceX();
        return this.utxosX;
    }
    /**
     *  Returns the fetched UTXOs on the X chain that belong to this wallet.
     */
    getUtxosX() {
        return this.utxosX;
    }
    /**
     *  Returns UTXOs on the P chain that belong to this wallet.
     *  - Makes network request.
     *  - Updates `this.utxosP` with the new UTXOs
     */
    async updateUtxosP() {
        let addresses = await this.getAllAddressesP();
        this.utxosP = await (0, utxo_helper_1.platformGetAllUTXOs)(addresses);
        this.emitBalanceChangeP();
        return this.utxosP;
    }
    /**
     * Returns the fetched UTXOs on the P chain that belong to this wallet.
     */
    getUtxosP() {
        return this.utxosP;
    }
    /**
     * Returns the number AVAX staked by this wallet.
     */
    async getStake() {
        let addrs = await this.getAllAddressesP();
        return await (0, utxo_helper_1.getStakeForAddresses)(addrs);
    }
    /**
     * Returns the wallet's balance of the given ERC20 contracts
     * @param addresses ERC20 Contract addresses
     */
    async getBalanceERC20(addresses) {
        let walletAddr = this.getAddressC();
        let tokenCalls = addresses.map((addr) => (0, Erc20_1.getErc20Token)(addr));
        let tokens = await Promise.all(tokenCalls);
        let balanceCalls = tokens.map((token) => token.balanceOf(walletAddr));
        let balances = await Promise.all(balanceCalls);
        return balances.map((bal, i) => {
            let token = tokens[i];
            let balance = {
                address: token.address,
                denomination: token.decimals,
                balanceParsed: (0, utils_2.bnToLocaleString)(bal, token.decimals),
                balance: bal,
                name: token.name,
                symbol: token.symbol,
            };
            return balance;
        });
    }
    async updateUnknownAssetsX() {
        let utxos = this.utxosX.getAllUTXOs();
        let assetIds = utxos.map((utxo) => {
            let idBuff = utxo.getAssetID();
            return common_1.bintools.cb58Encode(idBuff);
        });
        let uniqueIds = assetIds.filter((id, index) => {
            return assetIds.indexOf(id) === index;
        });
        let promises = uniqueIds.map((id) => (0, Assets_1.getAssetDescription)(id));
        await Promise.all(promises);
    }
    /**
     * Uses the X chain UTXOs owned by this wallet, gets asset description for unknown assets,
     * and returns a dictionary of Asset IDs to balance amounts.
     * - Updates `this.balanceX`
     * - Expensive operation if there are unknown assets
     * - Uses existing UTXOs
     * @private
     */
    async updateBalanceX() {
        if (!network_1.activeNetwork)
            throw errors_1.NO_NETWORK;
        let utxos = this.utxosX.getAllUTXOs();
        let unixNow = (0, utils_1.UnixNow)();
        let res = {};
        for (let i = 0; i < utxos.length; i++) {
            let utxo = utxos[i];
            let out = utxo.getOutput();
            let type = out.getOutputID();
            if (type != avm_1.AVMConstants.SECPXFEROUTPUTID)
                continue;
            let locktime = out.getLocktime();
            let threshold = out.getThreshold();
            let amount = out.getAmount();
            let assetIdBuff = utxo.getAssetID();
            let assetId = common_1.bintools.cb58Encode(assetIdBuff);
            let asset = res[assetId];
            if (!asset) {
                let assetInfo = await (0, Assets_1.getAssetDescription)(assetId);
                asset = {
                    locked: new avalanche_1.BN(0),
                    unlocked: new avalanche_1.BN(0),
                    multisig: new avalanche_1.BN(0),
                    meta: assetInfo,
                };
            }
            if (threshold > 1) {
                // Multisig
                asset.multisig = asset.multisig.add(amount);
            }
            else if (locktime.lte(unixNow)) {
                // not locked
                asset.unlocked = asset.unlocked.add(amount);
            }
            else {
                // locked
                asset.locked = asset.locked.add(amount);
            }
            res[assetId] = asset;
        }
        // If there are no AVAX UTXOs create a dummy empty balance object
        let avaxID = network_1.activeNetwork.avaxID;
        if (!res[avaxID]) {
            let assetInfo = await (0, Assets_1.getAssetDescription)(avaxID);
            res[avaxID] = {
                locked: new avalanche_1.BN(0),
                unlocked: new avalanche_1.BN(0),
                multisig: new avalanche_1.BN(0),
                meta: assetInfo,
            };
        }
        this.balanceX = res;
        // TODO: Check previous value
        this.emitBalanceChangeX();
        return res;
    }
    getBalanceX() {
        return this.balanceX;
    }
    /**
     * A helpful method that returns the AVAX balance on X, P, C chains.
     * Internally calls chain specific getAvaxBalance methods.
     */
    getAvaxBalance() {
        let X = this.getAvaxBalanceX();
        let P = this.getAvaxBalanceP();
        let C = this.getAvaxBalanceC();
        return {
            X,
            P,
            C,
        };
    }
    /**
     * Returns the X chain AVAX balance of the current wallet state.
     * - Does not make a network request.
     * - Does not refresh wallet balance.
     */
    getAvaxBalanceX() {
        if (!network_1.activeNetwork) {
            throw new Error('Network not selected.');
        }
        return (this.balanceX[network_1.activeNetwork.avaxID] || {
            unlocked: new avalanche_1.BN(0),
            locked: new avalanche_1.BN(0),
        });
    }
    getAvaxBalanceC() {
        return this.evmWallet.getBalance();
    }
    /**
     * Returns the P chain AVAX balance of the current wallet state.
     * - Does not make a network request.
     * - Does not refresh wallet balance.
     */
    getAvaxBalanceP() {
        let unlocked = new avalanche_1.BN(0);
        let locked = new avalanche_1.BN(0);
        let lockedStakeable = new avalanche_1.BN(0);
        let multisig = new avalanche_1.BN(0);
        let utxos = this.utxosP.getAllUTXOs();
        let unixNow = (0, utils_1.UnixNow)();
        for (let i = 0; i < utxos.length; i++) {
            let utxo = utxos[i];
            let out = utxo.getOutput();
            let type = out.getOutputID();
            let threshold = out.getThreshold();
            let amount = out.getAmount();
            // If threshold is > 1, its a multisig UTXO
            if (threshold > 1) {
                multisig.iadd(amount);
            }
            else if (type === platformvm_1.PlatformVMConstants.STAKEABLELOCKOUTID) {
                let locktime = out.getStakeableLocktime();
                if (locktime.lte(unixNow)) {
                    unlocked.iadd(amount);
                }
                else {
                    lockedStakeable = lockedStakeable.add(amount);
                }
            }
            else {
                let locktime = out.getLocktime();
                if (locktime.lte(unixNow)) {
                    unlocked.iadd(amount);
                }
                else {
                    locked.iadd(amount);
                }
            }
        }
        return {
            unlocked,
            locked,
            lockedStakeable: lockedStakeable,
            multisig,
        };
    }
    /**
     * Exports AVAX from P chain to X chain
     * @remarks
     * The export fee is added automatically to the amount. Make sure the exported amount includes the import fee for the destination chain.
     *
     * @param amt amount of nAVAX to transfer. Fees excluded.
     * @param destinationChain Either `X` or `C`
     * @return returns the transaction id.
     */
    async exportPChain(amt, destinationChain) {
        let pChangeAddr = this.getAddressP();
        let fromAddrs = await this.getAllAddressesP();
        const destinationAddr = destinationChain === 'X' ? this.getAddressX() : this.getEvmAddressBech();
        let utxoSet = this.utxosP;
        const exportTx = await (0, tx_helper_1.buildPlatformExportTransaction)(utxoSet, fromAddrs, destinationAddr, amt, pChangeAddr, destinationChain);
        let tx = await this.signP(exportTx);
        let txId = await network_1.pChain.issueTx(tx);
        await (0, utils_2.waitTxP)(txId);
        await this.updateUtxosP();
        return txId;
    }
    /***
     * Estimates the required fee for a C chain export transaction
     * @param destinationChain Either `X` or `P`
     * @param baseFee Current base fee of the network, use a padded amount.
     * @return BN C chain atomic export transaction fee in nAVAX.
     */
    estimateAtomicFeeExportC(destinationChain, baseFee) {
        let destinationAddr = destinationChain === 'X' ? this.getAddressX() : this.getAddressP();
        const hexAddr = this.getAddressC();
        // The amount does not effect the fee that much
        const amt = new avalanche_1.BN(0);
        const gas = (0, gas_helper_1.estimateExportGasFeeFromMockTx)(destinationChain, amt, hexAddr, destinationAddr);
        return (0, utils_2.avaxCtoX)(baseFee.mul(new avalanche_1.BN(gas)));
    }
    /**
     * Exports AVAX from C chain to X chain
     * @remarks
     * Make sure the exported `amt` includes the import fee for the destination chain.
     *
     * @param amt amount of nAVAX to transfer
     * @param destinationChain either `X` or `P`
     * @param exportFee Export fee in nAVAX
     * @return returns the transaction id.
     */
    async exportCChain(amt, destinationChain, exportFee) {
        let hexAddr = this.getAddressC();
        let bechAddr = this.getEvmAddressBech();
        let fromAddresses = [hexAddr];
        let destinationAddr = destinationChain === 'X' ? this.getAddressX() : this.getAddressP();
        // Calculate export fee if it's not given.
        if (!exportFee) {
            const gas = (0, gas_helper_1.estimateExportGasFeeFromMockTx)(destinationChain, amt, hexAddr, destinationAddr);
            const baseFee = await (0, gas_helper_1.getBaseFeeRecommended)();
            exportFee = (0, utils_2.avaxCtoX)(baseFee.mul(new avalanche_1.BN(gas)));
        }
        let exportTx = await (0, tx_helper_1.buildEvmExportTransaction)(fromAddresses, destinationAddr, amt, bechAddr, destinationChain, exportFee);
        let tx = await this.signC(exportTx);
        let txId = await network_1.cChain.issueTx(tx);
        await (0, utils_2.waitTxC)(txId);
        await this.updateAvaxBalanceC();
        return txId;
    }
    /**
     * Exports AVAX from X chain to either P or C chain
     * @remarks
     * The export fee will be added to the amount automatically. Make sure the exported amount has the import fee for the destination chain.
     *
     * @param amt amount of nAVAX to transfer
     * @param destinationChain Which chain to export to.
     * @return returns the transaction id.
     */
    async exportXChain(amt, destinationChain) {
        let destinationAddr = destinationChain === 'P' ? this.getAddressP() : this.getEvmAddressBech();
        let fromAddresses = await this.getAllAddressesX();
        let changeAddress = this.getChangeAddressX();
        let utxos = this.utxosX;
        let exportTx = await (0, tx_helper_1.buildAvmExportTransaction)(destinationChain, utxos, fromAddresses, destinationAddr, amt, changeAddress);
        let tx = await this.signX(exportTx);
        let txId = await network_1.xChain.issueTx(tx);
        await (0, utils_2.waitTxX)(txId);
        // Update UTXOs
        await this.updateUtxosX();
        return txId;
    }
    async getAtomicUTXOsX(sourceChain) {
        let addrs = await this.getAllAddressesX();
        let result = await (0, utxo_helper_1.avmGetAtomicUTXOs)(addrs, sourceChain);
        return result;
    }
    async getAtomicUTXOsP(sourceChain) {
        let addrs = await this.getAllAddressesP();
        return await (0, utxo_helper_1.platformGetAtomicUTXOs)(addrs, sourceChain);
    }
    async getAtomicUTXOsC(sourceChain) {
        const bechAddr = this.getEvmAddressBech();
        return await (0, utxo_helper_1.evmGetAtomicUTXOs)([bechAddr], sourceChain);
    }
    /**
     * Fetches X-Chain atomic utxos from all source networks and returns them as one set.
     */
    async getAllAtomicUTXOsX() {
        const utxos = await Promise.all([this.getAtomicUTXOsX('P'), this.getAtomicUTXOsX('C')]);
        return utxos[0].merge(utxos[1]);
    }
    /**
     * Fetches P-Chain atomic utxos from all source networks and returns them as one set.
     */
    async getAllAtomicUTXOsP() {
        const utxos = await Promise.all([this.getAtomicUTXOsP('X'), this.getAtomicUTXOsP('C')]);
        return utxos[0].merge(utxos[1]);
    }
    /**
     * Fetches C-Chain atomic utxos from all source networks and returns them as one set.
     */
    async getAllAtomicUTXOsC() {
        const utxos = await Promise.all([this.getAtomicUTXOsC('X'), this.getAtomicUTXOsC('P')]);
        return utxos[0].merge(utxos[1]);
    }
    /**
     * Imports atomic X chain UTXOs to the current active X chain address
     * @param sourceChain The chain to import from, either `P` or `C`
     */
    async importX(sourceChain) {
        const utxoSet = await this.getAtomicUTXOsX(sourceChain);
        if (utxoSet.getAllUTXOs().length === 0) {
            throw new Error('Nothing to import.');
        }
        let xToAddr = this.getAddressX();
        let hrp = network_1.avalanche.getHRP();
        let utxoAddrs = utxoSet.getAddresses().map((addr) => common_1.bintools.addressToString(hrp, 'X', addr));
        let fromAddrs = utxoAddrs;
        let ownerAddrs = utxoAddrs;
        const sourceChainId = (0, idFromAlias_1.chainIdFromAlias)(sourceChain);
        // Owner addresses, the addresses we exported to
        const unsignedTx = await network_1.xChain.buildImportTx(utxoSet, ownerAddrs, sourceChainId, [xToAddr], fromAddrs, [
            xToAddr,
        ]);
        const tx = await this.signX(unsignedTx);
        const txId = await network_1.xChain.issueTx(tx);
        await (0, utils_2.waitTxX)(txId);
        // Update UTXOs
        await this.updateUtxosX();
        return txId;
    }
    /**
     * Import utxos in atomic memory to the P chain.
     * @param sourceChain Either `X` or `C`
     * @param [toAddress] The destination P chain address assets will get imported to. Defaults to the P chain address of the wallet.
     */
    async importP(sourceChain, toAddress) {
        const utxoSet = await this.getAtomicUTXOsP(sourceChain);
        if (utxoSet.getAllUTXOs().length === 0) {
            throw new Error('Nothing to import.');
        }
        // Owner addresses, the addresses we exported to
        let walletAddrP = this.getAddressP();
        let hrp = network_1.avalanche.getHRP();
        let utxoAddrs = utxoSet.getAddresses().map((addr) => common_1.bintools.addressToString(hrp, 'P', addr));
        let ownerAddrs = utxoAddrs;
        if (!toAddress) {
            toAddress = walletAddrP;
        }
        const sourceChainId = (0, idFromAlias_1.chainIdFromAlias)(sourceChain);
        const unsignedTx = await network_1.pChain.buildImportTx(utxoSet, ownerAddrs, sourceChainId, [toAddress], ownerAddrs, [walletAddrP], undefined, undefined);
        const tx = await this.signP(unsignedTx);
        const txId = await network_1.pChain.issueTx(tx);
        await (0, utils_2.waitTxP)(txId);
        await this.updateUtxosP();
        return txId;
    }
    /**
     *
     * @param sourceChain Which chain to import from. `X` or `P`
     * @param [fee] The import fee to use in the transactions. If omitted the SDK will try to calculate the fee. For deterministic transactions you should always pre calculate and provide this value.
     * @param [utxoSet] If omitted imports all atomic UTXOs.
     */
    async importC(sourceChain, fee, utxoSet) {
        let bechAddr = this.getEvmAddressBech();
        if (!utxoSet) {
            utxoSet = await this.getAtomicUTXOsC(sourceChain);
        }
        const utxos = utxoSet.getAllUTXOs();
        if (utxos.length === 0) {
            throw new Error('Nothing to import.');
        }
        let toAddress = this.getAddressC();
        let ownerAddresses = [bechAddr];
        let fromAddresses = ownerAddresses;
        const sourceChainId = (0, idFromAlias_1.chainIdFromAlias)(sourceChain);
        // Calculate fee if not provided
        if (!fee) {
            // Calculate number of signatures
            const numSigs = utxos.reduce((acc, utxo) => {
                return acc + utxo.getOutput().getAddresses().length;
            }, 0);
            const numIns = utxos.length;
            const importGas = (0, gas_helper_1.estimateImportGasFeeFromMockTx)(numIns, numSigs);
            const baseFee = await (0, gas_helper_1.getBaseFeeRecommended)();
            fee = (0, utils_2.avaxCtoX)(baseFee.mul(new avalanche_1.BN(importGas)));
        }
        const unsignedTx = await network_1.cChain.buildImportTx(utxoSet, toAddress, ownerAddresses, sourceChainId, fromAddresses, fee);
        let tx = await this.signC(unsignedTx);
        let id = await network_1.cChain.issueTx(tx);
        await (0, utils_2.waitTxC)(id);
        await this.updateAvaxBalanceC();
        return id;
    }
    async createNftFamily(name, symbol, groupNum) {
        let fromAddresses = await this.getAllAddressesX();
        let changeAddress = this.getChangeAddressX();
        let minterAddress = this.getAddressX();
        let utxoSet = this.utxosX;
        let unsignedTx = await (0, tx_helper_1.buildCreateNftFamilyTx)(name, symbol, groupNum, fromAddresses, minterAddress, changeAddress, utxoSet);
        let signed = await this.signX(unsignedTx);
        const txId = await network_1.xChain.issueTx(signed);
        return await (0, utils_2.waitTxX)(txId);
    }
    async mintNft(mintUtxo, payload, quantity) {
        let ownerAddress = this.getAddressX();
        let changeAddress = this.getChangeAddressX();
        let sourceAddresses = await this.getAllAddressesX();
        let utxoSet = this.utxosX;
        let tx = await (0, tx_helper_1.buildMintNftTx)(mintUtxo, payload, quantity, ownerAddress, changeAddress, sourceAddresses, utxoSet);
        let signed = await this.signX(tx);
        const txId = await network_1.xChain.issueTx(signed);
        return await (0, utils_2.waitTxX)(txId);
    }
    /**
     * Adds a validator to the network using the given node id.
     *
     * @param nodeID The node id you are adding as a validator
     * @param amt Amount of AVAX to stake in nAVAX
     * @param start Validation period start date
     * @param end Validation period end date
     * @param delegationFee Minimum 2%
     * @param rewardAddress P chain address to send staking rewards
     * @param utxos
     *
     * @return Transaction id
     */
    async validate(nodeID, amt, start, end, delegationFee, rewardAddress, utxos) {
        let utxoSet = this.utxosP;
        // If given custom UTXO set use that
        if (utxos) {
            utxoSet = new platformvm_1.UTXOSet();
            utxoSet.addArray(utxos);
        }
        let pAddressStrings = await this.getAllAddressesP();
        let stakeAmount = amt;
        // If reward address isn't given use index 0 address
        if (!rewardAddress) {
            rewardAddress = this.getAddressP();
        }
        // For change address use first available on the platform chain
        let changeAddress = this.getAddressP();
        let stakeReturnAddr = this.getAddressP();
        // Convert dates to unix time
        let startTime = new avalanche_1.BN(Math.round(start.getTime() / 1000));
        let endTime = new avalanche_1.BN(Math.round(end.getTime() / 1000));
        const unsignedTx = await network_1.pChain.buildAddValidatorTx(utxoSet, [stakeReturnAddr], pAddressStrings, // from
        [changeAddress], // change
        nodeID, startTime, endTime, stakeAmount, [rewardAddress], delegationFee);
        let tx = await this.signP(unsignedTx);
        const txId = await network_1.pChain.issueTx(tx);
        await (0, utils_2.waitTxP)(txId);
        this.updateUtxosP();
        return txId;
    }
    async delegate(nodeID, amt, start, end, rewardAddress, utxos) {
        let utxoSet = this.utxosP;
        let pAddressStrings = await this.getAllAddressesP();
        let stakeAmount = amt;
        // If given custom UTXO set use that
        if (utxos) {
            utxoSet = new platformvm_1.UTXOSet();
            utxoSet.addArray(utxos);
        }
        // If reward address isn't given use current P address
        if (!rewardAddress) {
            rewardAddress = this.getAddressP();
        }
        let stakeReturnAddr = this.getAddressP();
        // For change address use the current platform chain
        let changeAddress = this.getAddressP();
        // Convert dates to unix time
        let startTime = new avalanche_1.BN(Math.round(start.getTime() / 1000));
        let endTime = new avalanche_1.BN(Math.round(end.getTime() / 1000));
        const unsignedTx = await network_1.pChain.buildAddDelegatorTx(utxoSet, [stakeReturnAddr], pAddressStrings, [changeAddress], nodeID, startTime, endTime, stakeAmount, [rewardAddress] // reward address
        );
        const tx = await this.signP(unsignedTx);
        const txId = await network_1.pChain.issueTx(tx);
        await (0, utils_2.waitTxP)(txId);
        this.updateUtxosP();
        return txId;
    }
    /**
     * Issues the given transaction.
     * @param tx A universal transaction json object.
     */
    async issueUniversalTx(tx) {
        switch (tx.action) {
            case 'export_x_c':
                return await this.exportXChain(tx.amount, 'C');
            case 'import_x_c':
                return await this.importC('X', tx.fee);
            case 'export_x_p':
                return await this.exportXChain(tx.amount, 'P');
            case 'import_x_p':
                return await this.importP('X');
            case 'export_c_x':
                return await this.exportCChain(tx.amount, 'X', tx.fee);
            case 'import_c_x':
                return await this.importX('C');
            case 'export_c_p':
                return await this.exportCChain(tx.amount, 'P', tx.fee);
            case 'import_c_p':
                return await this.importP('C');
            case 'export_p_x':
                return await this.exportPChain(tx.amount, 'X');
            case 'import_p_x':
                return await this.importX('P');
            case 'export_p_c':
                return await this.exportPChain(tx.amount, 'C');
            case 'import_p_c':
                return await this.importC('P', tx.fee);
            default:
                throw new Error('Method not supported.');
        }
    }
    async getHistoryX(limit = 0) {
        let addrs = await this.getAllAddressesX();
        return await (0, Explorer_1.getAddressHistory)(addrs, limit, network_1.xChain.getBlockchainID());
    }
    async getHistoryP(limit = 0) {
        let addrs = await this.getAllAddressesP();
        return await (0, Explorer_1.getAddressHistory)(addrs, limit, network_1.pChain.getBlockchainID());
    }
    /**
     * Returns atomic history for this wallet on the C chain.
     * @remarks Excludes EVM transactions.
     * @param limit
     */
    async getHistoryC(limit = 0) {
        let addrs = [this.getEvmAddressBech(), ...(await this.getAllAddressesX())];
        return await (0, Explorer_1.getAddressHistory)(addrs, limit, network_1.cChain.getBlockchainID());
    }
    /**
     * Returns history for this wallet on the C chain.
     * @remarks Excludes atomic C chain import/export transactions.
     */
    async getHistoryEVM() {
        let addr = this.getAddressC();
        return await (0, Explorer_1.getAddressHistoryEVM)(addr);
    }
    /**
     * Returns the erc 20 activity for this wallet's C chain address. Uses Snowtrace APIs.
     * @param offset Number of items per page. Optional.
     * @param page If provided will paginate the results. Optional.
     * @param contractAddress Filter activity by the ERC20 contract address. Optional.
     */
    async getHistoryERC20(page, offset, contractAddress) {
        const erc20Hist = await (0, snowtrace_1.getErc20History)(this.getAddressC(), network_1.activeNetwork, page, offset, contractAddress);
        return erc20Hist;
    }
    /**
     * Get a list of 'Normal' Transactions for wallet's C chain address. Uses Snowtrace APIs.
     * @param offset Number of items per page. Optional.
     * @param page If provided will paginate the results. Optional.
     */
    async getHistoryNormalTx(page, offset) {
        const normalHist = await (0, snowtrace_1.getNormalHistory)(this.getAddressC(), network_1.activeNetwork, page, offset);
        return normalHist;
    }
    async getHistory(limit = 0) {
        return (0, getHistoryForOwnedAddresses_1.getHistoryForOwnedAddresses)(await this.getAllAddressesX(), await this.getAllAddressesP(), this.getEvmAddressBech(), this.getAddressC(), limit);
    }
    /**
     * Return sorted history from Ortelius.
     * @param limit
     */
    async getHistoryRaw(limit = 0) {
        return (0, History_1.getHistoryForOwnedAddressesRaw)(await this.getAllAddressesX(), await this.getAllAddressesP(), this.getEvmAddressBech(), limit);
    }
    /**
     * Fetches information about the given txId and parses it from the wallet's perspective
     * @param txId
     */
    async getHistoryTx(txId) {
        let addrs = await this.getAllAddressesX();
        let addrC = this.getAddressC();
        let rawData = await (0, Explorer_1.getTx)(txId);
        return await (0, History_1.getTransactionSummary)(rawData, addrs, addrC);
    }
    /**
     * Fetches information about the given txId and parses it from the wallet's perspective
     * @param txHash
     */
    async getHistoryTxEvm(txHash) {
        let addrC = this.getAddressC();
        let rawData = await (0, Explorer_1.getTxEvm)(txHash);
        return (0, History_1.getTransactionSummaryEVM)(rawData, addrC);
    }
    async parseOrteliusTx(tx) {
        let addrsX = await this.getAllAddressesX();
        let addrBechC = this.getEvmAddressBech();
        let addrs = [...addrsX, addrBechC];
        let addrC = this.getAddressC();
        return await (0, History_1.getTransactionSummary)(tx, addrs, addrC);
    }
}
exports.WalletProvider = WalletProvider;
//# sourceMappingURL=Wallet.js.map