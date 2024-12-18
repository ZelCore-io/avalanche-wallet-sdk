"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.estimateExportGasFee = exports.estimateExportGasFeeFromMockTx = exports.estimateImportGasFeeFromMockTx = exports.calculateMaxFee = exports.getMaxPriorityFee = exports.getBaseFeeRecommended = exports.getBaseFee = exports.adjustValue = exports.getAdjustedGasPrice = exports.getGasPrice = void 0;
const network_1 = require("@/Network/network");
const avalanche_1 = require("avalanche");
const evm_1 = require("avalanche/dist/apis/evm");
const common_1 = require("@/common");
const Network_1 = require("@/Network");
const utils_1 = require("avalanche/dist/utils");
const tx_helper_1 = require("@/helpers/tx_helper");
const MAX_GAS = new avalanche_1.BN(1000_000_000_000);
/**
 * Returns the current gas price in WEI from the network
 */
async function getGasPrice() {
    const gas = await network_1.web3.eth.getGasPrice();
    return new avalanche_1.BN(gas.toString());
}
exports.getGasPrice = getGasPrice;
/**
 * Returns the gas price + 25%, or max gas
 */
async function getAdjustedGasPrice() {
    let gasPrice = await getGasPrice();
    let adjustedGas = adjustValue(gasPrice, 25);
    return avalanche_1.BN.min(adjustedGas, MAX_GAS);
}
exports.getAdjustedGasPrice = getAdjustedGasPrice;
/**
 *
 * @param val
 * @param perc What percentage to adjust with
 */
function adjustValue(val, perc) {
    let padAmt = val.div(new avalanche_1.BN(100)).mul(new avalanche_1.BN(perc));
    return val.add(padAmt);
}
exports.adjustValue = adjustValue;
/**
 * Returns the base fee from the network.
 */
async function getBaseFee() {
    const rawHex = (await network_1.cChain.getBaseFee()).substring(2);
    return new avalanche_1.BN(rawHex, 'hex');
}
exports.getBaseFee = getBaseFee;
/**
 * Returns the current base fee + 25%
 */
async function getBaseFeeRecommended() {
    const baseFee = await getBaseFee();
    return adjustValue(baseFee, 25);
}
exports.getBaseFeeRecommended = getBaseFeeRecommended;
/**
 * Returns the base max priority fee from the network.
 */
async function getMaxPriorityFee() {
    const rawHex = (await network_1.cChain.getMaxPriorityFeePerGas()).substring(2);
    return new avalanche_1.BN(rawHex, 'hex');
}
exports.getMaxPriorityFee = getMaxPriorityFee;
/**
 * Calculate max fee for EIP 1559 transactions given baseFee and maxPriorityFee.
 * According to https://www.blocknative.com/blog/eip-1559-fees
 * @param baseFee in WEI
 * @param maxPriorityFee in WEI
 */
function calculateMaxFee(baseFee, maxPriorityFee) {
    return baseFee.mul(new avalanche_1.BN(2)).add(maxPriorityFee);
}
exports.calculateMaxFee = calculateMaxFee;
/**
 * Creates a mock import transaction and estimates the gas required for it. Returns fee in units of gas.
 * @param numIns Number of inputs for the import transaction.
 * @param numSigs Number of signatures used in the import transactions. This value is the sum of owner addresses in every UTXO.
 */
function estimateImportGasFeeFromMockTx(numIns = 1, numSigs // number of signatures (sum of owner addresses in each utxo)
) {
    const ATOMIC_TX_COST = 10000; // in gas
    const SIG_COST = 1000; // in gas
    const BASE_TX_SIZE = 78;
    const SINGLE_OWNER_INPUT_SIZE = 90; // in bytes
    const OUTPUT_SIZE = 60; // in bytes
    // C chain imports consolidate inputs to one output
    const numOutputs = 1;
    // Assuming each input has 1 owner
    const baseSize = BASE_TX_SIZE + numIns * SINGLE_OWNER_INPUT_SIZE + numOutputs * OUTPUT_SIZE;
    const importGas = baseSize + numSigs * SIG_COST + ATOMIC_TX_COST;
    return importGas;
}
exports.estimateImportGasFeeFromMockTx = estimateImportGasFeeFromMockTx;
/**
 * Estimates the gas fee using a mock ExportTx built from the passed values.
 * @param destinationChain `X` or `P`
 * @param amount in nAVAX
 * @param from The C chain hex address exported from
 * @param to The destination X or P address
 */
function estimateExportGasFeeFromMockTx(destinationChain, amount, from, to) {
    const destChainId = (0, Network_1.chainIdFromAlias)(destinationChain);
    const destChainIdBuff = common_1.bintools.cb58Decode(destChainId);
    const toBuff = common_1.bintools.stringToAddress(to);
    const netID = network_1.activeNetwork.networkID;
    const chainID = network_1.activeNetwork.cChainID;
    const AVAX_ID = network_1.activeNetwork.avaxID;
    const avaxIDBuff = common_1.bintools.cb58Decode(AVAX_ID);
    const txIn = new evm_1.EVMInput(from, amount, avaxIDBuff);
    const secpOut = new evm_1.SECPTransferOutput(amount, [toBuff]);
    const txOut = new evm_1.TransferableOutput(avaxIDBuff, secpOut);
    // Create fake export Tx
    const chainIdBuff = common_1.bintools.cb58Decode(chainID);
    const exportTx = new evm_1.ExportTx(netID, chainIdBuff, destChainIdBuff, [txIn], [txOut]);
    const unisgnedTx = new evm_1.UnsignedTx(exportTx);
    return (0, utils_1.costExportTx)(unisgnedTx);
}
exports.estimateExportGasFeeFromMockTx = estimateExportGasFeeFromMockTx;
/**
 * Returns the estimated gas for the export transaction.
 * @param destinationChain Either `X` or `P`
 * @param amount The amount to export. In nAVAX.
 * @param from The C chain hex address exporting the asset
 * @param fromBech The C chain bech32 address exporting the asset
 * @param to The destination address on the destination chain
 */
async function estimateExportGasFee(destinationChain, from, fromBech, to, amount) {
    let exportTx = await (0, tx_helper_1.buildEvmExportTransaction)([from], to, amount, fromBech, destinationChain, new avalanche_1.BN(0));
    return (0, utils_1.costExportTx)(exportTx);
}
exports.estimateExportGasFee = estimateExportGasFee;
//# sourceMappingURL=gas_helper.js.map