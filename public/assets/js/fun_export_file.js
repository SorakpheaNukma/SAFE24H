/**
 * Exports an array of data to an Excel file 
 * @param {Array} data - The data array (2D array).
 * @param {String} [fileName="ExportedData.xlsx"] - Name of the Excel file.
 * @param {String} [sheetName="Sheet1"] - Name of the sheet.
 * @param {String} [title="Exported Data"] - Title of the export.
 * @param {String} [description="Icons included in the data!"] - Description below the title.
 */


export function exportToExcel(data, fileName = "ExportedData.xlsx", sheetName = "Sheet1", title = "Exported Data", description = "Data exported") {
    const wb = XLSX.utils.book_new();

    // Add the title and description at the top
    const headerRows = [
        [title], // Title row
        [description], // Description row
        [], // Empty row to separate title/description from the data
        ...data // Append actual data
    ];

    // Convert header + data to a worksheet
    const ws = XLSX.utils.aoa_to_sheet(headerRows);

    // Merge cells for the title and description
    const numberOfColumns = data[0].length;
    ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: numberOfColumns - 1 } }, // Merge title row
        { s: { r: 1, c: 0 }, e: { r: 1, c: numberOfColumns - 1 } }  // Merge description row
    ];

    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Export the workbook as an Excel file
    XLSX.writeFile(wb, fileName);
}
