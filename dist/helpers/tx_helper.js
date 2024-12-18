"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseableEvmTxEnum = exports.ParseablePlatformEnum = exports.ParseableAvmTxEnum = exports.PlatfromTxNameEnum = exports.AvmTxNameEnum = exports.estimateAvaxGas = exports.estimateErc721TransferGas = exports.estimateErc20Gas = exports.buildEvmTransferErc721Tx = exports.buildEvmTransferErc20Tx = exports.buildCustomEvmTx = exports.buildEvmTransferNativeTx = exports.buildEvmTransferEIP1559Tx = exports.buildEvmExportTransaction = exports.buildPlatformExportTransaction = exports.buildAvmExportTransaction = exports.buildMintNftTx = exports.buildCreateNftFamilyTx = void 0;
const tslib_1 = require("tslib");
const network_1 = require("../Network/network");
const avm_1 = require("avalanche/dist/apis/avm");
const common_1 = require("avalanche/dist/common");
const platformvm_1 = require("avalanche/dist/apis/platformvm");
const evm_1 = require("avalanche/dist/apis/evm");
const tx_1 = require("@ethereumjs/tx");
const common_2 = require("@ethereumjs/common");
const ERC20_json_1 = tslib_1.__importDefault(require("../Asset/ERC20.json"));
const ERC721_json_1 = tslib_1.__importDefault(require("../Asset/ERC721/ERC721.json"));
const common_3 = require("../common");
const idFromAlias_1 = require("../Network/helpers/idFromAlias");
const Asset_1 = require("../Asset");
async function buildCreateNftFamilyTx(name, symbol, groupNum, fromAddrs, minterAddr, changeAddr, utxoSet) {
    let fromAddresses = fromAddrs;
    let changeAddress = changeAddr;
    let minterAddress = minterAddr;
    const minterSets = [];
    // Create the groups
    for (let i = 0; i < groupNum; i++) {
        const minterSet = new avm_1.MinterSet(1, [minterAddress]);
        minterSets.push(minterSet);
    }
    let unsignedTx = await network_1.xChain.buildCreateNFTAssetTx(utxoSet, fromAddresses, [changeAddress], minterSets, name, symbol);
    return unsignedTx;
}
exports.buildCreateNftFamilyTx = buildCreateNftFamilyTx;
async function buildMintNftTx(mintUtxo, payload, quantity, ownerAddress, changeAddress, fromAddresses, utxoSet) {
    let addrBuf = common_3.bintools.parseAddress(ownerAddress, 'X');
    let owners = [];
    let sourceAddresses = fromAddresses;
    for (let i = 0; i < quantity; i++) {
        let owner = new common_1.OutputOwners([addrBuf]);
        owners.push(owner);
    }
    let groupID = mintUtxo.getOutput().getGroupID();
    let mintTx = await network_1.xChain.buildCreateNFTMintTx(utxoSet, owners, sourceAddresses, [changeAddress], mintUtxo.getUTXOID(), groupID, payload);
    return mintTx;
}
exports.buildMintNftTx = buildMintNftTx;
async function buildAvmExportTransaction(destinationChain, utxoSet, fromAddresses, toAddress, amount, // export amount + fee
sourceChangeAddress) {
    let destinationChainId = (0, idFromAlias_1.chainIdFromAlias)(destinationChain);
    return await network_1.xChain.buildExportTx(utxoSet, amount, destinationChainId, [toAddress], fromAddresses, [
        sourceChangeAddress,
    ]);
}
exports.buildAvmExportTransaction = buildAvmExportTransaction;
async function buildPlatformExportTransaction(utxoSet, fromAddresses, toAddress, amount, // export amount + fee
sourceChangeAddress, destinationChain) {
    let destinationChainId = (0, idFromAlias_1.chainIdFromAlias)(destinationChain);
    return await network_1.pChain.buildExportTx(utxoSet, amount, destinationChainId, [toAddress], fromAddresses, [
        sourceChangeAddress,
    ]);
}
exports.buildPlatformExportTransaction = buildPlatformExportTransaction;
/**
 *
 * @param fromAddresses
 * @param toAddress
 * @param amount
 * @param fromAddressBech
 * @param destinationChain Either `X` or `P`
 * @param fee Export fee in nAVAX
 */
