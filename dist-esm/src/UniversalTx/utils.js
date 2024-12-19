import UniversalNodeX from '@/UniversalTx/UniversalNodeX';
import UniversalNodeP from '@/UniversalTx/UniversalNodeP';
import UniversalNodeC from '@/UniversalTx/UniversalNodeC';
export function createGraphForP(balX, balP, balC, atomicFeeXP, atomicFeeC) {
    let xNode = new UniversalNodeX(balX, atomicFeeXP, atomicFeeXP);
    let pNode = new UniversalNodeP(balP, atomicFeeXP, atomicFeeXP);
    let cNode = new UniversalNodeC(balC, atomicFeeC, atomicFeeC);
    pNode.addParent(xNode);
    pNode.addParent(cNode);
    cNode.setChild(pNode);
    xNode.setChild(pNode);
    return pNode;
}
export function createGraphForC(balX, balP, balC, atomicFeeXP, atomicFeeC) {
    let xNode = new UniversalNodeX(balX, atomicFeeXP, atomicFeeXP);
    let pNode = new UniversalNodeP(balP, atomicFeeXP, atomicFeeXP);
    let cNode = new UniversalNodeC(balC, atomicFeeC, atomicFeeC);
    cNode.addParent(xNode);
    cNode.addParent(pNode);
    pNode.setChild(cNode);
    xNode.setChild(cNode);
    return cNode;
}
export function createGraphForX(balX, balP, balC, atomicFeeXP, atomicFeeC) {
    let xNode = new UniversalNodeX(balX, atomicFeeXP, atomicFeeXP);
    let pNode = new UniversalNodeP(balP, atomicFeeXP, atomicFeeXP);
    let cNode = new UniversalNodeC(balC, atomicFeeC, atomicFeeC);
    xNode.addParent(pNode);
    xNode.addParent(cNode);
    cNode.setChild(xNode);
    pNode.setChild(xNode);
    return xNode;
}
export function canHaveBalanceOnX(balX, balP, balC, targetAmount, atomicFeeXP, atomicFeeC) {
    let startNode = createGraphForX(balX, balP, balC, atomicFeeXP, atomicFeeC);
    return startNode.reduceTotalBalanceFromParents().gte(targetAmount);
}
export function canHaveBalanceOnP(balX, balP, balC, targetAmount, atomicFeeXP, atomicFeeC) {
    let startNode = createGraphForP(balX, balP, balC, atomicFeeXP, atomicFeeC);
    return startNode.reduceTotalBalanceFromParents().gte(targetAmount);
}
/**
 * Will return true if `targetAmount` can exist on C chain
 */
export function canHaveBalanceOnC(balX, balP, balC, targetAmount, atomicFeeXP, atomicFeeC) {
    let startNode = createGraphForC(balX, balP, balC, atomicFeeXP, atomicFeeC);
    return startNode.reduceTotalBalanceFromParents().gte(targetAmount);
}
export function getStepsForBalanceP(balX, balP, balC, targetAmount, atomicFeeXP, atomicFeeC) {
    let startNode = createGraphForP(balX, balP, balC, atomicFeeXP, atomicFeeC);
    if (startNode.reduceTotalBalanceFromParents().lt(targetAmount)) {
        throw new Error('Insufficient AVAX.');
    }
    return startNode.getStepsForTargetBalance(targetAmount);
}
export function getStepsForBalanceC(balX, balP, balC, targetAmount, atomicFeeXP, atomicFeeC) {
    let startNode = createGraphForC(balX, balP, balC, atomicFeeXP, atomicFeeC);
    if (startNode.reduceTotalBalanceFromParents().lt(targetAmount)) {
        throw new Error('Insufficient AVAX.');
    }
    return startNode.getStepsForTargetBalance(targetAmount);
}
export function getStepsForBalanceX(balX, balP, balC, targetAmount, atomicFeeXP, atomicFeeC) {
    let startNode = createGraphForX(balX, balP, balC, atomicFeeXP, atomicFeeC);
    if (startNode.reduceTotalBalanceFromParents().lt(targetAmount)) {
        throw new Error('Insufficient AVAX.');
    }
    return startNode.getStepsForTargetBalance(targetAmount);
}
//# sourceMappingURL=utils.js.map