import { GOOGLE_SHEET_API_URL } from './config.js';
import { fetchData } from './api.js';
import { updateSummaryCards, populateMonthFilter, showLoadingError, hideLoader } from './ui.js';
import { renderCharts } from './charts.js';

// Global variable to hold the full dataset
let fullDataset = [];

/**
 * Processes the data based on the selected month and updates the UI.
 * @param {string} selectedMonth - The month to filter by, or 'all'.
 */
function processAndRenderData(selectedMonth) {
    const data = selectedMonth === 'all' 
        ? fullDataset 
        : fullDataset.filter(row => row['Mes Ano'] === selectedMonth);

    // 1. Calculate totals for summary cards
    let totalIncome = 0;
    let totalExpenses = 0;
    data.forEach(row => {
        const income = parseFloat(String(row['Ingresos'] || '0').replace(',', '.'));
        const expenses = parseFloat(String(row['Gastos'] || '0').replace(',', '.'));
        totalIncome += !isNaN(income) ? income : 0;
        totalExpenses += !isNaN(expenses) ? expenses : 0;
    });
    updateSummaryCards(totalIncome, totalExpenses);
    
    // 2. Prepare data for Monthly Comparison Chart
    const monthlySummary = {};
    const sourceData = selectedMonth === 'all' ? data : fullDataset; // Use full dataset for context in monthly chart
    sourceData.forEach(row => {
        const monthYear = row['Mes Ano'];
        if (!monthYear) return;
        if (!monthlySummary[monthYear]) {
            monthlySummary[monthYear] = { income: 0, expenses: 0 };
        }
        const income = parseFloat(String(row['Ingresos'] || '0').replace(',', '.'));
        const expenses = parseFloat(String(row['Gastos'] || '0').replace(',', '.'));
        monthlySummary[monthYear].income += !isNaN(income) ? income : 0;
        monthlySummary[monthYear].expenses += !isNaN(expenses) ? expenses : 0;
    });
    const sortedMonths = Object.keys(monthlySummary).sort();
    const monthlyData = {
        labels: sortedMonths,
        income: sortedMonths.map(month => monthlySummary[month].income),
        expenses: sortedMonths.map(month => monthlySummary[month].expenses)
    };

    // 3. Prepare data for Expense Distribution Chart
    const expenseSummary = {};
    data.forEach(row => {
        const category = row['Categoria'] || 'Sin Categoría';
        const expense = parseFloat(String(row['Gastos'] || '0').replace(',', '.'));
        if (expense > 0) {
            expenseSummary[category] = (expenseSummary[category] || 0) + expense;
        }
    });
    const sortedExpenses = Object.entries(expenseSummary).sort(([,a],[,b]) => b-a);
    const topExpenseCategories = sortedExpenses.slice(0, 9);
    const otherExpenses = sortedExpenses.slice(9).reduce((acc, [, value]) => acc + value, 0);
    const expenseLabels = topExpenseCategories.map(([label]) => label);
    const expenseValues = topExpenseCategories.map(([, value]) => value);
    if (otherExpenses > 0) {
        expenseLabels.push('Otros');
        expenseValues.push(otherExpenses);
    }
    const expenseCategoryData = { labels: expenseLabels, values: expenseValues };

    // 4. Prepare data for Top 5 Expenses Chart
    const topExpensesData = {
        labels: sortedExpenses.slice(0, 5).map(([l]) => l),
        values: sortedExpenses.slice(0, 5).map(([,v]) => v)
    };

    // Render all charts with the processed data
    renderCharts(monthlyData, expenseCategoryData, topExpensesData);
}

/**
 * Main function to initialize the dashboard.
 */
async function initializeDashboard() {
    try {
        fullDataset = await fetchData(GOOGLE_SHEET_API_URL);
        hideLoader();
        populateMonthFilter(fullDataset, processAndRenderData);
        processAndRenderData('all'); // Initial render
    } catch (error) {
        console.error('Initialization failed:', error);
        showLoadingError('No se pudieron cargar los datos.', error.message);
    }
}

// Start the application once the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeDashboard);
