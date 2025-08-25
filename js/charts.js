import { formatCurrency } from './ui.js';
import { getCurrentTheme } from './theme.js';

// Store chart instances to be able to destroy them later
let monthlyChart, expenseChart, topExpensesChart;

// Store current chart filters
let chartFilters = {
    selectedMonth: null,
    selectedCategory: null
};

// Callback function to update filters from charts
let updateFiltersCallback = null;

/**
 * Set the callback function for updating filters
 * @param {Function} callback - Function to call when chart filters change
 */
export function setChartFilterCallback(callback) {
    updateFiltersCallback = callback;
}

/**
 * Get chart colors based on current theme
 * @returns {Object} Color configuration
 */
function getChartColors() {
    const isDark = getCurrentTheme() === 'dark';
    
    return {
        background: isDark ? '#1f2937' : '#ffffff',
        text: isDark ? '#f9fafb' : '#374151',
        grid: isDark ? '#374151' : '#e5e7eb',
        border: isDark ? '#4b5563' : '#d1d5db',
        income: '#10b981',
        expense: '#ef4444',
        colors: [
            '#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ef4444',
            '#f59e0b', '#14b8a6', '#6366f1', '#d946ef', '#6b7280'
        ]
    };
}

/**
 * Get common chart options
 * @returns {Object} Common options
 */
function getCommonOptions() {
    const colors = getChartColors();
    
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: colors.text,
                    font: {
                        family: 'Inter',
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: colors.background,
                titleColor: colors.text,
                bodyColor: colors.text,
                borderColor: colors.border,
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: true,
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || context.label || '';
                        if (label) { label += ': '; }
                        let value = context.parsed.y ?? context.parsed.x ?? context.parsed;
                        if (value !== null) {
                            label += formatCurrency(value);
                        }
                        return label;
                    }
                }
            }
        }
    };
}

/**
 * Handle chart click events for filtering
 * @param {Event} event - Click event
 * @param {Array} elements - Chart elements
 * @param {string} chartType - Type of chart ('monthly', 'expense', 'top')
 */
function handleChartClick(event, elements, chartType) {
    if (elements.length === 0) return;
    
    const element = elements[0];
    const index = element.index;
    const datasetIndex = element.datasetIndex;
    
    if (chartType === 'monthly') {
        // Monthly chart - filter by month
        const monthLabels = monthlyChart.data.labels;
        const clickedMonth = monthLabels[index];
        
        if (chartFilters.selectedMonth === clickedMonth) {
            // If same month clicked again, clear filter
            chartFilters.selectedMonth = null;
        } else {
            chartFilters.selectedMonth = clickedMonth;
        }
        
        // Update month filter dropdown
        const monthFilter = document.getElementById('monthFilter');
        if (monthFilter) {
            monthFilter.value = chartFilters.selectedMonth || 'all';
        }
        
    } else if (chartType === 'expense') {
        // Expense distribution chart - filter by category
        const categoryLabels = expenseChart.data.labels;
        const clickedCategory = categoryLabels[index];
        
        if (chartFilters.selectedCategory === clickedCategory) {
            // If same category clicked again, clear filter
            chartFilters.selectedCategory = null;
        } else {
            chartFilters.selectedCategory = clickedCategory;
        }
        
        // Update category filter dropdown
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.value = chartFilters.selectedCategory || 'all';
        }
        
    } else if (chartType === 'top') {
        // Top expenses chart - filter by category
        const categoryLabels = topExpensesChart.data.labels;
        const clickedCategory = categoryLabels[index];
        
        if (chartFilters.selectedCategory === clickedCategory) {
            // If same category clicked again, clear filter
            chartFilters.selectedCategory = null;
        } else {
            chartFilters.selectedCategory = clickedCategory;
        }
        
        // Update category filter dropdown
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.value = chartFilters.selectedCategory || 'all';
        }
    }
    
    // Call the callback to update filters
    if (updateFiltersCallback) {
        updateFiltersCallback();
    }
    
    // Update chart colors to show selection
    updateChartSelection(chartType);
}

/**
 * Update chart colors to show selected elements
 * @param {string} chartType - Type of chart
 */
function updateChartSelection(chartType) {
    const colors = getChartColors();
    
    if (chartType === 'monthly' && monthlyChart) {
        const datasets = monthlyChart.data.datasets;
        const labels = monthlyChart.data.labels;
        
        datasets.forEach(dataset => {
            dataset.backgroundColor = labels.map((label, index) => {
                if (label === chartFilters.selectedMonth) {
                    return dataset.borderColor + 'CC'; // More opaque for selected
                }
                return dataset.borderColor + '80'; // Normal opacity
            });
        });
        
        monthlyChart.update('none');
        
    } else if (chartType === 'expense' && expenseChart) {
        const dataset = expenseChart.data.datasets[0];
        const labels = expenseChart.data.labels;
        
        dataset.backgroundColor = labels.map((label, index) => {
            if (label === chartFilters.selectedCategory) {
                return colors.colors[index % colors.colors.length] + 'CC'; // More opaque for selected
            }
            return colors.colors[index % colors.colors.length]; // Normal opacity
        });
        
        expenseChart.update('none');
        
    } else if (chartType === 'top' && topExpensesChart) {
        const dataset = topExpensesChart.data.datasets[0];
        const labels = topExpensesChart.data.labels;
        
        dataset.backgroundColor = labels.map((label, index) => {
            if (label === chartFilters.selectedCategory) {
                return colors.colors[index % colors.colors.length] + 'CC'; // More opaque for selected
            }
            return colors.colors[index % colors.colors.length] + '80'; // Normal opacity
        });
        
        topExpensesChart.update('none');
    }
}

