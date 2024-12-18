"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniversalNodeAbstract = void 0;
const avalanche_1 = require("avalanche");
class UniversalNodeAbstract {
    parents;
    child; // can only have 1 child
    balance;
    chain;
    feeExport;
    feeImport;
    constructor(balance, chain, feeExport, feeImport) {
        this.parents = [];
        this.child = null;
        this.balance = balance;
        this.chain = chain;
        this.feeExport = feeExport;
        this.feeImport = feeImport;
    }
    // Sum of the node's balance + all balance of parents minus the transfer fees
    reduceTotalBalanceFromParents() {
        // If there are no balance return balance of self
        if (this.parents.length === 0) {
            return this.balance;
        }
        let parentBals = this.parents.map((node) => {
            // Subtract transfer fees from parent balance
            // import + export
            let parentBalance = node.reduceTotalBalanceFromParents();
            parentBalance = parentBalance.sub(this.feeImport).sub(node.feeExport);
            let zero = new avalanche_1.BN(0);
            return avalanche_1.BN.max(parentBalance, zero);
        });
        let tot = parentBals.reduce((prev, current) => {
            return prev.add(current);
        }, new avalanche_1.BN(0));
        return tot.add(this.balance);
    }
    buildExportTx(destChain, amount) {
        return {
            action: this.getExportMethod(destChain),
            amount: amount,
            fee: this.feeExport,
        };
    }
    buildImportTx(sourceChain) {
        return {
            action: this.getImportMethod(sourceChain),
            fee: this.feeImport,
        };
    }
    /***
     * Assumes there is enough balance on node tree
     * Returns empty array even if transaction not possible!
     * What steps to take to have the target balance on this node.
     * @param target Amount of nAVAX needed on this node.
     */
    getStepsForTargetBalance(target) {
        // If the node has enough balance no transaction needed
        // If target is negative or zero no transaction needed
        if (this.balance.gte(target) || target.lte(new avalanche_1.BN(0))) {
            return [];
        }
        // If not enough balance and no parents
        // return all the balance
        if (this.balance.lt(target) && this.parents.length === 0) {
            return [];
        }
        // If not enough balance on this node, try to collect it from parents
        // Amount needed to collect from parents
        let remaining = target.sub(this.balance);
        let transactions = [];
        for (let i = 0; i < this.parents.length; i++) {
            let p = this.parents[i];
            if (remaining.lte(new avalanche_1.BN(0)))
                break;
            // Parent's balance
            let pBal = p.reduceTotalBalanceFromParents();
            const exportFee = p.feeExport;
            const importFee = this.feeImport;
            const feeImportExport = exportFee.add(importFee);
            // Maximum balance we can import from parent
            let pBalMax = pBal.sub(feeImportExport);
            // The parent needs to have this balance to satisfy the needed amount
            // Try to export the remaining amount, if the parent balance is lower than that export the maximum amount
            // Import amount is the usable amount imported
            const importAmt = avalanche_1.BN.min(pBalMax, remaining); // The amount that will cross to the target chain
            // Exported amount should include the import fees
            const exportAmt = importAmt.add(importFee);
            if (exportAmt.lte(new avalanche_1.BN(0)))
                continue;
            let pTx = p.buildExportTx(this.chain, exportAmt);
            let importTx = this.buildImportTx(p.chain);
            transactions.push(pTx);
            transactions.push(importTx);
            remaining = remaining.sub(importAmt);
        }
        // If we still have remaining balance, we can not complete this transfer
        if (remaining.gt(new avalanche_1.BN(0))) {
            throw new Error('Insufficient AVAX balances.');
        }
        return transactions;
    }
    addParent(node) {
        this.parents.push(node);
    }
    setChild(node) {
        this.child = node;
    }
}
exports.UniversalNodeAbstract = UniversalNodeAbstract;
//# sourceMappingURL=UniversalNode.js.map