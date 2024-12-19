/// <reference types="bn.js" />
import { UniversalNodeAbstract } from '../UniversalTx/UniversalNode';
import { ExportChainsC } from '../Wallet/types';
import { UniversalTxActionExportC, UniversalTxActionImportC, UniversalTxExportC, UniversalTxImportC } from '../UniversalTx/types';
import { BN } from '@avalabs/avalanchejs';
export default class UniversalNodeC extends UniversalNodeAbstract {
    constructor(balance: BN, feeExport: BN, feeImport: BN);
    buildExportTx(destChain: ExportChainsC, amount: BN): UniversalTxExportC;
    buildImportTx(sourceChain: ExportChainsC): UniversalTxImportC;
    getExportMethod(to: ExportChainsC): UniversalTxActionExportC;
    getImportMethod(from: ExportChainsC): UniversalTxActionImportC;
}
//# sourceMappingURL=UniversalNodeC.d.ts.map