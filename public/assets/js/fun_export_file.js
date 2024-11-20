/**
 * Exports an array of data to an Excel file 
 * @param {Array} data - The data array (2D array).
 * @param {String} [fileName="ExportedData.xlsx"] - Name of the Excel file.
 * @param {String} [sheetName="Sheet1"] - Name of the sheet.
 * @param {String} [title="Exported Data"] - Title of the export.
 * @param {String} [description="Icons included in the data!"] - Description below the title.
 */


export function exportToExcel1(data, fileName = "ExportedData.xlsx", sheetName = "Sheet1", title = "Exported Data", description = "Data exported") {
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

export function exportToExcel2(dataExport) {
    const wsData = [];

    // Add the "Top Categories" section title, move it to the start
    wsData.push(["Top Categories"]);

    // Now add the headers for the "Top Categories" section
    wsData.push(["Category Name", "Quantity Sold"]);

    // Add top categories data with category name and quantity sold
    if (dataExport[1] && dataExport[1].top_categories) {
        Object.entries(dataExport[1].top_categories).forEach(([category, sales]) => {
            wsData.push([category, sales]);
        });
    }

    // Add space between sections
    wsData.push([]);

    // Add a header for "Monthly Sales Data by Year" section
    wsData.push(["Monthly Sales Data by Year"]);

    // Add the month names as headers (Jan, Feb, Mar, ..., Dec)
    wsData.push(["Year", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]);

    // Add monthly data for each year
    if (dataExport[2] && dataExport[2].monthlyDataByYear) {
        Object.entries(dataExport[2].monthlyDataByYear).forEach(([year, months]) => {
            wsData.push([year, ...months]);
        });
    }

    // Add space before the order details section
    wsData.push([]);

    // Add a header row for the "Order Details" section
    wsData.push(["Order ID", "Username", "Email", "Quantity", "Category Name", "Total Amount"]);

    // Iterate through each order and add order details
    dataExport.forEach((data) => {
        const orders = data.order_data || [];
        orders.forEach((order) => {
            order.order_items.forEach((item) => {
                wsData.push([
                    order.order_id,
                    order.users.username,
                    order.users.email,
                    item.quantity,
                    item.product.category.category_name,
                    order.total_amount,
                ]);
            });
        });
    });

    // Create a worksheet and workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Style improvements for better presentation
    const wsRange = XLSX.utils.decode_range(ws['!ref']); // Get the worksheet range
    for (let row = wsRange.s.r; row <= wsRange.e.r; row++) {
        for (let col = wsRange.s.c; col <= wsRange.e.c; col++) {
            const cell = ws[XLSX.utils.encode_cell({ r: row, c: col })];
            if (cell) {
                // Bold headers (first row, i.e., the section titles and category headers)
                if (row === 0 || row === 1) {
                    cell.s = { font: { bold: true }, alignment: { horizontal: "center" } };
                } else {
                    // Center align the content for other rows
                    cell.s = { alignment: { horizontal: "center" } };
                }
                // Adding borders for clarity
                cell.s = { ...cell.s, border: { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } } };
            }
        }
    }

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Orders");

    // Export the workbook as an Excel file
    XLSX.writeFile(wb, "ExportDataExcell.xlsx");
}
