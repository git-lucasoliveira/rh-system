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
    const container = document.getElementById('tbody-logs');
    
    if (!container) {
        console.error('Elemento tbody-logs não encontrado!');
        return;
    }

    container.innerHTML = `
        <tr>
            <td colspan="5" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="text-muted mt-3">Carregando logs...</p>
            </td>
        </tr>
    `;

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

        if(logs.length === 0) {
            container.innerHTML = '<tr><td colspan="5" class="text-center text-muted p-4">Nenhum registro de auditoria encontrado.</td></tr>';
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
                <td class="text-muted">${log.entidade || '-'}</td>
                <td class="text-muted">${log.detalhes || '-'}</td>
            `;
            container.appendChild(tr);
        });

    } catch (e) {
        console.error("Falha ao buscar logs:", e);
        container.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4">
                    <div class="alert alert-danger d-inline-block" role="alert">
                        <i class="bi bi-exclamation-triangle me-2"></i>
                        Erro ao carregar dados: ${e.message}
                    </div>
                </td>
            </tr>
        `;
    }
}