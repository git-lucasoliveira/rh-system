// notifications.js - Sistema de Toasts e Modais Modernos

// ========== TOASTS (Notificações) ==========
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    
    const icons = {
        success: 'bi-check-circle-fill',
        error: 'bi-x-circle-fill',
        warning: 'bi-exclamation-triangle-fill',
        info: 'bi-info-circle-fill'
    };
    
    toast.innerHTML = `
        <i class="bi ${icons[type]}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Animação de entrada (requestAnimationFrame para melhor performance)
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
    });
    
    // Remove após duração
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 200);
    }, duration);
}

// Atalhos
function showSuccess(message) {
    showToast(message, 'success');
}

function showError(message) {
    showToast(message, 'error', 4000);
}

function showWarning(message) {
    showToast(message, 'warning');
}

function showInfo(message) {
    showToast(message, 'info');
}

// ========== MODAL DE CONFIRMAÇÃO ==========
function showConfirmModal(message, onConfirm, title = 'Confirmar ação') {
    // Remove modal anterior se existir
    const existingModal = document.getElementById('confirmModal');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.id = 'confirmModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">
                    <i class="bi bi-exclamation-triangle-fill text-warning"></i>
                    ${title}
                </h5>
            </div>
            <div class="modal-body">
                <p>${message}</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline-secondary" onclick="closeConfirmModal()">
                    <i class="bi bi-x-lg"></i> Cancelar
                </button>
                <button class="btn btn-star-primary" id="confirmBtn">
                    <i class="bi bi-check2"></i> Confirmar
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animação de entrada (otimizada)
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            modal.classList.add('show');
        });
    });
    
    // Event listeners
    document.getElementById('confirmBtn').addEventListener('click', () => {
        onConfirm();
        closeConfirmModal();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeConfirmModal();
    });
}

function closeConfirmModal() {
    const modal = document.getElementById('confirmModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 200);
    }
}

// ========== VALIDAÇÕES ==========
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }
    
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digito1 = resto >= 10 ? 0 : resto;
    
    if (digito1 !== parseInt(cpf.charAt(9))) return false;
    
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digito2 = resto >= 10 ? 0 : resto;
    
    return digito2 === parseInt(cpf.charAt(10));
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validarCampoObrigatorio(valor) {
    return valor && valor.trim().length > 0;
}

// ========== LOADING STATE ==========
function setButtonLoading(button, loading = true) {
    if (loading) {
        button.dataset.originalText = button.innerHTML;
        button.disabled = true;
        button.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processando...';
    } else {
        button.disabled = false;
        button.innerHTML = button.dataset.originalText;
    }
}
