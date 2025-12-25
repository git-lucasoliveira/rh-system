/* * FUNCIONARIOS.JS
 * Lista de Colaboradores
 */

const API_URL = "http://localhost:8080/api"; 
let listaOriginal = [];

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicia carregamentos (O app.js já validou o acesso básico)
    carregarSetoresNoFiltro();
    carregarDados();
});

// --- CARREGAR DADOS ---
async function carregarDados() {
    const container = document.getElementById('conteudo-principal');
    const statusMsg = document.getElementById('status-msg');
    const token = localStorage.getItem('token');
    
    // Pequena verificação local de permissão para botões
    const userRole = obterRoleLocal(token);

    if(statusMsg) statusMsg.classList.remove('d-none');
    if(container) container.innerHTML = ""; 

    try {
        const res = await fetch(`${API_URL}/funcionarios`, { 
            headers: { 'Authorization': `Bearer ${token}` } 
        });

        if (!res.ok) throw new Error('Erro ao buscar dados');

        listaOriginal = await res.json();
        
        if(statusMsg) statusMsg.classList.add('d-none');
        
        mostrarNaTela(listaOriginal, userRole);

    } catch (erro) {
        console.error(erro);
        if(statusMsg) statusMsg.innerHTML = `<p class="text-danger text-center mt-3">Erro: ${erro.message}</p>`;
    }
}

