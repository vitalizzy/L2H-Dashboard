/**
 * UI management functions for the dashboard
 */

/**
 * Format currency for display
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2
    }).format(amount);
}

/**
 * Update the summary cards with calculated totals
 * @param {number} totalIncome - Total income amount
 * @param {number} totalExpenses - Total expenses amount
 */
export function updateSummaryCards(totalIncome, totalExpenses) {
    const netBalance = totalIncome - totalExpenses;
    
    // Update income card
    const incomeElement = document.getElementById('totalIncome');
    if (incomeElement) {
        incomeElement.innerHTML = formatCurrency(totalIncome);
        incomeElement.classList.add('fade-in');
    }
    
    // Update expenses card
    const expensesElement = document.getElementById('totalExpenses');
    if (expensesElement) {
        expensesElement.innerHTML = formatCurrency(totalExpenses);
        expensesElement.classList.add('fade-in');
    }
    
    // Update net balance card
    const netBalanceElement = document.getElementById('netBalance');
    if (netBalanceElement) {
        netBalanceElement.innerHTML = formatCurrency(netBalance);
        netBalanceElement.classList.add('fade-in');
        
        // Add color coding for positive/negative balance
        netBalanceElement.className = netBalanceElement.className.replace(/text-\w+-600|text-\w+-400/g, '');
        if (netBalance >= 0) {
            netBalanceElement.classList.add('text-green-600', 'dark:text-green-400');
        } else {
            netBalanceElement.classList.add('text-red-600', 'dark:text-red-400');
        }
    }
}

/**
 * Update transaction count card
 * @param {number} count - Number of transactions
 */
export function updateTransactionCount(count) {
    const countElement = document.getElementById('transactionCount');
    if (countElement) {
        countElement.innerHTML = count.toLocaleString('es-ES');
        countElement.classList.add('fade-in');
    }
}

/**
 * Populate the month filter dropdown with available months
 * @param {Array} data - Full dataset
 * @param {Function} callback - Callback function when month is selected
 */
export function populateMonthFilter(data, callback) {
    const monthFilter = document.getElementById('monthFilter');
    if (!monthFilter) return;
    
    // Clear existing options
    monthFilter.innerHTML = '';
    
    // Add "All months" option
    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = 'Todos los meses';
    monthFilter.appendChild(allOption);
    
    // Get unique months and sort them
    const months = [...new Set(data.map(row => row['Mes Ano']).filter(Boolean))].sort();
    
    // Add month options
    months.forEach(month => {
        const option = document.createElement('option');
        option.value = month;
        option.textContent = month;
        monthFilter.appendChild(option);
    });
    
    // Add event listener
    monthFilter.addEventListener('change', (e) => {
        callback(e.target.value);
    });
}

/**
 * Show loading error message
 * @param {string} title - Error title
 * @param {string} message - Error message
 */
export function showLoadingError(title, message) {
    const loadingContainer = document.getElementById('loading-container');
    if (loadingContainer) {
        loadingContainer.innerHTML = `
            <div class="text-center">
                <div class="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                    <i class="fas fa-exclamation-triangle text-red-600 dark:text-red-400 text-2xl"></i>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">${title}</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-4">${message}</p>
                <button onclick="location.reload()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    <i class="fas fa-redo mr-2"></i>Reintentar
                </button>
            </div>
        `;
    }
}

/**
 * Hide the loading container
 */
export function hideLoader() {
    const loadingContainer = document.getElementById('loading-container');
    if (loadingContainer) {
        loadingContainer.style.display = 'none';
    }
}

/**
 * Show a notification toast
 * @param {string} message - Message to display
 * @param {string} type - Type of notification ('success', 'error', 'warning', 'info')
 * @param {number} duration - Duration in milliseconds (default: 3000)
 */
export function showNotification(message, type = 'info', duration = 3000) {
    // Create notification container if it doesn't exist
    let notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.className = 'fixed top-4 right-4 z-50 space-y-2';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification slide-in p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300`;
    
    // Set colors based on type
    const colors = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        warning: 'bg-yellow-500 text-white',
        info: 'bg-blue-500 text-white'
    };
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    notification.className += ` ${colors[type]}`;
    
    notification.innerHTML = `
        <div class="flex items-center space-x-3">
            <i class="${icons[type]}"></i>
            <span class="flex-1">${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="text-white hover:text-gray-200">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Auto remove after duration
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, duration);
}

/**
 * Show loading skeleton for cards
 */
export function showLoadingSkeleton() {
    const cards = document.querySelectorAll('.summary-card');
    cards.forEach(card => {
        const valueElement = card.querySelector('[id^="total"]');
        if (valueElement) {
            valueElement.innerHTML = '<div class="skeleton h-8 w-24 rounded"></div>';
        }
    });
}

/**
 * Hide loading skeleton
 */
export function hideLoadingSkeleton() {
    const skeletons = document.querySelectorAll('.skeleton');
    skeletons.forEach(skeleton => {
        skeleton.remove();
    });
}

/**
 * Add smooth scroll to element
 * @param {string} elementId - ID of element to scroll to
 */
export function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/**
 * Toggle fullscreen mode for charts
 * @param {string} chartId - ID of chart to toggle
 */
export function toggleChartFullscreen(chartId) {
    const chartContainer = document.getElementById(chartId);
    if (!chartContainer) return;
    
    if (chartContainer.classList.contains('fullscreen')) {
        chartContainer.classList.remove('fullscreen');
        chartContainer.classList.remove('fixed', 'inset-0', 'z-50', 'bg-white', 'dark:bg-gray-900');
    } else {
        chartContainer.classList.add('fullscreen', 'fixed', 'inset-0', 'z-50', 'bg-white', 'dark:bg-gray-900');
    }
}

/**
 * Add chart fullscreen toggle buttons
 */
export function addChartFullscreenButtons() {
    const chartContainers = document.querySelectorAll('.chart-container');
    chartContainers.forEach(container => {
        const canvas = container.querySelector('canvas');
        if (canvas) {
            const button = document.createElement('button');
            button.className = 'absolute top-2 right-2 p-2 bg-gray-800 bg-opacity-50 hover:bg-opacity-75 text-white rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100';
            button.innerHTML = '<i class="fas fa-expand"></i>';
            button.onclick = () => toggleChartFullscreen(canvas.id);
            
            container.classList.add('group', 'relative');
            container.appendChild(button);
        }
    });
}
