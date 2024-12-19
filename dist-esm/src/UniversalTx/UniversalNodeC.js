import { UniversalNodeAbstract } from '@/UniversalTx/UniversalNode';
export default class UniversalNodeC extends UniversalNodeAbstract {
    constructor(balance, feeExport, feeImport) {
        super(balance, 'C', feeExport, feeImport);
    }
    buildExportTx(destChain, amount) {
        return super.buildExportTx(destChain, amount);
    }
    buildImportTx(sourceChain) {
        return super.buildImportTx(sourceChain);
    }
    getExportMethod(to) {
        if (to === 'X') {
            return 'export_c_x';
        }
        else {
            return 'export_c_p';
        }
    }
    getImportMethod(from) {
        if (from === 'X') {
            return 'import_x_c';
        }
        else {
            return 'import_p_c';
        }
    }
}
//# sourceMappingURL=UniversalNodeC.js.map