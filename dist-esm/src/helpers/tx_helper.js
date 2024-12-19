import { cChain, ethersProvider, pChain, web3, xChain } from '@/Network/network';
import { AVMConstants, MinterSet, } from 'avalanche/dist/apis/avm';
import { OutputOwners } from 'avalanche/dist/common';
import { PlatformVMConstants } from 'avalanche/dist/apis/platformvm';
import { EVMConstants } from 'avalanche/dist/apis/evm';
import { FeeMarketEIP1559Transaction, TransactionFactory } from '@ethereumjs/tx';
import { Common as EthereumjsCommon } from '@ethereumjs/common';
import ERC20Abi from '../Asset/ERC20.json';
import ERC721Abi from '../Asset/ERC721/ERC721.json';
import { bintools } from '@/common';
import { chainIdFromAlias } from '@/Network/helpers/idFromAlias';
import { getErc721TokenEthers } from '@/Asset';
export async function buildCreateNftFamilyTx(name, symbol, groupNum, fromAddrs, minterAddr, changeAddr, utxoSet) {
    let fromAddresses = fromAddrs;
    let changeAddress = changeAddr;
    let minterAddress = minterAddr;
    const minterSets = [];
    // Create the groups
    for (let i = 0; i < groupNum; i++) {
        const minterSet = new MinterSet(1, [minterAddress]);
        minterSets.push(minterSet);
    }
    let unsignedTx = await xChain.buildCreateNFTAssetTx(utxoSet, fromAddresses, [changeAddress], minterSets, name, symbol);
    return unsignedTx;
}
export async function buildMintNftTx(mintUtxo, payload, quantity, ownerAddress, changeAddress, fromAddresses, utxoSet) {
    let addrBuf = bintools.parseAddress(ownerAddress, 'X');
    let owners = [];
    let sourceAddresses = fromAddresses;
    for (let i = 0; i < quantity; i++) {
        let owner = new OutputOwners([addrBuf]);
        owners.push(owner);
    }
    let groupID = mintUtxo.getOutput().getGroupID();
    let mintTx = await xChain.buildCreateNFTMintTx(utxoSet, owners, sourceAddresses, [changeAddress], mintUtxo.getUTXOID(), groupID, payload);
    return mintTx;
}
export async function buildAvmExportTransaction(destinationChain, utxoSet, fromAddresses, toAddress, amount, // export amount + fee
sourceChangeAddress) {
    let destinationChainId = chainIdFromAlias(destinationChain);
    return await xChain.buildExportTx(utxoSet, amount, destinationChainId, [toAddress], fromAddresses, [
        sourceChangeAddress,
    ]);
}
export async function buildPlatformExportTransaction(utxoSet, fromAddresses, toAddress, amount, // export amount + fee
sourceChangeAddress, destinationChain) {
    let destinationChainId = chainIdFromAlias(destinationChain);
    return await pChain.buildExportTx(utxoSet, amount, destinationChainId, [toAddress], fromAddresses, [
        sourceChangeAddress,
    ]);
}
/**
 *
 * @param fromAddresses
 * @param toAddress
 * @param amount
 * @param fromAddressBech
 * @param destinationChain Either `X` or `P`
 * @param fee Export fee in nAVAX
 */
