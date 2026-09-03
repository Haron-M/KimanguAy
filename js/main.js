/**
 * Main application initializer and LocalStorage Data Store
 */
document.addEventListener('DOMContentLoaded', () => {
    initLocalStorage();
    setupMobileNav();
});

function initLocalStorage() {
    if (!localStorage.getItem('sda_users')) {
        const defaultUsers = [
            { id: 'USR001', name: 'John Doe', phone: '+254712345678', role: 'Youth', date: '2026-01-10' },
            { id: 'USR002', name: 'Sarah James', phone: '+254722000111', role: 'Ambassador', date: '2026-02-15' },
            { id: 'TREAS01', name: 'David Elder', phone: '+254733999888', role: 'Treasurer', date: '2025-11-01' },
            { id: 'ADMIN01', name: 'Pastor Paul', phone: '+254700000000', role: 'Administrator', date: '2025-01-01' }
        ];
        localStorage.setItem('sda_users', JSON.stringify(defaultUsers));
    }

    if (!localStorage.getItem('sda_transactions')) {
        const defaultTxns = [
            { id: 'TXN001', date: '2026-08-28', description: 'Youth Contribution', category: 'Contribution', amount: 10000, type: 'income', status: 'approved', createdBy: 'TREAS01', approvedBy: 'ADMIN01' },
            { id: 'TXN002', date: '2026-08-25', description: 'Transport to Youth Rally', category: 'Transport', amount: 5500, type: 'expenditure', status: 'approved', createdBy: 'TREAS01', approvedBy: 'ADMIN01' },
            { id: 'TXN003', date: '2026-08-20', description: 'Youth Sabbath Offering', category: 'Offering', amount: 7500, type: 'income', status: 'approved', createdBy: 'TREAS01', approvedBy: 'ADMIN01' },
            { id: 'TXN004', date: '2026-08-18', description: 'Sound Equipment Cables', category: 'Equipment', amount: 6000, type: 'expenditure', status: 'approved', createdBy: 'TREAS01', approvedBy: 'ADMIN01' },
            { id: 'TXN005', date: '2026-08-15', description: 'Car Wash Fundraising', category: 'Fundraising', amount: 12000, type: 'income', status: 'approved', createdBy: 'TREAS01', approvedBy: 'ADMIN01' },
            { id: 'TXN006', date: '2026-08-12', description: 'Cornerstone Lesson Books', category: 'Bible Study', amount: 1500, type: 'expenditure', status: 'approved', createdBy: 'TREAS01', approvedBy: 'ADMIN01' },
            { id: 'TXN007', date: '2026-08-30', description: 'Community Welfare Support', category: 'Community Service', amount: 4500, type: 'expenditure', status: 'pending', createdBy: 'TREAS01', approvedBy: null }
        ];
        localStorage.setItem('sda_transactions', JSON.stringify(defaultTxns));
    }

    if (!localStorage.getItem('sda_prayers')) {
        const defaultPrayers = [
            { id: 1, author: 'Mercy N.', text: 'Pray for my upcoming university exams next week.', count: 5, date: '2026-08-29' },
            { id: 2, author: 'Anonymous', text: 'Praying for my family’s health and spiritual growth.', count: 12, date: '2026-08-31' }
        ];
        localStorage.setItem('sda_prayers', JSON.stringify(defaultPrayers));
    }

    if (!localStorage.getItem('sda_audit_logs')) {
        localStorage.setItem('sda_audit_logs', JSON.stringify([
            { timestamp: '2026-08-28 10:32', user: 'Treasurer David', action: 'Created Transaction TXN001 (KSh 10,000)' },
            { timestamp: '2026-08-28 11:15', user: 'Admin Pastor Paul', action: 'Approved Transaction TXN001' }
        ]));
    }
}

function setupMobileNav() {
    const toggleBtn = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const sidebar = document.querySelector('.sidebar');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            if (navLinks) navLinks.classList.toggle('active');
            if (sidebar) sidebar.classList.toggle('mobile-open');
        });
    }
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('sda_currentUser'));
}

function checkAuthGuard() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
    }
    return user;
}