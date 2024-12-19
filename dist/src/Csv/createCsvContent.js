"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCSVContent = void 0;
function createCSVContent(rows) {
    let csvContent = '';
    rows.forEach(function (arr) {
        let row = arr.join(',');
        csvContent += row + '\r\n';
    });
    return csvContent;
}
exports.createCSVContent = createCSVContent;
//# sourceMappingURL=createCsvContent.js.map