/**
 * Clear all chart selections
 */
export function clearChartSelections() {
    chartFilters.selectedMonth = null;
    chartFilters.selectedCategory = null;
    
    // Reset chart colors
    if (monthlyChart) {
        const datasets = monthlyChart.data.datasets;
        datasets.forEach(dataset => {
            dataset.backgroundColor = dataset.borderColor + '80';
        });
        monthlyChart.update('none');
    }
    
    if (expenseChart) {
        const colors = getChartColors();
        const dataset = expenseChart.data.datasets[0];
        const labels = expenseChart.data.labels;
        dataset.backgroundColor = labels.map((label, index) => 
            colors.colors[index % colors.colors.length]
        );
        expenseChart.update('none');
    }
    
    if (topExpensesChart) {
        const colors = getChartColors();
        const dataset = topExpensesChart.data.datasets[0];
        const labels = topExpensesChart.data.labels;
        dataset.backgroundColor = labels.map((label, index) => 
            colors.colors[index % colors.colors.length] + '80'
        );
        topExpensesChart.update('none');
    }
}

/**
 * Renders all charts on the dashboard.
 * @param {object} monthlyData - Data for the monthly comparison chart.
 * @param {object} expenseCategoryData - Data for the expense distribution chart.
 * @param {object} topExpensesData - Data for the top 5 expenses chart.
 */
export function renderCharts(monthlyData, expenseCategoryData, topExpensesData) {
    const colors = getChartColors();
    
    // Destroy existing charts if they exist to prevent memory leaks
    if (monthlyChart) monthlyChart.destroy();
    if (expenseChart) expenseChart.destroy();
    if (topExpensesChart) topExpensesChart.destroy();

    // Create chart containers if they don't exist
    createChartContainers();

    // 1. Monthly Income vs Expenses Chart
    monthlyChart = new Chart(document.getElementById('monthlyComparisonChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: monthlyData.labels,
            datasets: [
                {
                    label: 'Ingresos',
                    data: monthlyData.income,
                    backgroundColor: colors.income + '80',
                    borderColor: colors.income,
                    borderWidth: 2,
                    borderRadius: 6,
                    borderSkipped: false,
                },
                {
                    label: 'Gastos',
                    data: monthlyData.expenses,
                    backgroundColor: colors.expense + '80',
                    borderColor: colors.expense,
                    borderWidth: 2,
                    borderRadius: 6,
                    borderSkipped: false,
                }
            ]
        },
        options: {
            ...getCommonOptions(),
            onClick: (event, elements) => handleChartClick(event, elements, 'monthly'),
            onHover: (event, elements) => {
                event.native.target.style.cursor = elements.length ? 'pointer' : 'default';
            },
            scales: {
                x: {
                    grid: {
                        color: colors.grid,
                        drawBorder: false
                    },
                    ticks: {
                        color: colors.text,
                        font: {
                            family: 'Inter',
                            size: 11
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: colors.grid,
                        drawBorder: false
                    },
                    ticks: {
                        color: colors.text,
                        font: {
                            family: 'Inter',
                            size: 11
                        },
                        callback: (value) => formatCurrency(value)
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                ...getCommonOptions().plugins,
                title: {
                    display: true,
                    text: 'Comparación Mensual: Ingresos vs Gastos (Clic para filtrar)',
                    color: colors.text,
                    font: {
                        family: 'Inter',
                        size: 16,
                        weight: '600'
                    },
                    padding: 20
                }
            }
        }
    });

    // 2. Expense Distribution Chart (Doughnut)
    expenseChart = new Chart(document.getElementById('expenseDistributionChart').getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: expenseCategoryData.labels,
            datasets: [{
                label: 'Gastos por Categoría',
                data: expenseCategoryData.values,
                backgroundColor: colors.colors,
                borderColor: colors.background,
                borderWidth: 2,
                hoverOffset: 8,
                cutout: '60%'
            }]
        },
        options: {
            ...getCommonOptions(),
            onClick: (event, elements) => handleChartClick(event, elements, 'expense'),
            onHover: (event, elements) => {
                event.native.target.style.cursor = elements.length ? 'pointer' : 'default';
            },
            plugins: {
                ...getCommonOptions().plugins,
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                title: {
                    display: true,
                    text: 'Distribución de Gastos por Categoría (Clic para filtrar)',
                    color: colors.text,
                    font: {
                        family: 'Inter',
                        size: 16,
                        weight: '600'
                    },
                    padding: 20
                }
            }
        }
    });

    // 3. Top 5 Expense Categories Chart (Horizontal Bar)
    topExpensesChart = new Chart(document.getElementById('topExpensesChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: topExpensesData.labels,
            datasets: [{
                label: 'Total Gastado',
                data: topExpensesData.values,
                backgroundColor: colors.colors.slice(0, 5).map(color => color + '80'),
                borderColor: colors.colors.slice(0, 5),
                borderWidth: 2,
                borderRadius: 4,
                borderSkipped: false,
            }]
        },
        options: {
            ...getCommonOptions(),
            onClick: (event, elements) => handleChartClick(event, elements, 'top'),
            onHover: (event, elements) => {
                event.native.target.style.cursor = elements.length ? 'pointer' : 'default';
            },
            indexAxis: 'y',
            plugins: {
                ...getCommonOptions().plugins,
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Top 5 Categorías de Gastos (Clic para filtrar)',
                    color: colors.text,
                    font: {
                        family: 'Inter',
                        size: 16,
                        weight: '600'
                    },
                    padding: 20
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        color: colors.grid,
                        drawBorder: false
                    },
                    ticks: {
                        color: colors.text,
                        font: {
                            family: 'Inter',
                            size: 11
                        },
                        callback: (value) => formatCurrency(value)
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: colors.text,
                        font: {
                            family: 'Inter',
                            size: 11
                        }
                    }
                }
            }
        }
    });

    // 4. Trend Chart (Line chart for income/expense trends)
    if (monthlyData.labels.length > 1) {
        renderTrendChart(monthlyData, colors);
    }
}

