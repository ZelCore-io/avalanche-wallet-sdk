import { UniversalNodeAbstract } from '@/UniversalTx/UniversalNode';
export default class UniversalNodeX extends UniversalNodeAbstract {
    constructor(balance, feeExport, feeImport) {
        super(balance, 'X', feeExport, feeImport);
    }
    buildExportTx(destChain, amount) {
        return super.buildExportTx(destChain, amount);
    }
    buildImportTx(sourceChain) {
        return super.buildImportTx(sourceChain);
    }
    getExportMethod(to) {
        if (to === 'P') {
            return 'export_x_p';
        }
        else {
            return 'export_x_c';
        }
    }
    getImportMethod(from) {
        if (from === 'P') {
            return 'import_p_x';
        }
        else {
            return 'import_c_x';
        }
    }
}
//# sourceMappingURL=UniversalNodeX.js.map