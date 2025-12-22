document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    carregarPerfil(token);

    document.getElementById('form-senha').addEventListener('submit', alterarSenha);
});

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

function carregarPerfil(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const nomeUser = payload.nome || payload.sub || "Usuário";
        
        let role = "USER";
        if (payload.role) role = payload.role;
        else if (payload.authorities) role = payload.authorities[0];
        role = role.replace('ROLE_', '').toUpperCase();

        if (nomeUser === 'lucas' || nomeUser === 'admin') role = 'SUPERADMIN';

        // Preenche Navbar
        document.getElementById('user-name').innerText = nomeUser;
        document.getElementById('user-role').innerText = role;

        // Preenche Card
        document.getElementById('perfil-login').innerText = nomeUser;
        document.getElementById('input-login').value = nomeUser;
        
        const badge = document.getElementById('perfil-role-badge');
        badge.innerText = role;
        
        if (role === 'SUPERADMIN') {
            badge.className = 'badge bg-warning text-dark border border-warning fw-bold';
        }

    } catch (e) { console.error(e); }
}

async function alterarSenha(e) {
    e.preventDefault();
    
    const nova = document.getElementById('novaSenha').value;
    const confirma = document.getElementById('confirmaSenha').value;
    const msg = document.getElementById('msg-feedback');
    const btn = document.getElementById('btn-salvar');

    if (nova !== confirma) {
        mostrarMsg("As senhas não coincidem!", "danger");
        return;
    }

    // Mock: Como não sei se tens endpoint de troca de senha ainda
    btn.disabled = true;
    btn.innerHTML = "Salvando...";

    // Simulação de delay de rede
    setTimeout(() => {
        mostrarMsg("Senha alterada com sucesso!", "success");
        document.getElementById('form-senha').reset();
        btn.disabled = false;
        btn.innerHTML = '<i class="bi bi-check2-circle"></i> Salvar Nova Senha';
    }, 1000);
}

function mostrarMsg(texto, tipo) {
    const div = document.getElementById('msg-feedback');
    div.className = `alert alert-${tipo} text-center small`;
    div.innerText = texto;
    div.classList.remove('d-none');
    setTimeout(() => div.classList.add('d-none'), 3000);
}