async function buildEvmExportTransaction(fromAddresses, toAddress, amount, // export amount + fee
fromAddressBech, destinationChain, fee) {
    let destinationChainId = (0, idFromAlias_1.chainIdFromAlias)(destinationChain);
    const nonce = await network_1.web3.eth.getTransactionCount(fromAddresses[0]);
    const avaxAssetIDBuf = await network_1.xChain.getAVAXAssetID();
    const avaxAssetIDStr = common_3.bintools.cb58Encode(avaxAssetIDBuf);
    let fromAddressHex = fromAddresses[0];
    return await network_1.cChain.buildExportTx(amount, avaxAssetIDStr, destinationChainId, fromAddressHex, fromAddressBech, [toAddress], Number(nonce.toString()), undefined, undefined, fee);
}
exports.buildEvmExportTransaction = buildEvmExportTransaction;
async function buildEvmTransferEIP1559Tx(from, to, amount, // in wei
priorityFee, maxFee, gasLimit) {
    const nonce = await network_1.web3.eth.getTransactionCount(from);
    const chainId = await network_1.web3.eth.getChainId();
    const networkId = await network_1.web3.eth.net.getId();
    const common = common_2.Common.custom({ networkId, chainId });
    const tx = tx_1.FeeMarketEIP1559Transaction.fromTxData({
        nonce: nonce,
        maxFeePerGas: `0x${maxFee.toString('hex')}`,
        maxPriorityFeePerGas: `0x${priorityFee.toString('hex')}`,
        gasLimit: gasLimit,
        to: `0x${to.replace('0x', '')}`,
        value: `0x${amount.toString('hex')}`,
        data: '0x',
    }, { common });
    return tx;
}
exports.buildEvmTransferEIP1559Tx = buildEvmTransferEIP1559Tx;
async function buildEvmTransferNativeTx(from, to, amount, // in wei
gasPrice, gasLimit) {
    const nonce = await network_1.web3.eth.getTransactionCount(from);
    const chainId = await network_1.web3.eth.getChainId();
    const networkId = await network_1.web3.eth.net.getId();
    const common = common_2.Common.custom({ networkId, chainId });
    const tx = tx_1.TransactionFactory.fromTxData({
        nonce: nonce,
        gasPrice: `0x${gasPrice.toString('hex')}`,
        gasLimit: gasLimit,
        to: `0x${to.replace('0x', '')}`,
        value: `0x${amount.toString('hex')}`,
        data: '0x',
    }, { common });
    return tx;
}
exports.buildEvmTransferNativeTx = buildEvmTransferNativeTx;
async function buildCustomEvmTx(from, gasPrice, gasLimit, data, to, value, nonce) {
    if (typeof nonce === 'undefined') {
        const _nonce = await network_1.web3.eth.getTransactionCount(from);
        nonce = Number(_nonce.toString());
    }
    const chainId = await network_1.web3.eth.getChainId();
    const networkId = await network_1.web3.eth.net.getId();
    const chainParams = {
        common: common_2.Common.custom({
            name: 'mainnet',
            networkId,
            chainId,
            defaultHardfork: 'istanbul',
        }),
    };
    let tx = tx_1.TransactionFactory.fromTxData({
        nonce,
        gasPrice: `0x${gasPrice.toString('hex')}`,
        gasLimit,
        value: `0x${value?.replace('0x', '') || ''}`,
        to: to ? `0x${to?.replace('0x', '')}` : undefined,
        data: data ? `0x${data.replace('0x', '')}` : undefined,
    }, chainParams);
    return tx;
}
exports.buildCustomEvmTx = buildCustomEvmTx;
async function buildEvmTransferErc20Tx(from, to, amount, // in wei
gasPrice, gasLimit, contractAddress) {
    //@ts-ignore
    const cont = new network_1.web3.eth.Contract(ERC20_json_1.default.abi, contractAddress);
    const tokenTx = cont.methods.transfer(to, amount.toString());
    let data = tokenTx.encodeABI();
    let tx = await buildCustomEvmTx(from, gasPrice, gasLimit, data, contractAddress);
    return tx;
}
exports.buildEvmTransferErc20Tx = buildEvmTransferErc20Tx;
async function buildEvmTransferErc721Tx(from, to, gasPrice, gasLimit, tokenContract, tokenId) {
    const nonce = await network_1.web3.eth.getTransactionCount(from);
    const chainId = await network_1.web3.eth.getChainId();
    const networkId = await network_1.web3.eth.net.getId();
    const chainParams = {
        common: common_2.Common.custom({
            name: 'mainnet',
            networkId,
            chainId,
            defaultHardfork: 'istanbul',
        }),
    };
    // @ts-ignore
    const contract = new network_1.web3.eth.Contract(ERC721_json_1.default.abi, tokenContract);
    const tokenTx = contract.methods['safeTransferFrom(address,address,uint256)'](from, to, tokenId);
    let tx = tx_1.TransactionFactory.fromTxData({
        nonce: nonce,
        gasPrice: `0x${gasPrice.toString('hex')}`,
        gasLimit: gasLimit,
        value: '0x0',
        to: `0x${tokenContract.replace('0x', '')}`,
        data: `0x${tokenTx.encodeABI().replace('0x', '')}`,
    }, chainParams);
    return tx;
}
exports.buildEvmTransferErc721Tx = buildEvmTransferErc721Tx;
async function estimateErc20Gas(tokenContract, from, to, value) {
    //@ts-ignore
    const contract = new network_1.web3.eth.Contract(ERC20_json_1.default.abi, tokenContract);
    const tokenTx = contract.methods.transfer(to, value.toString());
    return await tokenTx.estimateGas({
        from: from,
    });
}
exports.estimateErc20Gas = estimateErc20Gas;
/**
 * Estimate the gas limit for the ERC721 `safeTransferFrom(address,address,uint256)` method.
 * @param contract
 * @param from
 * @param to
 * @param tokenID
 */