/**
 * Create chart containers in the grid
 */
function createChartContainers() {
    const chartsGrid = document.getElementById('charts-grid');
    
    // Clear existing content
    chartsGrid.innerHTML = '';
    
    // Create chart containers
    const chartContainers = [
        { id: 'monthlyComparisonChart', title: 'Comparación Mensual', span: 'lg:col-span-8' },
        { id: 'expenseDistributionChart', title: 'Distribución de Gastos', span: 'lg:col-span-4' },
        { id: 'topExpensesChart', title: 'Top 5 Gastos', span: 'lg:col-span-6' },
        { id: 'trendChart', title: 'Tendencia de Ingresos y Gastos', span: 'lg:col-span-6' }
    ];
    
    chartContainers.forEach(container => {
        const chartDiv = document.createElement('div');
        chartDiv.className = `${container.span} chart-container fade-in`;
        chartDiv.innerHTML = `
            <canvas id="${container.id}"></canvas>
        `;
        chartsGrid.appendChild(chartDiv);
    });
}

/**
 * Render trend chart
 * @param {Object} monthlyData - Monthly data
 * @param {Object} colors - Color configuration
 */
function renderTrendChart(monthlyData, colors) {
    const trendChartElement = document.getElementById('trendChart');
    if (!trendChartElement) return;
    
    const trendChart = new Chart(trendChartElement.getContext('2d'), {
        type: 'line',
        data: {
            labels: monthlyData.labels,
            datasets: [
                {
                    label: 'Ingresos',
                    data: monthlyData.income,
                    borderColor: colors.income,
                    backgroundColor: colors.income + '20',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: colors.income,
                    pointBorderColor: colors.background,
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                },
                {
                    label: 'Gastos',
                    data: monthlyData.expenses,
                    borderColor: colors.expense,
                    backgroundColor: colors.expense + '20',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: colors.expense,
                    pointBorderColor: colors.background,
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }
            ]
        },
        options: {
            ...getCommonOptions(),
            onClick: (event, elements) => handleChartClick(event, elements, 'monthly'),
            onHover: (event, elements) => {
                event.native.target.style.cursor = elements.length ? 'pointer' : 'default';
            },
            scales: {
                x: {
                    grid: {
                        color: colors.grid,
                        drawBorder: false
                    },
                    ticks: {
                        color: colors.text,
                        font: {
                            family: 'Inter',
                            size: 11
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: colors.grid,
                        drawBorder: false
                    },
                    ticks: {
                        color: colors.text,
                        font: {
                            family: 'Inter',
                            size: 11
                        },
                        callback: (value) => formatCurrency(value)
                    }
                }
            },
            plugins: {
                ...getCommonOptions().plugins,
                title: {
                    display: true,
                    text: 'Tendencia de Ingresos y Gastos (Clic para filtrar)',
                    color: colors.text,
                    font: {
                        family: 'Inter',
                        size: 16,
                        weight: '600'
                    },
                    padding: 20
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

/**
 * Update chart colors when theme changes
 */
export function updateChartColors() {
    // Re-render charts with new colors
    if (monthlyChart || expenseChart || topExpensesChart) {
        // This will be called from theme.js when theme changes
        // The charts will be re-rendered with new colors
    }
}
