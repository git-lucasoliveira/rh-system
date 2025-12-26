const API_URL = "http://localhost:8080/api";

document.addEventListener('DOMContentLoaded', () => {
    // O app.js já verificou o token e carregou a navbar.
    // Aqui só precisamos buscar os dados.
    carregarCargos();
});

async function carregarCargos() {
    const container = document.getElementById('lista-cargos');
    
    if (!container) {
        console.error('Elemento lista-cargos não encontrado!');
        return;
    }

    container.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="text-muted mt-3">Carregando cargos...</p>
        </div>
    `;

    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/cargos`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if(!res.ok) throw new Error("Erro ao buscar cargos");
        
        const lista = await res.json();
        renderizarCargos(lista);

    } catch (error) {
        console.error(error);
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger" role="alert">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    Erro ao carregar cargos. Tente novamente.
                </div>
            </div>
        `;
    }
}

function renderizarCargos(lista) {
    const container = document.getElementById('lista-cargos');
    
    if (!container) return;
    
    container.innerHTML = "";
    
    if(lista.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="card-dashboard p-5 text-center">
                    <i class="bi bi-inbox display-1 text-muted mb-3"></i>
                    <h4 class="text-white mb-2">Nenhum cargo cadastrado</h4>
                    <p class="text-muted mb-4">Cadastre o primeiro cargo para começar.</p>
                    <a href="cargo-form.html" class="btn btn-star-primary">
                        <i class="bi bi-plus-lg me-2"></i>Cadastrar Cargo
                    </a>
                </div>
            </div>
        `;
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