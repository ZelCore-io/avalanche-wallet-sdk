/// <reference types="bn.js" />
import { BN } from '@avalabs/avalanchejs';
import { ChainIdType } from '../common';
import { UniversalTx, UniversalTxActionExport, UniversalTxActionImport, UniversalTxExport, UniversalTxImport } from './types';
export declare abstract class UniversalNodeAbstract {
    parents: UniversalNodeAbstract[];
    child: UniversalNodeAbstract | null;
    balance: BN;
    chain: ChainIdType;
    feeExport: BN;
    feeImport: BN;
    protected constructor(balance: BN, chain: ChainIdType, feeExport: BN, feeImport: BN);
    reduceTotalBalanceFromParents(): BN;
    /**
     * Returns the export action type from this node to its child
     * @param to
     */
    abstract getExportMethod(to: ChainIdType): UniversalTxActionExport;
    /**
     * Returns the import action type from this node to its child
     * @param from Which chain are we importing from
     */
    abstract getImportMethod(from: ChainIdType): UniversalTxActionImport;
    buildExportTx(destChain: ChainIdType, amount: BN): UniversalTxExport;
    buildImportTx(sourceChain: ChainIdType): UniversalTxImport;
    /***
     * Assumes there is enough balance on node tree
     * Returns empty array even if transaction not possible!
     * What steps to take to have the target balance on this node.
     * @param target Amount of nAVAX needed on this node.
     */
    getStepsForTargetBalance(target: BN): UniversalTx[];
    addParent(node: UniversalNodeAbstract): void;
    setChild(node: UniversalNodeAbstract): void;
}