export async function buildEvmExportTransaction(fromAddresses, toAddress, amount, // export amount + fee
fromAddressBech, destinationChain, fee) {
    let destinationChainId = chainIdFromAlias(destinationChain);
    const nonce = await web3.eth.getTransactionCount(fromAddresses[0]);
    const avaxAssetIDBuf = await xChain.getAVAXAssetID();
    const avaxAssetIDStr = bintools.cb58Encode(avaxAssetIDBuf);
    let fromAddressHex = fromAddresses[0];
    return await cChain.buildExportTx(amount, avaxAssetIDStr, destinationChainId, fromAddressHex, fromAddressBech, [toAddress], Number(nonce.toString()), undefined, undefined, fee);
}
export async function buildEvmTransferEIP1559Tx(from, to, amount, // in wei
priorityFee, maxFee, gasLimit) {
    const nonce = await web3.eth.getTransactionCount(from);
    const chainId = await web3.eth.getChainId();
    const networkId = await web3.eth.net.getId();
    const common = EthereumjsCommon.custom({ networkId, chainId });
    const tx = FeeMarketEIP1559Transaction.fromTxData({
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
export async function buildEvmTransferNativeTx(from, to, amount, // in wei
gasPrice, gasLimit) {
    const nonce = await web3.eth.getTransactionCount(from);
    const chainId = await web3.eth.getChainId();
    const networkId = await web3.eth.net.getId();
    const common = EthereumjsCommon.custom({ networkId, chainId });
    const tx = TransactionFactory.fromTxData({
        nonce: nonce,
        gasPrice: `0x${gasPrice.toString('hex')}`,
        gasLimit: gasLimit,
        to: `0x${to.replace('0x', '')}`,
        value: `0x${amount.toString('hex')}`,
        data: '0x',
    }, { common });
    return tx;
}
export async function buildCustomEvmTx(from, gasPrice, gasLimit, data, to, value, nonce) {
    if (typeof nonce === 'undefined') {
        const _nonce = await web3.eth.getTransactionCount(from);
        nonce = Number(_nonce.toString());
    }
    const chainId = await web3.eth.getChainId();
    const networkId = await web3.eth.net.getId();
    const chainParams = {
        common: EthereumjsCommon.custom({
            name: 'mainnet',
            networkId,
            chainId,
            defaultHardfork: 'istanbul',
        }),
    };
    let tx = TransactionFactory.fromTxData({
        nonce,
        gasPrice: `0x${gasPrice.toString('hex')}`,
        gasLimit,
        value: `0x${value?.replace('0x', '') || ''}`,
        to: !!to ? `0x${to?.replace('0x', '')}` : undefined,
        data: !!data ? `0x${data.replace('0x', '')}` : undefined,
    }, chainParams);
    return tx;
}
export async function buildEvmTransferErc20Tx(from, to, amount, // in wei
gasPrice, gasLimit, contractAddress) {
    //@ts-ignore
    const cont = new web3.eth.Contract(ERC20Abi.abi, contractAddress);
    const tokenTx = cont.methods.transfer(to, amount.toString());
    let data = tokenTx.encodeABI();
    let tx = await buildCustomEvmTx(from, gasPrice, gasLimit, data, contractAddress);
    return tx;
}
export async function buildEvmTransferErc721Tx(from, to, gasPrice, gasLimit, tokenContract, tokenId) {
    const nonce = await web3.eth.getTransactionCount(from);
    const chainId = await web3.eth.getChainId();
    const networkId = await web3.eth.net.getId();
    const chainParams = {
        common: EthereumjsCommon.custom({
            name: 'mainnet',
            networkId,
            chainId,
            defaultHardfork: 'istanbul',
        }),
    };
    // @ts-ignore
    const contract = new web3.eth.Contract(ERC721Abi.abi, tokenContract);
    const tokenTx = contract.methods['safeTransferFrom(address,address,uint256)'](from, to, tokenId);
    let tx = TransactionFactory.fromTxData({
        nonce: nonce,
        gasPrice: `0x${gasPrice.toString('hex')}`,
        gasLimit: gasLimit,
        value: '0x0',
        to: `0x${tokenContract.replace('0x', '')}`,
        data: `0x${tokenTx.encodeABI().replace('0x', '')}`,
    }, chainParams);
    return tx;
}
export async function estimateErc20Gas(tokenContract, from, to, value) {
    //@ts-ignore
    const contract = new web3.eth.Contract(ERC20Abi.abi, tokenContract);
    const tokenTx = contract.methods.transfer(to, value.toString());
    return await tokenTx.estimateGas({
        from: from,
    });
}
/**
 * Estimate the gas limit for the ERC721 `safeTransferFrom(address,address,uint256)` method.
 * @param contract
 * @param from
 * @param to
 * @param tokenID
 */
export async function estimateErc721TransferGas(contract, from, to, tokenID) {
    let c = getErc721TokenEthers(contract);
    c = c.connect(ethersProvider);
    const gas = await c.estimateGas['safeTransferFrom(address,address,uint256)'](from, to, tokenID);
    return gas.toNumber();
}
/**
 * Estimates the gas needed to send AVAX
 * @param to Destination address
 * @param amount Amount of AVAX to send, given in WEI
 * @param gasPrice Given in WEI
 */
export async function estimateAvaxGas(from, to, amount, gasPrice) {
    try {
        const gas = await web3.eth.estimateGas({
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
export var AvmTxNameEnum;
(function (AvmTxNameEnum) {
    AvmTxNameEnum[AvmTxNameEnum["Transaction"] = AVMConstants.BASETX] = "Transaction";
    AvmTxNameEnum[AvmTxNameEnum["Mint"] = AVMConstants.CREATEASSETTX] = "Mint";
    AvmTxNameEnum[AvmTxNameEnum["Operation"] = AVMConstants.OPERATIONTX] = "Operation";
    AvmTxNameEnum[AvmTxNameEnum["Import"] = AVMConstants.IMPORTTX] = "Import";
    AvmTxNameEnum[AvmTxNameEnum["Export"] = AVMConstants.EXPORTTX] = "Export";
})(AvmTxNameEnum || (AvmTxNameEnum = {}));
export var PlatfromTxNameEnum;
(function (PlatfromTxNameEnum) {
    PlatfromTxNameEnum[PlatfromTxNameEnum["Transaction"] = PlatformVMConstants.BASETX] = "Transaction";
    PlatfromTxNameEnum[PlatfromTxNameEnum["Add Validator"] = PlatformVMConstants.ADDVALIDATORTX] = "Add Validator";
    PlatfromTxNameEnum[PlatfromTxNameEnum["Add Delegator"] = PlatformVMConstants.ADDDELEGATORTX] = "Add Delegator";
    PlatfromTxNameEnum[PlatfromTxNameEnum["Import"] = PlatformVMConstants.IMPORTTX] = "Import";
    PlatfromTxNameEnum[PlatfromTxNameEnum["Export"] = PlatformVMConstants.EXPORTTX] = "Export";
    PlatfromTxNameEnum[PlatfromTxNameEnum["Add Subnet Validator"] = PlatformVMConstants.ADDSUBNETVALIDATORTX] = "Add Subnet Validator";
    PlatfromTxNameEnum[PlatfromTxNameEnum["Create Chain"] = PlatformVMConstants.CREATECHAINTX] = "Create Chain";
    PlatfromTxNameEnum[PlatfromTxNameEnum["Create Subnet"] = PlatformVMConstants.CREATESUBNETTX] = "Create Subnet";
    PlatfromTxNameEnum[PlatfromTxNameEnum["Advance Time"] = PlatformVMConstants.ADVANCETIMETX] = "Advance Time";
    PlatfromTxNameEnum[PlatfromTxNameEnum["Reward Validator"] = PlatformVMConstants.REWARDVALIDATORTX] = "Reward Validator";
})(PlatfromTxNameEnum || (PlatfromTxNameEnum = {}));
// TODO: create asset transactions
export var ParseableAvmTxEnum;
(function (ParseableAvmTxEnum) {
    ParseableAvmTxEnum[ParseableAvmTxEnum["Transaction"] = AVMConstants.BASETX] = "Transaction";
    ParseableAvmTxEnum[ParseableAvmTxEnum["Import"] = AVMConstants.IMPORTTX] = "Import";
    ParseableAvmTxEnum[ParseableAvmTxEnum["Export"] = AVMConstants.EXPORTTX] = "Export";
})(ParseableAvmTxEnum || (ParseableAvmTxEnum = {}));
export var ParseablePlatformEnum;
(function (ParseablePlatformEnum) {
    ParseablePlatformEnum[ParseablePlatformEnum["Transaction"] = PlatformVMConstants.BASETX] = "Transaction";
    ParseablePlatformEnum[ParseablePlatformEnum["Add Validator"] = PlatformVMConstants.ADDVALIDATORTX] = "Add Validator";
    ParseablePlatformEnum[ParseablePlatformEnum["Add Delegator"] = PlatformVMConstants.ADDDELEGATORTX] = "Add Delegator";
    ParseablePlatformEnum[ParseablePlatformEnum["Import"] = PlatformVMConstants.IMPORTTX] = "Import";
    ParseablePlatformEnum[ParseablePlatformEnum["Export"] = PlatformVMConstants.EXPORTTX] = "Export";
})(ParseablePlatformEnum || (ParseablePlatformEnum = {}));
export var ParseableEvmTxEnum;
(function (ParseableEvmTxEnum) {
    ParseableEvmTxEnum[ParseableEvmTxEnum["Import"] = EVMConstants.IMPORTTX] = "Import";
    ParseableEvmTxEnum[ParseableEvmTxEnum["Export"] = EVMConstants.EXPORTTX] = "Export";
})(ParseableEvmTxEnum || (ParseableEvmTxEnum = {}));
//# sourceMappingURL=tx_helper.js.map