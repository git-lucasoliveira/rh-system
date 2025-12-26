/* * FUNCIONARIOS.JS
 * Lista de Colaboradores
 */

const API_URL = "http://localhost:8080/api";

let funcionarios = [];
let setores = [];

document.addEventListener('DOMContentLoaded', async () => {
    await carregarSetores();
    await carregarDados();
    
    // Event listeners para filtros
    document.getElementById('filtro-nome')?.addEventListener('input', aplicarFiltros);
    document.getElementById('filtro-setor')?.addEventListener('change', aplicarFiltros);
    document.getElementById('filtro-status')?.addEventListener('change', aplicarFiltros);
});

async function carregarSetores() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_URL}/setores`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            setores = await response.json();
            preencherFiltroSetores();
        }
    } catch (error) {
        console.error('Erro ao carregar setores:', error);
    }
}

async function carregarDados() {
    const token = localStorage.getItem('token');
    const listaContainer = document.getElementById('lista-funcionarios');
    
    if (!listaContainer) {
        console.error('Elemento lista-funcionarios não encontrado!');
        return;
    }

    listaContainer.innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Carregando...</span>
            </div>
            <p class="text-muted mt-3">Carregando colaboradores...</p>
        </div>
    `;

    try {
        const response = await fetch(`${API_URL}/funcionarios`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            funcionarios = await response.json();
            mostrarNaTela(funcionarios);
        } else if (response.status === 401 || response.status === 403) {
            showError('Sessão expirada. Faça login novamente');
            localStorage.clear();
            window.location.href = 'index.html';
        } else {
            throw new Error('Erro ao carregar dados');
        }
    } catch (error) {
        console.error('Erro:', error);
        listaContainer.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <i class="bi bi-exclamation-triangle me-2"></i>
                Erro ao carregar colaboradores. Tente novamente.
            </div>
        `;
    }
}

function preencherFiltroSetores() {
    const selectSetor = document.getElementById('filtro-setor');
    if (!selectSetor) return;

    selectSetor.innerHTML = '<option value="">Todos os Setores</option>';
    
    setores.forEach(setor => {
        const option = document.createElement('option');
        option.value = setor.id;
        option.textContent = setor.nome;
        selectSetor.appendChild(option);
    });
}

function aplicarFiltros() {
    const filtroNome = document.getElementById('filtro-nome')?.value.toLowerCase() || '';
    const filtroSetor = document.getElementById('filtro-setor')?.value || '';
    const filtroStatus = document.getElementById('filtro-status')?.value || '';

    const funcionariosFiltrados = funcionarios.filter(func => {
        const matchNome = func.nome.toLowerCase().includes(filtroNome);
        const matchSetor = !filtroSetor || func.setor.id == filtroSetor;
        const matchStatus = !filtroStatus || func.status === filtroStatus;

        return matchNome && matchSetor && matchStatus;
    });

    mostrarNaTela(funcionariosFiltrados);
}

function mostrarNaTela(lista) {
    const listaContainer = document.getElementById('lista-funcionarios');
    
    if (!listaContainer) {
        console.error('Elemento lista-funcionarios não encontrado!');
        return;
    }

    if (lista.length === 0) {
        listaContainer.innerHTML = `
            <div class="card-dashboard p-5 text-center">
                <i class="bi bi-inbox display-1 text-muted mb-3"></i>
                <h4 class="text-white mb-2">Nenhum colaborador encontrado</h4>
                <p class="text-muted mb-4">Não há colaboradores cadastrados ou nenhum resultado corresponde aos filtros aplicados.</p>
                <a href="funcionario-form.html" class="btn btn-star-primary">
                    <i class="bi bi-person-plus me-2"></i>Cadastrar Primeiro Colaborador
                </a>
            </div>
        `;
        return;
    }

    let html = '<div class="row g-4">';

    lista.forEach(func => {
        const statusBadge = func.ativo === true || func.status === 'ATIVO'
            ? '<span class="badge bg-success">ATIVO</span>' 
            : '<span class="badge bg-danger">INATIVO</span>';

        html += `
            <div class="col-md-6 col-lg-4">
                <div class="card-dashboard h-100 p-4">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div class="card-icon" style="width: 60px; height: 60px; margin: 0;">
                            <i class="bi bi-person-fill" style="font-size: 1.5rem;"></i>
                        </div>
                        ${statusBadge}
                    </div>

                    <h5 class="text-white fw-bold mb-2">${func.nome}</h5>
                    
                    <div class="mb-3">
                        <small class="text-muted d-block mb-1">
                            <i class="bi bi-briefcase me-1"></i>${func.cargo?.nome || 'Sem cargo'}
                        </small>
                        <small class="text-muted d-block mb-1">
                            <i class="bi bi-building me-1"></i>${func.setor?.nome || 'Sem setor'}
                        </small>
                        <small class="text-muted d-block mb-1">
                            <i class="bi bi-envelope me-1"></i>${func.email}
                        </small>
                        <small class="text-muted d-block">
                            <i class="bi bi-phone me-1"></i>${func.telefone || 'Não informado'}
                        </small>
                    </div>

                    <div class="mt-3 pt-3 border-top border-secondary border-opacity-25">
                        <small class="text-muted d-block">
                            <i class="bi bi-calendar3 me-1"></i>Admissão: ${formatarData(func.dataAdmissao)}
                        </small>
                    </div>

                    <div class="d-flex gap-2 mt-4">
                        <a href="funcionario-form.html?id=${func.id}" class="btn btn-sm btn-star-outline flex-fill">
                            <i class="bi bi-pencil"></i>
                        </a>
                        <button onclick="confirmarExclusao(${func.id}, '${func.nome}')" 
                                class="btn btn-sm btn-outline-danger flex-fill">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    html += '</div>';
    listaContainer.innerHTML = html;
}

function formatarData(dataString) {
    if (!dataString) return 'N/A';
    const data = new Date(dataString + 'T00:00:00');
    return data.toLocaleDateString('pt-BR');
}

async function confirmarExclusao(id, nome) {
    if (confirm(`Deseja realmente excluir o colaborador "${nome}"?`)) {
        await excluirFuncionario(id);
    }
}

async function excluirFuncionario(id) {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${API_URL}/funcionarios/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            showSuccess('Colaborador excluído com sucesso!');
            await carregarDados();
        } else if (response.status === 401 || response.status === 403) {
            showError('Sessão expirada. Faça login novamente');
            localStorage.clear();
            window.location.href = 'index.html';
        } else {
            throw new Error('Erro ao excluir');
        }
    } catch (error) {
        console.error('Erro:', error);
        showError('Erro ao excluir colaborador');
    }
}