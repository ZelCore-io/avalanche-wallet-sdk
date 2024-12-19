/// <reference types="bn.js" />
import { UniversalNodeAbstract } from '../UniversalTx/UniversalNode';
import { ExportChainsX } from '../Wallet/types';
import { UniversalTxActionExportX, UniversalTxActionImportX, UniversalTxExportX, UniversalTxImportX } from '../UniversalTx/types';
import { BN } from '@avalabs/avalanchejs';
export default class UniversalNodeX extends UniversalNodeAbstract {
    constructor(balance: BN, feeExport: BN, feeImport: BN);
    buildExportTx(destChain: ExportChainsX, amount: BN): UniversalTxExportX;
    buildImportTx(sourceChain: ExportChainsX): UniversalTxImportX;
    getExportMethod(to: ExportChainsX): UniversalTxActionExportX;
    getImportMethod(from: ExportChainsX): UniversalTxActionImportX;
}
//# sourceMappingURL=UniversalNodeX.d.ts.map