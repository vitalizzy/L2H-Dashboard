/**
 * Formats a number as EUR currency.
 * @param {number} value The number to format.
 * @returns {string} The formatted currency string.
 */
export const formatCurrency = (value) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);

/**
 * Updates the summary cards with the calculated totals.
 * @param {number} totalIncome - The total income.
 * @param {number} totalExpenses - The total expenses.
 */
export function updateSummaryCards(totalIncome, totalExpenses) {
    const netBalance = totalIncome - totalExpenses;
    document.getElementById('totalIncome').textContent = formatCurrency(totalIncome);
    document.getElementById('totalExpenses').textContent = formatCurrency(totalExpenses);
    document.getElementById('netBalance').textContent = formatCurrency(netBalance);
}

/**
 * Populates the month filter dropdown with unique months from the dataset.
 * @param {Array} data - The full dataset.
 * @param {Function} callback - The function to call when the filter changes.
 */
export function populateMonthFilter(data, callback) {
    const monthFilter = document.getElementById('monthFilter');
    const months = [...new Set(data.map(item => item['Mes Ano']).filter(Boolean))].sort();
    
    monthFilter.innerHTML = '<option value="all">Todos los Meses</option>';
    months.forEach(month => {
        const option = document.createElement('option');
        option.value = month;
        option.textContent = month;
        monthFilter.appendChild(option);
    });

    monthFilter.addEventListener('change', (e) => callback(e.target.value));
}

/**
 * Displays an error message in the loading container.
 * @param {string} message - The primary error message.
 * @param {string} detail - The detailed error from the catch block.
 */
export function showLoadingError(message, detail) {
    const loadingContainer = document.getElementById('loading-container');
    if (loadingContainer) {
        loadingContainer.innerHTML = `<p class="text-red-500 font-semibold">${message}</p><p class="text-sm text-gray-500 mt-2">${detail}</p>`;
    }
}

/**
 * Hides the main loader and prepares the chart grid.
 */
export function hideLoader() {
    const loadingContainer = document.getElementById('loading-container');
    if (loadingContainer) {
        loadingContainer.style.display = 'none';
    }
    
    const chartsGrid = document.getElementById('charts-grid');
    chartsGrid.innerHTML = `
        <div class="lg:col-span-3 bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h2 class="text-xl font-semibold text-gray-700 mb-4">Ingresos vs. Gastos Mensuales</h2>
            <div class="chart-container"><canvas id="monthlyComparisonChart"></canvas></div>
        </div>
        <div class="lg:col-span-2 bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h2 class="text-xl font-semibold text-gray-700 mb-4">Distribución de Gastos</h2>
            <div class="chart-container"><canvas id="expenseDistributionChart"></canvas></div>
        </div>
        <div class="lg:col-span-5 bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h2 class="text-xl font-semibold text-gray-700 mb-4">Top 5 Categorías de Gastos</h2>
            <div class="chart-container" style="height: 45vh;"><canvas id="topExpensesChart"></canvas></div>
        </div>
    `;
}
