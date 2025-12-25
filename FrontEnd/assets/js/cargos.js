const API_URL = "http://localhost:8080/api";

document.addEventListener('DOMContentLoaded', () => {
    // O app.js já verificou o token e carregou a navbar.
    // Aqui só precisamos buscar os dados.
    carregarCargos();
});

async function carregarCargos() {
    const container = document.getElementById('conteudo-principal');
    const statusMsg = document.getElementById('status-msg');
    
    if(statusMsg) statusMsg.classList.remove('d-none');
    if(container) container.innerHTML = "";

    try {
        const token = localStorage.getItem('token');
        // Se o token não existir aqui, o fetch falha e tratamos no catch
        
        const res = await fetch(`${API_URL}/cargos`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if(!res.ok) throw new Error("Erro ao buscar cargos");
        
        const lista = await res.json();

        if(statusMsg) statusMsg.classList.add('d-none');
        renderizarCargos(lista);

    } catch (error) {
        console.error(error);
        if(statusMsg) statusMsg.innerHTML = `<p class="text-danger">Erro ao carregar: ${error.message}</p>`;
    }
}

function renderizarCargos(lista) {
    const container = document.getElementById('conteudo-principal');
    container.innerHTML = "";
    
    if(lista.length === 0) {
        container.innerHTML = '<div class="col-12 text-center text-white opacity-50">Nenhum cargo cadastrado.</div>';
        return;
    }

    lista.forEach(cargo => {
        const col = document.createElement('div');
        col.className = 'col-md-4 col-lg-3';
        col.innerHTML = `
            <div class="card card-dashboard h-100 p-4 border-0 shadow-sm text-center">
                <div class="card-body d-flex flex-column align-items-center justify-content-center">
                    
                    <div class="card-icon mb-4" style="background: var(--star-gradient-gold);">
                        <i class="bi bi-briefcase-fill"></i>
                    </div>

                    <h5 class="fw-bold text-white mb-3">${cargo.nome}</h5>
                    <span class="badge bg-white bg-opacity-10 text-white border border-secondary mb-3">ID: #${cargo.id}</span>

                    <div class="d-flex gap-2 justify-content-center mt-auto">
                        <a href="cargo-form.html?id=${cargo.id}" class="btn-action edit" title="Editar">
                            <i class="bi bi-pencil-fill"></i>
                        </a>
                        <button onclick="excluirCargo(${cargo.id})" class="btn-action delete" title="Excluir">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </div>

                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

async function excluirCargo(id) {
    showConfirmModal(
        'Deseja realmente excluir este cargo? Esta ação não pode ser desfeita.',
        async () => {
            const token = localStorage.getItem('token');
            
            try {
                const res = await fetch(`${API_URL}/cargos/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if(res.ok) {
                    showSuccess('Cargo excluído com sucesso!');
                    carregarCargos();
                } else {
                    showError('Erro ao excluir cargo. Pode estar em uso por funcionários.');
                }
            } catch(e) {
                console.error(e);
                showError('Erro de conexão ao excluir cargo.');
            }
        },
        'Excluir Cargo'
    );
}