/**
 * Populates Dashboard with metrics & quick features
 */
document.addEventListener('DOMContentLoaded', () => {
    const user = checkAuthGuard();

    const welcomeText = document.getElementById('welcomeHeading');
    if (welcomeText) {
        welcomeText.innerText = `Good morning, ${user.name} 👋 (${user.role})`;
    }

    calculateDashboardFinances();
});

function calculateDashboardFinances() {
    const transactions = JSON.parse(localStorage.getItem('sda_transactions')) || [];
    const openingBalance = 75000;

    const approved = transactions.filter(t => t.status === 'approved');
    const income = approved.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = approved.filter(t => t.type === 'expenditure').reduce((sum, t) => sum + t.amount, 0);

    const currentBalance = openingBalance + income - expense;

    const balanceDisplay = document.getElementById('dashBalance');
    if (balanceDisplay) {
        balanceDisplay.innerText = `KSh ${currentBalance.toLocaleString()}`;
    }
}