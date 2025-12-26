const API_URL = "http://localhost:8080/api";

document.addEventListener('DOMContentLoaded', () => {
    // Foca apenas em carregar os setores
    carregarSetores();
});

async function carregarSetores() {
    const container = document.getElementById('lista-setores');
    
    if (!container) {
        console.error('Elemento lista-setores não encontrado!');
        return;
    }

    container.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="text-muted mt-3">Carregando setores...</p>
        </div>
    `;

    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/setores`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if(!res.ok) throw new Error("Erro ao buscar setores");
        
        const lista = await res.json();
        renderizarSetores(lista);

    } catch (error) {
        console.error(error);
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger" role="alert">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    Erro ao carregar setores. Tente novamente.
                </div>
            </div>
        `;
    }
}

function renderizarSetores(lista) {
    const container = document.getElementById('lista-setores');
    
    if (!container) return;
    
    container.innerHTML = "";

    if(lista.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="card-dashboard p-5 text-center">
                    <i class="bi bi-inbox display-1 text-muted mb-3"></i>
                    <h4 class="text-white mb-2">Nenhum setor cadastrado</h4>
                    <p class="text-muted mb-4">Cadastre o primeiro setor para começar.</p>
                    <a href="setor-form.html" class="btn btn-star-primary">
                        <i class="bi bi-plus-lg me-2"></i>Cadastrar Setor
                    </a>
                </div>
            </div>
        `;
        return;
    }

    lista.forEach(setor => {
        const col = document.createElement('div');
        col.className = 'col-md-4 col-lg-3';
        col.innerHTML = `
            <div class="card card-dashboard h-100 p-4 border-0 shadow-sm text-center">
                <div class="card-body d-flex flex-column align-items-center justify-content-center">
                    
                    <div class="card-icon mb-4" style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);">
                        <i class="bi bi-buildings-fill"></i>
                    </div>

                    <h5 class="fw-bold text-white mb-3">${setor.nome}</h5>
                    <span class="badge bg-white bg-opacity-10 text-white border border-secondary mb-3">ID: #${setor.id}</span>

                    <div class="d-flex gap-2 justify-content-center mt-auto">
                        <a href="setor-form.html?id=${setor.id}" class="btn-action edit" title="Editar">
                            <i class="bi bi-pencil-fill"></i>
                        </a>
                        <button onclick="excluirSetor(${setor.id})" class="btn-action delete" title="Excluir">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </div>

                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

async function excluirSetor(id) {
    showConfirmModal(
        'Deseja realmente excluir este setor? Esta ação não pode ser desfeita.',
        async () => {
            const token = localStorage.getItem('token');
            
            try {
                const res = await fetch(`${API_URL}/setores/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if(res.ok) {
                    showSuccess('Setor excluído com sucesso!');
                    carregarSetores();
                } else {
                    showError('Erro ao excluir setor. Pode estar em uso por funcionários.');
                }
            } catch(e) {
                console.error(e);
                showError('Erro de conexão ao excluir setor.');
            }
        },
        'Excluir Setor'
    );
}