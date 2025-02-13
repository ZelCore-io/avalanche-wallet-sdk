/// <reference types="bn.js" />
import { UniversalNodeAbstract } from '../UniversalTx/UniversalNode';
import { ExportChainsP } from '../Wallet/types';
import { UniversalTxActionExportP, UniversalTxActionImportP, UniversalTxExportP, UniversalTxImportP } from '../UniversalTx/types';
import { BN } from '@avalabs/avalanchejs';
export default class UniversalNodeP extends UniversalNodeAbstract {
    constructor(balance: BN, feeExport: BN, feeImport: BN);
    buildExportTx(destChain: ExportChainsP, amount: BN): UniversalTxExportP;
    buildImportTx(sourceChain: ExportChainsP): UniversalTxImportP;
    getExportMethod(to: ExportChainsP): UniversalTxActionExportP;
    getImportMethod(from: ExportChainsP): UniversalTxActionImportP;
}
//# sourceMappingURL=UniversalNodeP.d.ts.map