/* * FUNCIONARIOS.JS
 * Lógica específica da tela de Lista de Colaboradores
 */

const API_URL = "http://localhost:8080/api"; 
let listaOriginal = [];

document.addEventListener('DOMContentLoaded', () => {
    // Verifica token (se não tiver, o app.js já vai ter tratado, mas garantimos aqui)
    const token = localStorage.getItem('token');
    if (!token) return;

    // 1. Descobrir permissão para desenhar os botões certos
    const userRole = obterRoleDoToken(token);

    // 2. Iniciar carregamentos
    carregarSetoresNoFiltro(token);
    carregarDados(token, userRole);
});

// Função auxiliar para ler o cargo (Repetimos aqui para uso local na renderização)
function obterRoleDoToken(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const nomeUser = payload.nome || payload.sub || "";
        
        let role = payload.perfil || payload.role || (payload.authorities ? payload.authorities[0] : "USER");
        role = role.replace('ROLE_', '').toUpperCase();

        // Bypass Lucas/Admin
        if (nomeUser === 'lucas' || nomeUser === 'admin') role = 'SUPERADMIN';
        
        return role;
    } catch (e) { return "USER"; }
}

// --- CARREGAR DADOS ---
async function carregarDados(token, userRole) {
    const container = document.getElementById('conteudo-principal');
    const statusMsg = document.getElementById('status-msg');
    
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
async function carregarSetoresNoFiltro(token) {
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

    // Recupera role para redesenhar os botões corretamente
    const token = localStorage.getItem('token');
    const userRole = obterRoleDoToken(token);

    const listaFiltrada = listaOriginal.filter(p => {
        const matchTexto = (p.nome && p.nome.toLowerCase().includes(texto)) || 
                           (p.email && p.email.toLowerCase().includes(texto)) ||
                           (p.cpf && p.cpf.includes(texto));

        let matchSetor = true;
        if (setorNome !== "") {
            matchSetor = p.setor && p.setor.nome === setorNome; // Ajustado para objeto setor
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

// --- RENDERIZAR CARDS ---
function mostrarNaTela(lista, userRole) {
    const container = document.getElementById('conteudo-principal');
    container.innerHTML = "";

    if(lista.length === 0){
        container.innerHTML = '<div class="col-12 text-center text-white opacity-50 mt-5"><h5>Nenhum registro encontrado.</h5></div>';
        return;
    }

    lista.forEach(p => {
        const nomeSetor = p.setor ? p.setor.nome : "-";
        const nomeCargo = p.cargo ? p.cargo.nome : "-";
        const isAtivo = p.ativo === true;

        const badgeStatus = isAtivo
            ? '<span class="badge bg-success bg-opacity-25 text-success border border-success">ATIVO</span>' 
            : '<span class="badge bg-danger bg-opacity-25 text-danger border border-danger">INATIVO</span>';

        // LÓGICA DE BOTÕES POR PERFIL
        
        // Editar: Todos veem (conforme sua regra)
        const btnEditar = `<a href="funcionario-form.html?id=${p.id}" class="btn btn-outline-warning btn-sm" title="Editar"><i class="bi bi-pencil"></i></a>`;
        
        // Status (Ativar/Inativar): Talvez queira restringir também, mas deixei padrão
        const btnStatus = `
            <button onclick="alterarStatus(${p.id}, ${isAtivo})" class="btn ${isAtivo ? 'btn-outline-danger' : 'btn-outline-success'} btn-sm" title="${isAtivo ? 'Inativar' : 'Ativar'}">
                <i class="bi ${isAtivo ? 'bi-slash-circle' : 'bi-check-circle'}"></i>
            </button>`;

        // Excluir: APENAS SUPERADMIN
        let btnExcluir = '';
        if (userRole === 'SUPERADMIN') {
            btnExcluir = `
                <button onclick="excluirFuncionario(${p.id})" class="btn btn-outline-secondary btn-sm ms-1" title="Excluir">
                    <i class="bi bi-trash"></i>
                </button>`;
        }

        const coluna = document.createElement('div');
        coluna.className = 'col-md-6 col-lg-3 mb-4'; 
        
        coluna.innerHTML = `
            <div class="card card-dashboard h-100 p-3 border-0 shadow-sm">
                <div class="card-body text-center d-flex flex-column align-items-center">
                    
                    <div class="rounded-circle bg-dark d-flex align-items-center justify-content-center mb-3 shadow-lg" 
                         style="width: 70px; height: 70px; border: 2px solid #6f42c1;">
                        <i class="bi bi-person-fill fs-2 text-white"></i>
                    </div>

                    <h6 class="card-title fw-bold text-white mb-1 w-100 text-truncate">${p.nome}</h6>
                    <small class="text-white opacity-50 mb-3 w-100 text-truncate">${p.email}</small>
                    
                    <div class="w-100 mb-3 bg-white bg-opacity-10 rounded p-2">
                        <span class="d-block fw-bold text-white small mb-1 text-truncate">${nomeCargo}</span>
                        <small class="text-uppercase text-warning opacity-75 fw-bold" style="font-size: 0.7em;">${nomeSetor}</small>
                    </div>

                    <div class="mt-auto w-100 d-flex justify-content-between align-items-center border-top border-secondary border-opacity-25 pt-3">
                        <div>${badgeStatus}</div>
                        <div class="d-flex gap-1">
                            ${btnEditar}${btnStatus}${btnExcluir}
                        </div>
                    </div>
                </div>
            </div>`;
        container.appendChild(coluna);
    });
}

// --- AÇÕES ---
async function alterarStatus(id, statusAtual) {
    if(!confirm("Deseja alterar o status deste colaborador?")) return;
    const token = localStorage.getItem('token');
    
    // Aqui assumo que o backend espera o objeto completo ou tem endpoint específico
    // Simplificando para buscar, inverter e salvar
    try {
        const resGet = await fetch(`${API_URL}/funcionarios/${id}`, {headers:{'Authorization':`Bearer ${token}`}});
        const funcionario = await resGet.json();
        
        funcionario.ativo = !statusAtual;

        const resPut = await fetch(`${API_URL}/funcionarios/${id}`, {
            method: 'PUT',
            headers: {'Authorization':`Bearer ${token}`,'Content-Type':'application/json'},
            body: JSON.stringify(funcionario)
        });

        if(resPut.ok) location.reload();
        else alert("Erro ao atualizar status");

    } catch(e){ console.error(e); }
}

async function excluirFuncionario(id) {
    if(!confirm("Excluir permanentemente este colaborador?")) return;
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${API_URL}/funcionarios/${id}`, {
            method: 'DELETE', 
            headers:{'Authorization':`Bearer ${token}`}
        });
        if(res.ok) location.reload();
        else alert("Erro ao excluir. Verifique permissões.");
    } catch(e) { console.error(e); }
}