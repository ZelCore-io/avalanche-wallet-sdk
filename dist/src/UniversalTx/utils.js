"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStepsForBalanceX = exports.getStepsForBalanceC = exports.getStepsForBalanceP = exports.canHaveBalanceOnC = exports.canHaveBalanceOnP = exports.canHaveBalanceOnX = exports.createGraphForX = exports.createGraphForC = exports.createGraphForP = void 0;
const tslib_1 = require("tslib");
const UniversalNodeX_1 = tslib_1.__importDefault(require("@/UniversalTx/UniversalNodeX"));
const UniversalNodeP_1 = tslib_1.__importDefault(require("@/UniversalTx/UniversalNodeP"));
const UniversalNodeC_1 = tslib_1.__importDefault(require("@/UniversalTx/UniversalNodeC"));
function createGraphForP(balX, balP, balC, atomicFeeXP, atomicFeeC) {
    let xNode = new UniversalNodeX_1.default(balX, atomicFeeXP, atomicFeeXP);
    let pNode = new UniversalNodeP_1.default(balP, atomicFeeXP, atomicFeeXP);
    let cNode = new UniversalNodeC_1.default(balC, atomicFeeC, atomicFeeC);
    pNode.addParent(xNode);
    pNode.addParent(cNode);
    cNode.setChild(pNode);
    xNode.setChild(pNode);
    return pNode;
}
exports.createGraphForP = createGraphForP;
function createGraphForC(balX, balP, balC, atomicFeeXP, atomicFeeC) {
    let xNode = new UniversalNodeX_1.default(balX, atomicFeeXP, atomicFeeXP);
    let pNode = new UniversalNodeP_1.default(balP, atomicFeeXP, atomicFeeXP);
    let cNode = new UniversalNodeC_1.default(balC, atomicFeeC, atomicFeeC);
    cNode.addParent(xNode);
    cNode.addParent(pNode);
    pNode.setChild(cNode);
    xNode.setChild(cNode);
    return cNode;
}
exports.createGraphForC = createGraphForC;
function createGraphForX(balX, balP, balC, atomicFeeXP, atomicFeeC) {
    let xNode = new UniversalNodeX_1.default(balX, atomicFeeXP, atomicFeeXP);
    let pNode = new UniversalNodeP_1.default(balP, atomicFeeXP, atomicFeeXP);
    let cNode = new UniversalNodeC_1.default(balC, atomicFeeC, atomicFeeC);
    xNode.addParent(pNode);
    xNode.addParent(cNode);
    cNode.setChild(xNode);
    pNode.setChild(xNode);
    return xNode;
}
exports.createGraphForX = createGraphForX;
function canHaveBalanceOnX(balX, balP, balC, targetAmount, atomicFeeXP, atomicFeeC) {
    let startNode = createGraphForX(balX, balP, balC, atomicFeeXP, atomicFeeC);
    return startNode.reduceTotalBalanceFromParents().gte(targetAmount);
}
exports.canHaveBalanceOnX = canHaveBalanceOnX;
function canHaveBalanceOnP(balX, balP, balC, targetAmount, atomicFeeXP, atomicFeeC) {
    let startNode = createGraphForP(balX, balP, balC, atomicFeeXP, atomicFeeC);
    return startNode.reduceTotalBalanceFromParents().gte(targetAmount);
}
exports.canHaveBalanceOnP = canHaveBalanceOnP;
/**
 * Will return true if `targetAmount` can exist on C chain
 */
function canHaveBalanceOnC(balX, balP, balC, targetAmount, atomicFeeXP, atomicFeeC) {
    let startNode = createGraphForC(balX, balP, balC, atomicFeeXP, atomicFeeC);
    return startNode.reduceTotalBalanceFromParents().gte(targetAmount);
}
exports.canHaveBalanceOnC = canHaveBalanceOnC;
function getStepsForBalanceP(balX, balP, balC, targetAmount, atomicFeeXP, atomicFeeC) {
    let startNode = createGraphForP(balX, balP, balC, atomicFeeXP, atomicFeeC);
    if (startNode.reduceTotalBalanceFromParents().lt(targetAmount)) {
        throw new Error('Insufficient AVAX.');
    }
    return startNode.getStepsForTargetBalance(targetAmount);
}
exports.getStepsForBalanceP = getStepsForBalanceP;
function getStepsForBalanceC(balX, balP, balC, targetAmount, atomicFeeXP, atomicFeeC) {
    let startNode = createGraphForC(balX, balP, balC, atomicFeeXP, atomicFeeC);
    if (startNode.reduceTotalBalanceFromParents().lt(targetAmount)) {
        throw new Error('Insufficient AVAX.');
    }
    return startNode.getStepsForTargetBalance(targetAmount);
}
exports.getStepsForBalanceC = getStepsForBalanceC;
function getStepsForBalanceX(balX, balP, balC, targetAmount, atomicFeeXP, atomicFeeC) {
    let startNode = createGraphForX(balX, balP, balC, atomicFeeXP, atomicFeeC);
    if (startNode.reduceTotalBalanceFromParents().lt(targetAmount)) {
        throw new Error('Insufficient AVAX.');
    }
    return startNode.getStepsForTargetBalance(targetAmount);
}
exports.getStepsForBalanceX = getStepsForBalanceX;
//# sourceMappingURL=utils.js.map