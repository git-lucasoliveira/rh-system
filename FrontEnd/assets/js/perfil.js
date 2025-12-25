// perfil.js
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) return; // app.js redireciona

    carregarCardPerfil(token);

    const formSenha = document.getElementById('form-senha');
    if(formSenha) {
        formSenha.addEventListener('submit', alterarSenha);
    }
});

function carregarCardPerfil(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const nomeUser = payload.nome || payload.sub || "Usuário";
        
        let role = payload.perfil || payload.role || "USER";
        role = String(role).replace('ROLE_', '').toUpperCase();

        if (nomeUser === 'lucas' || nomeUser === 'admin') role = 'SUPERADMIN';

        // --- PREENCHE APENAS O CARD DA PÁGINA (A navbar é com o app.js) ---
        
        // Nome grande no card
        const elNome = document.getElementById('perfil-login');
        if(elNome) elNome.innerText = nomeUser;
        
        // Input desabilitado
        const elInput = document.getElementById('input-login');
        if(elInput) elInput.value = nomeUser;
        
        // Badge do card
        const badge = document.getElementById('perfil-role-badge');
        if(badge) {
            badge.innerText = role;
            if (role === 'SUPERADMIN') {
                badge.className = 'badge bg-warning text-dark border border-warning fw-bold';
            }
        }

    } catch (e) { console.error(e); }
}

async function alterarSenha(e) {
    e.preventDefault();
    
    const nova = document.getElementById('novaSenha').value;
    const confirma = document.getElementById('confirmaSenha').value;
    const btn = document.getElementById('btn-salvar');

    if (nova !== confirma) {
        showWarning("As senhas não coincidem!");
        return;
    }

    if (nova.length < 3) {
        showWarning("A senha deve ter no mínimo 3 caracteres!");
        return;
    }

    setButtonLoading(btn, true);

    // Mock: Simulação de troca de senha
    setTimeout(() => {
        showSuccess("Senha alterada com sucesso!");
        document.getElementById('form-senha').reset();
        setButtonLoading(btn, false);
    }, 1000);
}

function mostrarMsg(texto, tipo) {
    // Função legada mantida para compatibilidade
    const div = document.getElementById('msg-feedback');
    if(div) {
        div.className = `alert alert-${tipo} text-center`;
        div.innerText = texto;
        div.classList.remove('d-none');
        setTimeout(() => div.classList.add('d-none'), 3000);
    }
}