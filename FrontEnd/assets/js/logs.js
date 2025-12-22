const API_URL = "http://localhost:8080/api";

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    carregarInfoUsuario(token); // Atualiza navbar
    carregarLogs(token);
});

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

function carregarInfoUsuario(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const nome = payload.nome || payload.sub || "Usuário";
        document.getElementById('user-name').innerText = nome;
        
        // Lógica de Bypass para Superadmin
        let role = "USER";
        if(payload.role) role = payload.role;
        else if(payload.authorities) role = payload.authorities[0];
        role = role.replace('ROLE_', '').toUpperCase();

        if(nome === 'lucas' || nome === 'admin') role = 'SUPERADMIN';
        
        const roleEl = document.getElementById('user-role');
        if(roleEl) roleEl.innerText = role;

    } catch(e){ console.error(e); }
}

async function carregarLogs(token) {
    const container = document.getElementById('lista-logs');
    const loading = document.getElementById('loading');
    const tabela = document.getElementById('tabela-container');

    try {
        // --- CONEXÃO REAL COM O BACKEND ---
        const res = await fetch(`${API_URL}/logs`, { 
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            } 
        });

        if(!res.ok) {
            throw new Error(`Erro API: ${res.status}`);
        }

        const logs = await res.json();
        // ----------------------------------

        // Esconde Loading e Mostra Tabela
        loading.classList.add('d-none');
        tabela.classList.remove('d-none');

        // Se a lista estiver vazia
        if(logs.length === 0) {
            container.innerHTML = '<tr><td colspan="3" class="text-center text-muted p-4">Nenhum registro de auditoria encontrado.</td></tr>';
            return;
        }

        // Limpa a tabela antes de preencher
        container.innerHTML = '';

        // Preenche a tabela
        logs.forEach(log => {
            // Formatação de Data Segura
            let dataFmt = "-";
            if(log.dataHora) {
                const dataObj = new Date(log.dataHora);
                dataFmt = dataObj.toLocaleDateString('pt-BR') + ' ' + dataObj.toLocaleTimeString('pt-BR');
            }

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="text-muted small">${dataFmt}</td>
                <td>
                    <span class="badge bg-dark border border-secondary text-white fw-normal px-3 py-2">
                        <i class="bi bi-person me-1 opacity-50"></i> ${log.usuario || 'Sistema'}
                    </span>
                </td>
                <td class="text-white">${log.acao || '-'}</td>
            `;
            container.appendChild(tr);
        });

    } catch (e) {
        console.error("Falha ao buscar logs:", e);
        loading.innerHTML = `<p class="text-danger">Erro ao carregar dados: ${e.message}</p>`;
    }
}