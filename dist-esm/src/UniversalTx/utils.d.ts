/// <reference types="bn.js" />
import { BN } from 'avalanche';
import { UniversalTx } from '@/UniversalTx/types';
import UniversalNodeX from '@/UniversalTx/UniversalNodeX';
import UniversalNodeP from '@/UniversalTx/UniversalNodeP';
import UniversalNodeC from '@/UniversalTx/UniversalNodeC';
export declare function createGraphForP(balX: BN, balP: BN, balC: BN, atomicFeeXP: BN, atomicFeeC: BN): UniversalNodeP;
export declare function createGraphForC(balX: BN, balP: BN, balC: BN, atomicFeeXP: BN, atomicFeeC: BN): UniversalNodeC;
export declare function createGraphForX(balX: BN, balP: BN, balC: BN, atomicFeeXP: BN, atomicFeeC: BN): UniversalNodeX;
export declare function canHaveBalanceOnX(balX: BN, balP: BN, balC: BN, targetAmount: BN, atomicFeeXP: BN, atomicFeeC: BN): boolean;
export declare function canHaveBalanceOnP(balX: BN, balP: BN, balC: BN, targetAmount: BN, atomicFeeXP: BN, atomicFeeC: BN): boolean;
/**
 * Will return true if `targetAmount` can exist on C chain
 */
export declare function canHaveBalanceOnC(balX: BN, balP: BN, balC: BN, targetAmount: BN, atomicFeeXP: BN, atomicFeeC: BN): boolean;
export declare function getStepsForBalanceP(balX: BN, balP: BN, balC: BN, targetAmount: BN, atomicFeeXP: BN, atomicFeeC: BN): UniversalTx[];
export declare function getStepsForBalanceC(balX: BN, balP: BN, balC: BN, targetAmount: BN, atomicFeeXP: BN, atomicFeeC: BN): UniversalTx[];
export declare function getStepsForBalanceX(balX: BN, balP: BN, balC: BN, targetAmount: BN, atomicFeeXP: BN, atomicFeeC: BN): UniversalTx[];
