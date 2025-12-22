const API_URL = "http://localhost:8080/api";

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }
    carregarInfoUsuario(token); // Atualiza Navbar
    carregarSetores(); // Busca dados
});

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

// Mesma lógica de usuário (Bypass) das outras telas
function carregarInfoUsuario(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const nome = payload.nome || payload.sub || "Usuário";
        document.getElementById('user-name').innerText = nome;

        let role = "USER";
        if(nome === 'lucas' || nome === 'admin') role = 'SUPERADMIN';
        
        const badge = document.getElementById('user-role');
        if(badge) {
            badge.innerText = role;
            badge.className = role === 'SUPERADMIN' ? 'badge bg-warning text-dark fw-bold ms-auto' : 'badge bg-secondary text-white ms-auto';
        }
    } catch(e){ console.error(e); }
}

async function carregarSetores() {
    const container = document.getElementById('conteudo-principal');
    const statusMsg = document.getElementById('status-msg');
    
    if(statusMsg) statusMsg.classList.remove('d-none');
    if(container) container.innerHTML = "";

    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/setores`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if(!res.ok) throw new Error("Erro ao buscar setores");
        const lista = await res.json();

        if(statusMsg) statusMsg.classList.add('d-none');
        renderizarSetores(lista);

    } catch (error) {
        console.error(error);
        if(statusMsg) statusMsg.innerHTML = `<p class="text-danger">Erro: ${error.message}</p>`;
    }
}

function renderizarSetores(lista) {
    const container = document.getElementById('conteudo-principal');
    
    if(lista.length === 0) {
        container.innerHTML = '<div class="col-12 text-center text-white opacity-50">Nenhum setor cadastrado.</div>';
        return;
    }

    lista.forEach(setor => {
        const col = document.createElement('div');
        col.className = 'col-md-4 col-lg-3';
        col.innerHTML = `
            <div class="card card-dashboard h-100 p-4 border-0 shadow-sm text-center">
                <div class="card-body d-flex flex-column align-items-center justify-content-center">
                    
                    <div class="rounded-circle bg-dark d-flex align-items-center justify-content-center mb-3 shadow-lg" 
                         style="width: 60px; height: 60px; border: 1px solid var(--star-primary);">
                        <i class="bi bi-buildings-fill fs-3 text-white"></i>
                    </div>

                    <h5 class="fw-bold text-white mb-2">${setor.nome}</h5>
                    <span class="badge bg-white bg-opacity-10 text-white border border-secondary">ID: #${setor.id}</span>

                </div>
            </div>
        `;
        container.appendChild(col);
    });
}