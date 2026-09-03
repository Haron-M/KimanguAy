/**
 * Admin & Treasurer Workflows + Audit Logging
 */
document.addEventListener('DOMContentLoaded', () => {
    const user = checkAuthGuard();
    renderPendingTransactions();
    renderAuditLogs();

    const txnForm = document.getElementById('createTxnForm');
    if (txnForm) {
        txnForm.addEventListener('submit', handleCreateTransaction);
    }
});

function renderPendingTransactions() {
    const transactions = JSON.parse(localStorage.getItem('sda_transactions')) || [];
    const pending = transactions.filter(t => t.status === 'pending');
    const list = document.getElementById('pendingTxnList');
    if (!list) return;

    list.innerHTML = '';
    if (pending.length === 0) {
        list.innerHTML = '<p>No pending transactions to review.</p>';
        return;
    }

    pending.forEach(t => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
      <h4>${t.description} (${t.type.toUpperCase()})</h4>
      <p>Amount: <strong>KSh ${t.amount.toLocaleString()}</strong> | Category: ${t.category} | Date: ${t.date}</p>
      <div style="margin-top: 10px;">
        <button onclick="processTxn('${t.id}', 'approved')" class="btn btn-primary">Approve</button>
        <button onclick="processTxn('${t.id}', 'rejected')" class="btn btn-danger">Reject</button>
      </div>
    `;
        list.appendChild(card);
    });
}

function handleCreateTransaction(e) {
    e.preventDefault();
    const user = getCurrentUser();
    const transactions = JSON.parse(localStorage.getItem('sda_transactions')) || [];

    const newTxn = {
        id: 'TXN' + (transactions.length + 1).toString().padStart(3, '0'),
        date: document.getElementById('txnDate').value,
        description: document.getElementById('txnDesc').value,
        category: document.getElementById('txnCat').value,
        amount: parseFloat(document.getElementById('txnAmount').value),
        type: document.getElementById('txnType').value,
        status: 'pending',
        createdBy: user.name,
        approvedBy: null
    };

    transactions.push(newTxn);
    localStorage.setItem('sda_transactions', JSON.stringify(transactions));

    addAuditLog(user.name, `Submitted new ${newTxn.type}: KSh ${newTxn.amount} (${newTxn.description})`);
    alert('Transaction submitted for Admin Approval!');
    location.reload();
}

function processTxn(id, newStatus) {
    const user = getCurrentUser();
    let transactions = JSON.parse(localStorage.getItem('sda_transactions')) || [];

    transactions = transactions.map(t => {
        if (t.id === id) {
            t.status = newStatus;
            t.approvedBy = user.name;
        }
        return t;
    });

    localStorage.setItem('sda_transactions', JSON.stringify(transactions));
    addAuditLog(user.name, `${newStatus.toUpperCase()} Transaction ID: ${id}`);
    renderPendingTransactions();
}

function addAuditLog(userName, actionStr) {
    const logs = JSON.parse(localStorage.getItem('sda_audit_logs')) || [];
    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${now.getHours()}:${now.getMinutes()}`;

    logs.unshift({ timestamp: timeStr, user: userName, action: actionStr });
    localStorage.setItem('sda_audit_logs', JSON.stringify(logs));
}

function renderAuditLogs() {
    const logs = JSON.parse(localStorage.getItem('sda_audit_logs')) || [];
    const container = document.getElementById('auditLogContainer');
    if (!container) return;

    container.innerHTML = logs.map(l => `
    <div style="padding: 8px 0; border-bottom: 1px solid #eee;">
      <small style="color: #666;">[${l.timestamp}]</small> <strong>${l.user}</strong>: ${l.action}
    </div>
  `).join('');
}