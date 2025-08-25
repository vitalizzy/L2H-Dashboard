/**
 * Export functionality for the dashboard
 */

/**
 * Export data to PDF
 * @param {Array} data - Data to export
 */
export function exportToPDF(data) {
    // Create a simple PDF-like report
    const report = generateReport(data);
    
    // Create a new window with the report
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>L2H Dashboard - Reporte</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .summary { display: flex; justify-content: space-around; margin-bottom: 30px; }
                .summary-card { text-align: center; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f5f5f5; }
                .income { color: green; }
                .expense { color: red; }
                @media print { body { margin: 0; } }
            </style>
        </head>
        <body>
            ${report}
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

/**
 * Export data to Excel (CSV format)
 * @param {Array} data - Data to export
 */
export function exportToExcel(data) {
    const csvContent = convertToCSV(data);
    downloadFile(csvContent, 'l2h-dashboard-reporte.xlsx', 'text/csv');
}

/**
 * Export data to CSV
 * @param {Array} data - Data to export
 */
export function exportToCSV(data) {
    const csvContent = convertToCSV(data);
    downloadFile(csvContent, 'l2h-dashboard-reporte.csv', 'text/csv');
}

/**
 * Generate a comprehensive report
 * @param {Array} data - Data to include in report
 * @returns {string} HTML report
 */
function generateReport(data) {
    const totals = calculateTotals(data);
    const date = new Date().toLocaleDateString('es-ES');
    
    return `
        <div class="header">
            <h1>L2H Dashboard - Reporte Financiero</h1>
            <p>Generado el: ${date}</p>
            <p>Total de transacciones: ${data.length}</p>
        </div>
        
        <div class="summary">
            <div class="summary-card">
                <h3>Ingresos Totales</h3>
                <p class="income">${formatCurrency(totals.income)}</p>
            </div>
            <div class="summary-card">
                <h3>Gastos Totales</h3>
                <p class="expense">${formatCurrency(totals.expenses)}</p>
            </div>
            <div class="summary-card">
                <h3>Balance Neto</h3>
                <p class="${totals.net >= 0 ? 'income' : 'expense'}">${formatCurrency(totals.net)}</p>
            </div>
        </div>
        
        <h2>Transacciones Detalladas</h2>
        <table>
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Descripción</th>
                    <th>Categoría</th>
                    <th>Ingresos</th>
                    <th>Gastos</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(row => `
                    <tr>
                        <td>${formatDate(row['Fecha'])}</td>
                        <td>${row['Descripcion'] || 'Sin descripción'}</td>
                        <td>${row['Categoria'] || 'Sin categoría'}</td>
                        <td class="income">${row['Ingresos'] ? formatCurrency(parseFloat(row['Ingresos'])) : '-'}</td>
                        <td class="expense">${row['Gastos'] ? formatCurrency(parseFloat(row['Gastos'])) : '-'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        
        <div style="margin-top: 30px;">
            <h2>Resumen por Categoría</h2>
            ${generateCategorySummary(data)}
        </div>
    `;
}

/**
 * Calculate totals from data
 * @param {Array} data - Data to calculate totals from
 * @returns {Object} Totals object
 */
function calculateTotals(data) {
    let income = 0;
    let expenses = 0;
    
    data.forEach(row => {
        const rowIncome = parseFloat(String(row['Ingresos'] || '0').replace(',', '.'));
        const rowExpenses = parseFloat(String(row['Gastos'] || '0').replace(',', '.'));
        
        income += !isNaN(rowIncome) ? rowIncome : 0;
        expenses += !isNaN(rowExpenses) ? rowExpenses : 0;
    });
    
    return {
        income,
        expenses,
        net: income - expenses
    };
}

/**
 * Generate category summary
 * @param {Array} data - Data to summarize
 * @returns {string} HTML summary
 */
function generateCategorySummary(data) {
    const categoryTotals = {};
    
    data.forEach(row => {
        const category = row['Categoria'] || 'Sin Categoría';
        const expense = parseFloat(String(row['Gastos'] || '0').replace(',', '.'));
        
        if (expense > 0) {
            categoryTotals[category] = (categoryTotals[category] || 0) + expense;
        }
    });
    
    const sortedCategories = Object.entries(categoryTotals)
        .sort(([,a], [,b]) => b - a);
    
    return `
        <table>
            <thead>
                <tr>
                    <th>Categoría</th>
                    <th>Total Gastado</th>
                    <th>Porcentaje</th>
                </tr>
            </thead>
            <tbody>
                ${sortedCategories.map(([category, total]) => {
                    const percentage = ((total / calculateTotals(data).expenses) * 100).toFixed(1);
                    return `
                        <tr>
                            <td>${category}</td>
                            <td class="expense">${formatCurrency(total)}</td>
                            <td>${percentage}%</td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

/**
 * Convert data to CSV format
 * @param {Array} data - Data to convert
 * @returns {string} CSV content
 */
function convertToCSV(data) {
    if (data.length === 0) return '';
    
    const headers = ['Fecha', 'Descripción', 'Categoría', 'Ingresos', 'Gastos'];
    const csvRows = [headers.join(',')];
    
    data.forEach(row => {
        const values = [
            `"${row['Fecha'] || ''}"`,
            `"${(row['Descripcion'] || '').replace(/"/g, '""')}"`,
            `"${(row['Categoria'] || '').replace(/"/g, '""')}"`,
            row['Ingresos'] || '',
            row['Gastos'] || ''
        ];
        csvRows.push(values.join(','));
    });
    
    return csvRows.join('\n');
}

/**
 * Download a file
 * @param {string} content - File content
 * @param {string} filename - File name
 * @param {string} mimeType - MIME type
 */
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Format currency for display
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2
    }).format(amount);
}

/**
 * Format date for display
 * @param {string} dateString - Date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES');
    } catch (e) {
        return dateString;
    }
} 