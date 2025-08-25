import { GOOGLE_SHEET_API_URL } from './config.js';
import { fetchData } from './api.js';
import { updateSummaryCards, populateMonthFilter, showLoadingError, hideLoader, updateTransactionCount, formatCurrency } from './ui.js';
import { renderCharts, setChartFilterCallback, clearChartSelections } from './charts.js';
import { exportToPDF, exportToExcel, exportToCSV } from './export.js';
import { initializeTheme, toggleTheme } from './theme.js';

// Global variables
let fullDataset = [];
let filteredDataset = [];
let currentFilters = {
    month: 'all',
    category: 'all',
    search: ''
};

/**
 * Initialize theme system
 */
function initializeThemeSystem() {
    initializeTheme();
    
    // Theme toggle event listener
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
}

/**
 * Initialize export functionality
 */
function initializeExportSystem() {
    const exportBtn = document.getElementById('exportBtn');
    const exportModal = document.getElementById('exportModal');
    const closeExportModal = document.getElementById('closeExportModal');
    const exportPDF = document.getElementById('exportPDF');
    const exportExcel = document.getElementById('exportExcel');
    const exportCSV = document.getElementById('exportCSV');

    // Open export modal
    exportBtn.addEventListener('click', () => {
        exportModal.classList.remove('hidden');
        exportModal.classList.add('modal-enter');
    });

    // Close export modal
    closeExportModal.addEventListener('click', () => {
        exportModal.classList.add('hidden');
    });

    // Close modal when clicking outside
    exportModal.addEventListener('click', (e) => {
        if (e.target === exportModal) {
            exportModal.classList.add('hidden');
        }
    });

    // Export handlers
    exportPDF.addEventListener('click', () => {
        exportToPDF(filteredDataset);
        exportModal.classList.add('hidden');
    });

    exportExcel.addEventListener('click', () => {
        exportToExcel(filteredDataset);
        exportModal.classList.add('hidden');
    });

    exportCSV.addEventListener('click', () => {
        exportToCSV(filteredDataset);
        exportModal.classList.add('hidden');
    });
}

/**
 * Initialize filtering and search system
 */
function initializeFilterSystem() {
    const monthFilter = document.getElementById('monthFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const searchInput = document.getElementById('searchInput');

    // Month filter
    monthFilter.addEventListener('change', (e) => {
        currentFilters.month = e.target.value;
        applyFilters();
    });

    // Category filter
    categoryFilter.addEventListener('change', (e) => {
        currentFilters.category = e.target.value;
        applyFilters();
    });

    // Search input with debouncing
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            currentFilters.search = e.target.value.toLowerCase();
            applyFilters();
        }, 300);
    });
}

/**
 * Initialize clear filters functionality
 */
function initializeClearFilters() {
    // Add clear filters button to the UI
    const filtersSection = document.querySelector('.flex.flex-col.sm\\:flex-row.space-y-3.sm\\:space-y-0.sm\\:space-x-4');
    if (filtersSection) {
        const clearButton = document.createElement('button');
        clearButton.id = 'clearFiltersBtn';
        clearButton.className = 'px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-2';
        clearButton.innerHTML = '<i class="fas fa-times"></i><span>Limpiar Filtros</span>';
        clearButton.addEventListener('click', clearAllFilters);
        filtersSection.appendChild(clearButton);
    }
}

/**
 * Clear all filters and chart selections
 */
