import { formatCurrency } from './ui.js';

// Store chart instances to be able to destroy them later
let monthlyChart, expenseChart, topExpensesChart;

/**
 * Renders all charts on the dashboard.
 * @param {object} monthlyData - Data for the monthly comparison chart.
 * @param {object} expenseCategoryData - Data for the expense distribution chart.
 * @param {object} topExpensesData - Data for the top 5 expenses chart.
 */
export function renderCharts(monthlyData, expenseCategoryData, topExpensesData) {
    // Destroy existing charts if they exist to prevent memory leaks
    if (monthlyChart) monthlyChart.destroy();
    if (expenseChart) expenseChart.destroy();
    if (topExpensesChart) topExpensesChart.destroy();

    const commonTooltipCallback = {
        label: function(context) {
            let label = context.dataset.label || context.label || '';
            if (label) { label += ': '; }
            let value = context.parsed.y ?? context.parsed.x ?? context.parsed;
            if (value !== null) {
                label += formatCurrency(value);
            }
            return label;
        }
    };

    // 1. Monthly Income vs Expenses Chart
    monthlyChart = new Chart(document.getElementById('monthlyComparisonChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: monthlyData.labels,
            datasets: [
                { label: 'Ingresos', data: monthlyData.income, backgroundColor: 'rgba(34, 197, 94, 0.7)' },
                { label: 'Gastos', data: monthlyData.expenses, backgroundColor: 'rgba(239, 68, 68, 0.7)' }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { callback: (v) => formatCurrency(v) } } }, plugins: { tooltip: { callbacks: commonTooltipCallback } } }
    });

    // 2. Expense Distribution Chart
    expenseChart = new Chart(document.getElementById('expenseDistributionChart').getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: expenseCategoryData.labels,
            datasets: [{
                label: 'Gastos por Categoría',
                data: expenseCategoryData.values,
                backgroundColor: ['#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ef4444', '#f59e0b', '#14b8a6', '#6366f1', '#d946ef', '#6b7280'],
                hoverOffset: 4
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' }, tooltip: { callbacks: commonTooltipCallback } } }
    });

    // 3. Top 5 Expense Categories Chart
    topExpensesChart = new Chart(document.getElementById('topExpensesChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: topExpensesData.labels,
            datasets: [{
                label: 'Total Gastado',
                data: topExpensesData.values,
                backgroundColor: ['rgba(59, 130, 246, 0.7)', 'rgba(16, 185, 129, 0.7)', 'rgba(249, 115, 22, 0.7)', 'rgba(139, 92, 246, 0.7)', 'rgba(239, 68, 68, 0.7)']
            }]
        },
        options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: commonTooltipCallback } }, scales: { x: { beginAtZero: true, ticks: { callback: (v) => formatCurrency(v) } } } }
    });
}
