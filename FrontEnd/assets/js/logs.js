// logs.js - Auditoria
const API_URL = "http://localhost:8080/api";

document.addEventListener('DOMContentLoaded', () => {
    // O app.js já garantiu a autenticação
    const token = localStorage.getItem('token');
    if(token) {
        carregarLogs(token);
    }
});

async function carregarLogs(token) {
    const container = document.getElementById('lista-logs');
    const loading = document.getElementById('loading');
    const tabela = document.getElementById('tabela-container');

    try {
        const res = await fetch(`${API_URL}/logs`, { 
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            } 
        });

        if(!res.ok) throw new Error(`Erro API: ${res.status}`);

        const logs = await res.json();

        if(loading) loading.classList.add('d-none');
        if(tabela) tabela.classList.remove('d-none');

        if(logs.length === 0) {
            container.innerHTML = '<tr><td colspan="3" class="text-center text-muted p-4">Nenhum registro de auditoria encontrado.</td></tr>';
            return;
        }

        container.innerHTML = '';

        logs.forEach(log => {
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
        if(loading) loading.innerHTML = `<p class="text-danger">Erro ao carregar dados: ${e.message}</p>`;
    }
}