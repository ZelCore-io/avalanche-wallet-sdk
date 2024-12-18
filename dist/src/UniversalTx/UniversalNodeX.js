"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UniversalNode_1 = require("@/UniversalTx/UniversalNode");
class UniversalNodeX extends UniversalNode_1.UniversalNodeAbstract {
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
exports.default = UniversalNodeX;
//# sourceMappingURL=UniversalNodeX.js.map