// --- CARREGAR SETORES (FILTRO) ---
async function carregarSetoresNoFiltro() {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${API_URL}/setores`, { headers: { 'Authorization': `Bearer ${token}` } });
        if(res.ok) {
            const setores = await res.json();
            const select = document.getElementById('filtro-setor');
            if(select) {
                select.innerHTML = '<option value="">Todos os Setores</option>';
                setores.forEach(setor => {
                    const option = document.createElement('option');
                    option.value = setor.nome; 
                    option.textContent = setor.nome;
                    select.appendChild(option);
                });
            }
        }
    } catch (e) { console.error("Erro setores", e); }
}

// --- FILTRAGEM ---
function aplicarFiltros() {
    const texto = document.getElementById('filtro-texto').value.toLowerCase();
    const setorNome = document.getElementById('filtro-setor').value;
    const status = document.getElementById('filtro-status').value;

    const token = localStorage.getItem('token');
    const userRole = obterRoleLocal(token);

    const listaFiltrada = listaOriginal.filter(p => {
        const matchTexto = (p.nome && p.nome.toLowerCase().includes(texto)) || 
                           (p.email && p.email.toLowerCase().includes(texto)) ||
                           (p.cpf && p.cpf.includes(texto));

        let matchSetor = true;
        if (setorNome !== "") {
            matchSetor = p.setor && p.setor.nome === setorNome;
        }

        let matchStatus = true;
        if (status !== "") {
            matchStatus = String(p.ativo) === status;
        }

        return matchTexto && matchSetor && matchStatus;
    });

    mostrarNaTela(listaFiltrada, userRole);
}

function limparFiltros() {
    document.getElementById('filtro-texto').value = "";
    document.getElementById('filtro-setor').value = "";
    document.getElementById('filtro-status').value = "";
    aplicarFiltros();
}

// Debounce para filtro de texto
let filterTimeout;
function debounceFilter() {
    clearTimeout(filterTimeout);
    filterTimeout = setTimeout(aplicarFiltros, 300);
}

// --- RENDERIZAR CARDS (Design Moderno Showcase - OTIMIZADO) ---
function mostrarNaTela(lista, userRole) {
    const container = document.getElementById('conteudo-principal');
    container.innerHTML = "";

    if(lista.length === 0){
        container.innerHTML = '<div class="col-12 text-center text-white opacity-50 mt-5"><h5>Nenhum registro encontrado.</h5></div>';
        return;
    }

    // Usar DocumentFragment para melhor performance
    const fragment = document.createDocumentFragment();

    lista.forEach(p => {
        const nomeCargo = (p.cargo && typeof p.cargo === 'object') ? p.cargo.nome : (p.cargo || "-");
        const nomeSetor = (p.setor && typeof p.setor === 'object') ? p.setor.nome : (p.setor || "-");
        const isAtivo = p.ativo === true;

        // Badge moderno com ícone
        const badgeStatus = isAtivo
            ? '<span class="status-badge ativo"><i class="bi bi-check-circle-fill"></i> ATIVO</span>' 
            : '<span class="status-badge inativo"><i class="bi bi-x-circle-fill"></i> INATIVO</span>';

        // Botões de ação modernos
        const btnEditar = `<a href="funcionario-form.html?id=${p.id}" class="btn-action edit" title="Editar"><i class="bi bi-pencil-fill"></i></a>`;
        
        const btnStatus = `
            <button onclick="alterarStatus(${p.id}, ${isAtivo})" class="btn-action toggle" title="${isAtivo ? 'Inativar' : 'Ativar'}">
                <i class="bi bi-arrow-repeat"></i>
            </button>`;

        // Botão Excluir: Só SUPERADMIN vê
        let btnExcluir = '';
        if (userRole === 'SUPERADMIN') {
            btnExcluir = `
                <button onclick="excluirFuncionario(${p.id})" class="btn-action delete" title="Excluir">
                    <i class="bi bi-trash-fill"></i>
                </button>`;
        }

        const coluna = document.createElement('div');
        coluna.className = 'col-md-6 col-lg-4'; 
        
        coluna.innerHTML = `
            <div class="card-dashboard colaborador-card">
                <div class="text-center mb-3">
                    <div class="avatar-circle mx-auto">
                        <i class="bi bi-person-fill"></i>
                    </div>
                </div>
                
                <h5 class="text-white text-center mb-2">${p.nome || 'Sem Nome'}</h5>
                <p class="text-muted text-center small mb-3">
                    <i class="bi bi-envelope me-1"></i>
                    ${p.email || 'sem@email.com'}
                </p>
                
                <div class="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom border-secondary border-opacity-25">
                    <div>
                        <small class="text-muted d-block mb-1">Cargo</small>
                        <strong class="text-white small">${nomeCargo}</strong>
                    </div>
                    <div class="text-end">
                        <small class="text-muted d-block mb-1">Setor</small>
                        <strong class="text-white small">${nomeSetor}</strong>
                    </div>
                </div>
                
                <div class="d-flex justify-content-between align-items-center">
                    ${badgeStatus}
                    
                    <div class="d-flex gap-2">
                        ${btnEditar}
                        ${btnStatus}
                        ${btnExcluir}
                    </div>
                </div>
            </div>`;
        fragment.appendChild(coluna);
    });
    
    // Append tudo de uma vez (mais rápido)
    container.appendChild(fragment);
}

// --- AÇÕES ---
async function alterarStatus(id, statusAtual) {
    const acao = statusAtual ? 'inativar' : 'ativar';
    showConfirmModal(
        `Deseja ${acao} este colaborador?`,
        async () => {
            const token = localStorage.getItem('token');
            
            try {
                const resGet = await fetch(`${API_URL}/funcionarios/${id}`, {headers:{'Authorization':`Bearer ${token}`}});
                const funcionario = await resGet.json();
                
                console.log('Funcionário recebido do backend:', funcionario);
                
                // Extrair IDs corretamente (pode vir como funcionario.setor.id ou funcionario.setorId)
                const setorId = funcionario.setor?.id || funcionario.setorId;
                const cargoId = funcionario.cargo?.id || funcionario.cargoId;
                
                // Se os IDs ainda forem strings (nomes), precisamos buscar do listaOriginal
                const func = listaOriginal.find(f => f.id === id);
                const setorIdFinal = (typeof setorId === 'number') ? setorId : func?.setor?.id;
                const cargoIdFinal = (typeof cargoId === 'number') ? cargoId : func?.cargo?.id;
                
                // Formatar objeto corretamente para enviar ao backend
                const funcionarioAtualizado = {
                    nome: funcionario.nome,
                    cpf: funcionario.cpf,
                    email: funcionario.email,
                    dataAdmissao: funcionario.dataAdmissao,
                    ativo: !statusAtual,
                    setor: { id: setorIdFinal },
                    cargo: { id: cargoIdFinal }
                };

                console.log('Enviando para backend:', funcionarioAtualizado);

                const resPut = await fetch(`${API_URL}/funcionarios/${id}`, {
                    method: 'PUT',
                    headers: {'Authorization':`Bearer ${token}`,'Content-Type':'application/json'},
                    body: JSON.stringify(funcionarioAtualizado)
                });

                if(resPut.ok) {
                    showSuccess(`Colaborador ${acao === 'ativar' ? 'ativado' : 'inativado'} com sucesso!`);
                    carregarDados();
                } else {
                    const erro = await resPut.text();
                    console.error('Erro do backend:', erro);
                    showError(`Erro ao atualizar: ${erro}`);
                }

            } catch(e) {
                console.error('Erro completo:', e);
                showError("Erro de conexão");
            }
        },
        `${statusAtual ? 'Inativar' : 'Ativar'} Colaborador`
    );
}

async function excluirFuncionario(id) {
    showConfirmModal(
        'Deseja realmente excluir este colaborador permanentemente? Esta ação não pode ser desfeita.',
        async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`${API_URL}/funcionarios/${id}`, {
                    method: 'DELETE', 
                    headers:{'Authorization':`Bearer ${token}`}
                });
                if(res.ok) {
                    showSuccess('Colaborador excluído com sucesso!');
                    carregarDados();
                } else {
                    showError("Erro ao excluir. Verifique permissões.");
                }
            } catch(e) {
                console.error(e);
                showError("Erro de conexão");
            }
        },
        'Excluir Colaborador'
    );
}

// Helper local apenas para decidir botões
function obterRoleLocal(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const nomeUser = payload.nome || payload.sub || "";
        
        let role = payload.perfil || payload.role || "USER";
        role = String(role).replace('ROLE_', '').toUpperCase();

        if (nomeUser === 'lucas' || nomeUser === 'admin') role = 'SUPERADMIN';
        return role;
    } catch (e) { return "USER"; }
}