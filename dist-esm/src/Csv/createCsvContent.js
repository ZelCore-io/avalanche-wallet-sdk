export function createCSVContent(rows) {
    let csvContent = '';
    rows.forEach(function (arr) {
        let row = arr.join(',');
        csvContent += row + '\r\n';
    });
    return csvContent;
}
//# sourceMappingURL=createCsvContent.js.map