function clearAllFilters() {
    // Clear filter values
    currentFilters.month = 'all';
    currentFilters.category = 'all';
    currentFilters.search = '';
    
    // Reset filter dropdowns
    const monthFilter = document.getElementById('monthFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const searchInput = document.getElementById('searchInput');
    
    if (monthFilter) monthFilter.value = 'all';
    if (categoryFilter) categoryFilter.value = 'all';
    if (searchInput) searchInput.value = '';
    
    // Clear chart selections
    clearChartSelections();
    
    // Apply filters to update UI
    applyFilters();
}

/**
 * Apply all current filters to the dataset
 */
function applyFilters() {
    filteredDataset = fullDataset.filter(row => {
        // Month filter
        if (currentFilters.month !== 'all' && row['Mes Ano'] !== currentFilters.month) {
            return false;
        }

        // Category filter
        if (currentFilters.category !== 'all' && row['Categoria'] !== currentFilters.category) {
            return false;
        }

        // Search filter
        if (currentFilters.search) {
            const searchableText = [
                row['Descripcion'] || '',
                row['Categoria'] || '',
                row['Mes Ano'] || '',
                String(row['Ingresos'] || ''),
                String(row['Gastos'] || '')
            ].join(' ').toLowerCase();
            
            if (!searchableText.includes(currentFilters.search)) {
                return false;
            }
        }

        return true;
    });

    // Update UI with filtered data
    processAndRenderData();
    updateTransactionsTable(filteredDataset);
}

/**
 * Update the transactions table with filtered data
 */
function updateTransactionsTable(data) {
    const tableBody = document.getElementById('transactionsTableBody');
    
    if (!tableBody) return;

    tableBody.innerHTML = '';

    if (data.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No se encontraron transacciones con los filtros aplicados
                </td>
            </tr>
        `;
        return;
    }

    // Sort by date (newest first)
    const sortedData = [...data].sort((a, b) => {
        const dateA = new Date(a['Fecha'] || '1900-01-01');
        const dateB = new Date(b['Fecha'] || '1900-01-01');
        return dateB - dateA;
    });

    sortedData.forEach(row => {
        const tr = document.createElement('tr');
        tr.className = 'transaction-row fade-in';
        
        const income = parseFloat(String(row['Ingresos'] || '0').replace(',', '.'));
        const expense = parseFloat(String(row['Gastos'] || '0').replace(',', '.'));
        const isIncome = income > 0;
        
        tr.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                ${formatDate(row['Fecha'])}
            </td>
            <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">
                <div class="flex items-center">
                    <span class="status-indicator ${isIncome ? 'status-income' : 'status-expense'}"></span>
                    ${row['Descripcion'] || 'Sin descripción'}
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    ${row['Categoria'] || 'Sin categoría'}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400 font-medium">
                ${income > 0 ? formatCurrency(income) : '-'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400 font-medium">
                ${expense > 0 ? formatCurrency(expense) : '-'}
            </td>
        `;
        
        tableBody.appendChild(tr);
    });
}

/**
 * Format date for display
 */
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (e) {
        return dateString;
    }
}

/**
 * Processes the data based on current filters and updates the UI.
 */
function processAndRenderData() {
    const data = filteredDataset;

    // 1. Calculate totals for summary cards
    let totalIncome = 0;
    let totalExpenses = 0;
    let transactionCount = data.length;
    
    data.forEach(row => {
        const income = parseFloat(String(row['Ingresos'] || '0').replace(',', '.'));
        const expenses = parseFloat(String(row['Gastos'] || '0').replace(',', '.'));
        totalIncome += !isNaN(income) ? income : 0;
        totalExpenses += !isNaN(expenses) ? expenses : 0;
    });
    
    updateSummaryCards(totalIncome, totalExpenses);
    updateTransactionCount(transactionCount);
    
    // 2. Prepare data for Monthly Comparison Chart
    const monthlySummary = {};
    const sourceData = currentFilters.month === 'all' ? data : fullDataset;
    
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
 * Populate category filter options
 */
function populateCategoryFilter() {
    const categories = [...new Set(fullDataset.map(row => row['Categoria']).filter(Boolean))];
    const categoryFilter = document.getElementById('categoryFilter');
    
    // Clear existing options except "all"
    categoryFilter.innerHTML = '<option value="all">Todas las categorías</option>';
    
    // Add category options
    categories.sort().forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

/**
 * Main function to initialize the dashboard.
 */
async function initializeDashboard() {
    try {
        // Initialize systems
        initializeThemeSystem();
        initializeExportSystem();
        initializeClearFilters();
        
        // Set up chart filter callback
        setChartFilterCallback(applyFilters);
        
        // Load data
        fullDataset = await fetchData(GOOGLE_SHEET_API_URL);
        filteredDataset = [...fullDataset];
        
        // Initialize UI
        hideLoader();
        populateMonthFilter(fullDataset, (month) => {
            currentFilters.month = month;
            applyFilters();
        });
        populateCategoryFilter();
        initializeFilterSystem();
        
        // Initial render
        processAndRenderData();
        updateTransactionsTable(filteredDataset);
        
        // Add fade-in animation to cards
        document.querySelectorAll('.summary-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fade-in');
        });
        
    } catch (error) {
        console.error('Initialization failed:', error);
        showLoadingError('No se pudieron cargar los datos.', error.message);
    }
}

// Start the application once the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeDashboard);
