/**
 * Pure JavaScript Financial Engine
 * Dynamic Balances, Filtering & Category CSS Chart Rendering
 */
document.addEventListener('DOMContentLoaded', () => {
    checkAuthGuard();
    renderFinancialOverview();
    renderTransactions();
    renderCategoryBreakdown();
});

function renderFinancialOverview() {
    const transactions = JSON.parse(localStorage.getItem('sda_transactions')) || [];
    const openingBalance = 75000;

    const approved = transactions.filter(t => t.status === 'approved');
    const totalIncome = approved.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpense = approved.filter(t => t.type === 'expenditure').reduce((s, t) => s + t.amount, 0);
    const currentBalance = openingBalance + totalIncome - totalExpense;

    document.getElementById('openingBalance').innerText = `KSh ${openingBalance.toLocaleString()}`;
    document.getElementById('totalIncome').innerText = `KSh ${totalIncome.toLocaleString()}`;
    document.getElementById('totalExpense').innerText = `KSh ${totalExpense.toLocaleString()}`;
    document.getElementById('currentBalance').innerText = `KSh ${currentBalance.toLocaleString()}`;
}

function renderTransactions(filterCat = 'ALL') {
    const transactions = JSON.parse(localStorage.getItem('sda_transactions')) || [];
    const approved = transactions.filter(t => t.status === 'approved');
    const tbody = document.getElementById('txnTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    approved.forEach(t => {
        if (filterCat !== 'ALL' && t.category !== filterCat) return;

        const tr = document.createElement('tr');
        const amountColor = t.type === 'income' ? '#2E7D32' : '#E53935';
        const sign = t.type === 'income' ? '+' : '-';

        tr.innerHTML = `
      <td>${t.date}</td>
      <td>${t.description}</td>
      <td><span class="badge">${t.category}</span></td>
      <td style="color: ${amountColor}; font-weight: bold;">${sign}KSh ${t.amount.toLocaleString()}</td>
    `;
        tbody.appendChild(tr);
    });
}

function filterTransactions() {
    const category = document.getElementById('categoryFilter').value;
    renderTransactions(category);
}

function renderCategoryBreakdown() {
    const transactions = JSON.parse(localStorage.getItem('sda_transactions')) || [];
    const approvedExpenses = transactions.filter(t => t.status === 'approved' && t.type === 'expenditure');
    const totalExpense = approvedExpenses.reduce((s, t) => s + t.amount, 0);

    const container = document.getElementById('categoryChartContainer');
    if (!container) return;
    container.innerHTML = '';

    if (totalExpense === 0) {
        container.innerHTML = '<p>No expense data available.</p>';
        return;
    }

    // Aggregate by Category
    const categories = {};
    approvedExpenses.forEach(t => {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
    });

    for (const [cat, val] of Object.entries(categories)) {
        const percentage = Math.round((val / totalExpense) * 100);
        const itemHtml = `
      <div class="chart-bar-container">
        <div class="chart-bar-label">
          <span>${cat} (KSh ${val.toLocaleString()})</span>
          <span>${percentage}%</span>
        </div>
        <div class="chart-bar-bg">
          <div class="chart-bar-fill" style="width: ${percentage}%;"></div>
        </div>
      </div>
    `;
        container.innerHTML += itemHtml;
    }
}