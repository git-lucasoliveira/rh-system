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
    const cardPerfil = document.getElementById('card-perfil');
    
    if (!cardPerfil) {
        console.error('Elemento card-perfil não encontrado!');
        return;
    }

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const nomeUser = payload.nome || payload.sub || "Usuário";
        const loginUser = payload.sub || nomeUser;
        
        let role = payload.perfil || payload.role || "RH";
        role = String(role).replace('ROLE_', '').toUpperCase();

        let badgeClass = 'badge bg-info';
        let badgeIcon = 'bi-people-fill';
        
        if (role === 'SUPERADMIN') {
            badgeClass = 'badge bg-warning text-dark';
            badgeIcon = 'bi-stars';
        } else if (role === 'TI') {
            badgeClass = 'badge bg-danger';
            badgeIcon = 'bi-pc-display';
        }

        cardPerfil.innerHTML = `
            <div class="text-center mb-4">
                <div class="card-icon" style="width: 100px; height: 100px; margin: 0 auto;">
                    <i class="bi bi-person-circle" style="font-size: 3rem;"></i>
                </div>
            </div>
            
            <div class="mb-3">
                <label class="form-label text-muted small">Nome de Usuário</label>
                <h4 class="text-white fw-bold">${nomeUser}</h4>
            </div>
            
            <div class="mb-3">
                <label class="form-label text-muted small">Login</label>
                <p class="text-white mb-0">${loginUser}</p>
            </div>
            
            <div class="mb-3">
                <label class="form-label text-muted small">Perfil de Acesso</label>
                <div>
                    <span class="${badgeClass}">
                        <i class="${badgeIcon} me-1"></i>${role}
                    </span>
                </div>
            </div>
        `;

    } catch (e) { 
        console.error(e);
        cardPerfil.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <i class="bi bi-exclamation-triangle me-2"></i>
                Erro ao carregar dados do perfil
            </div>
        `;
    }
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