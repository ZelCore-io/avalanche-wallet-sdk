"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UniversalNode_1 = require("../UniversalTx/UniversalNode");
class UniversalNodeC extends UniversalNode_1.UniversalNodeAbstract {
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
exports.default = UniversalNodeC;
//# sourceMappingURL=UniversalNodeC.js.map