async function estimateErc721TransferGas(contract, from, to, tokenID) {
    let c = (0, Asset_1.getErc721TokenEthers)(contract);
    c = c.connect(network_1.ethersProvider);
    const gas = await c.estimateGas['safeTransferFrom(address,address,uint256)'](from, to, tokenID);
    return gas.toNumber();
}
exports.estimateErc721TransferGas = estimateErc721TransferGas;
/**
 * Estimates the gas needed to send AVAX
 * @param to Destination address
 * @param amount Amount of AVAX to send, given in WEI
 * @param gasPrice Given in WEI
 */
async function estimateAvaxGas(from, to, amount, gasPrice) {
    try {
        const gas = await network_1.web3.eth.estimateGas({
            from,
            to,
            gasPrice: `0x${gasPrice.toString('hex')}`,
            value: `0x${amount.toString('hex')}`,
        });
        return Number(gas.toString());
    }
    catch (e) {
        // TODO: Throws an error if we do not have enough avax balance
        //TODO: Is it ok to return 21000
        return 21000;
    }
}
exports.estimateAvaxGas = estimateAvaxGas;
var AvmTxNameEnum;
(function (AvmTxNameEnum) {
    AvmTxNameEnum[AvmTxNameEnum["Transaction"] = avm_1.AVMConstants.BASETX] = "Transaction";
    AvmTxNameEnum[AvmTxNameEnum["Mint"] = avm_1.AVMConstants.CREATEASSETTX] = "Mint";
    AvmTxNameEnum[AvmTxNameEnum["Operation"] = avm_1.AVMConstants.OPERATIONTX] = "Operation";
    AvmTxNameEnum[AvmTxNameEnum["Import"] = avm_1.AVMConstants.IMPORTTX] = "Import";
    AvmTxNameEnum[AvmTxNameEnum["Export"] = avm_1.AVMConstants.EXPORTTX] = "Export";
})(AvmTxNameEnum = exports.AvmTxNameEnum || (exports.AvmTxNameEnum = {}));
var PlatfromTxNameEnum;
(function (PlatfromTxNameEnum) {
    PlatfromTxNameEnum[PlatfromTxNameEnum["Transaction"] = platformvm_1.PlatformVMConstants.BASETX] = "Transaction";
    PlatfromTxNameEnum[PlatfromTxNameEnum["Add Validator"] = platformvm_1.PlatformVMConstants.ADDVALIDATORTX] = "Add Validator";
    PlatfromTxNameEnum[PlatfromTxNameEnum["Add Delegator"] = platformvm_1.PlatformVMConstants.ADDDELEGATORTX] = "Add Delegator";
    PlatfromTxNameEnum[PlatfromTxNameEnum["Import"] = platformvm_1.PlatformVMConstants.IMPORTTX] = "Import";
    PlatfromTxNameEnum[PlatfromTxNameEnum["Export"] = platformvm_1.PlatformVMConstants.EXPORTTX] = "Export";
    PlatfromTxNameEnum[PlatfromTxNameEnum["Add Subnet Validator"] = platformvm_1.PlatformVMConstants.ADDSUBNETVALIDATORTX] = "Add Subnet Validator";
    PlatfromTxNameEnum[PlatfromTxNameEnum["Create Chain"] = platformvm_1.PlatformVMConstants.CREATECHAINTX] = "Create Chain";
    PlatfromTxNameEnum[PlatfromTxNameEnum["Create Subnet"] = platformvm_1.PlatformVMConstants.CREATESUBNETTX] = "Create Subnet";
    PlatfromTxNameEnum[PlatfromTxNameEnum["Advance Time"] = platformvm_1.PlatformVMConstants.ADVANCETIMETX] = "Advance Time";
    PlatfromTxNameEnum[PlatfromTxNameEnum["Reward Validator"] = platformvm_1.PlatformVMConstants.REWARDVALIDATORTX] = "Reward Validator";
})(PlatfromTxNameEnum = exports.PlatfromTxNameEnum || (exports.PlatfromTxNameEnum = {}));
// TODO: create asset transactions
var ParseableAvmTxEnum;
(function (ParseableAvmTxEnum) {
    ParseableAvmTxEnum[ParseableAvmTxEnum["Transaction"] = avm_1.AVMConstants.BASETX] = "Transaction";
    ParseableAvmTxEnum[ParseableAvmTxEnum["Import"] = avm_1.AVMConstants.IMPORTTX] = "Import";
    ParseableAvmTxEnum[ParseableAvmTxEnum["Export"] = avm_1.AVMConstants.EXPORTTX] = "Export";
})(ParseableAvmTxEnum = exports.ParseableAvmTxEnum || (exports.ParseableAvmTxEnum = {}));
var ParseablePlatformEnum;
(function (ParseablePlatformEnum) {
    ParseablePlatformEnum[ParseablePlatformEnum["Transaction"] = platformvm_1.PlatformVMConstants.BASETX] = "Transaction";
    ParseablePlatformEnum[ParseablePlatformEnum["Add Validator"] = platformvm_1.PlatformVMConstants.ADDVALIDATORTX] = "Add Validator";
    ParseablePlatformEnum[ParseablePlatformEnum["Add Delegator"] = platformvm_1.PlatformVMConstants.ADDDELEGATORTX] = "Add Delegator";
    ParseablePlatformEnum[ParseablePlatformEnum["Import"] = platformvm_1.PlatformVMConstants.IMPORTTX] = "Import";
    ParseablePlatformEnum[ParseablePlatformEnum["Export"] = platformvm_1.PlatformVMConstants.EXPORTTX] = "Export";
})(ParseablePlatformEnum = exports.ParseablePlatformEnum || (exports.ParseablePlatformEnum = {}));
var ParseableEvmTxEnum;
(function (ParseableEvmTxEnum) {
    ParseableEvmTxEnum[ParseableEvmTxEnum["Import"] = evm_1.EVMConstants.IMPORTTX] = "Import";
    ParseableEvmTxEnum[ParseableEvmTxEnum["Export"] = evm_1.EVMConstants.EXPORTTX] = "Export";
})(ParseableEvmTxEnum = exports.ParseableEvmTxEnum || (exports.ParseableEvmTxEnum = {}));
//# sourceMappingURL=tx_helper.js.map