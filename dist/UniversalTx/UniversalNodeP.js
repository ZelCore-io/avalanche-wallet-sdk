"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UniversalNode_1 = require("../UniversalTx/UniversalNode");
class UniversalNodeP extends UniversalNode_1.UniversalNodeAbstract {
    constructor(balance, feeExport, feeImport) {
        super(balance, 'P', feeExport, feeImport);
    }
    buildExportTx(destChain, amount) {
        return super.buildExportTx(destChain, amount);
    }
    buildImportTx(sourceChain) {
        return super.buildImportTx(sourceChain);
    }
    getExportMethod(to) {
        if (to === 'X') {
            return 'export_p_x';
        }
        else {
            return 'export_p_c';
        }
    }
    getImportMethod(from) {
        if (from === 'X') {
            return 'import_x_p';
        }
        else {
            return 'import_c_p';
        }
    }
}
exports.default = UniversalNodeP;
//# sourceMappingURL=UniversalNodeP.js.map