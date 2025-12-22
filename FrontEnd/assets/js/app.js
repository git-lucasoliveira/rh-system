const API_URL = "http://localhost:8080/api"; 

// Variável para guardar os dados originais
let listaOriginal = [];

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    const userRole = carregarInfoUsuario(token);
    
    // 1. Carrega os setores para o Select
    carregarSetoresNoFiltro(token);
    
    // 2. Carrega a lista de funcionários
    carregarDados(userRole);
});

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

// --- INFO USUÁRIO E BYPASS SUPERADMIN ---
function carregarInfoUsuario(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const nomeUser = payload.nome || payload.sub || "Usuário";
        document.getElementById('user-name').innerText = nomeUser;

        let role = "USER";
        if (payload.role) role = payload.role;
        else if (payload.authorities) role = payload.authorities[0];
        role = role.replace('ROLE_', '').toUpperCase();

        // BYPASS: Se for lucas ou admin, vira SUPERADMIN
        if (nomeUser === 'lucas' || nomeUser === 'admin') role = 'SUPERADMIN';

        const badge = document.getElementById('user-role');
        if(badge) {
            badge.innerText = role;
            badge.className = role === 'SUPERADMIN' 
                ? 'badge bg-warning text-dark fw-bold ms-auto' 
                : 'badge bg-secondary text-white ms-auto';
        }
        return role;
    } catch (e) { return "USER"; }
}

// --- CARREGAR DADOS ---
async function carregarDados(userRole) {
    const container = document.getElementById('conteudo-principal');
    const statusMsg = document.getElementById('status-msg');
    
    if(statusMsg) statusMsg.classList.remove('d-none');
    if(container) container.innerHTML = ""; 

    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/funcionarios`, { 
            headers: { 'Authorization': `Bearer ${token}` } 
        });

        if (!res.ok) throw new Error('Erro ' + res.status);

        // SALVA NA MEMÓRIA GLOBAL
        listaOriginal = await res.json();
        
        if(statusMsg) statusMsg.classList.add('d-none');
        
        // Renderiza tudo inicialmente
        mostrarNaTela(listaOriginal, userRole);

    } catch (erro) {
        console.error(erro);
        if(statusMsg) statusMsg.innerHTML = `<p class="text-danger">Erro: ${erro.message}</p>`;
    }
}

// --- CARREGAR SETORES NO SELECT ---
// --- 1. CARREGAMENTO DOS SETORES (CORRIGIDO PARA USAR O NOME) ---
async function carregarSetoresNoFiltro(token) {
    try {
        const res = await fetch(`${API_URL}/setores`, { headers: { 'Authorization': `Bearer ${token}` } });
        const setores = await res.json();
        const select = document.getElementById('filtro-setor');
        
        select.innerHTML = '<option value="">Todos os Setores</option>';

        setores.forEach(setor => {
            const option = document.createElement('option');
            // MUDANÇA AQUI: Usamos o NOME como valor, pois é isso que temos no funcionário
            option.value = setor.nome; 
            option.textContent = setor.nome;
            select.appendChild(option);
        });
    } catch (e) { console.error("Erro ao carregar setores", e); }
}

// --- 2. LÓGICA DE FILTRAGEM (CORRIGIDA PARA TEXTO) ---
function aplicarFiltros() {
    const texto = document.getElementById('filtro-texto').value.toLowerCase();
    const setorNomeSelecionado = document.getElementById('filtro-setor').value; // Agora vem "VENDAS", "TI"...
    const status = document.getElementById('filtro-status').value;

    const token = localStorage.getItem('token');
    const userRole = carregarInfoUsuario(token);

    const listaFiltrada = listaOriginal.filter(p => {
        // 1. Filtro Texto
        const matchTexto = (p.nome && p.nome.toLowerCase().includes(texto)) || 
                           (p.email && p.email.toLowerCase().includes(texto)) ||
                           (p.cpf && p.cpf.includes(texto));

        // 2. Filtro Setor (COMPARANDO TEXTO AGORA)
        let matchSetor = true;
        if (setorNomeSelecionado !== "") {
            // Se o funcionário não tem setor, falha
            if (!p.setor) {
                matchSetor = false;
            } else {
                // Compara o texto "VENDAS" com "VENDAS"
                matchSetor = p.setor === setorNomeSelecionado;
            }
        }

        // 3. Filtro Status
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
    aplicarFiltros(); // Re-aplica filtros vazios (mostra tudo)
}

// --- RENDERIZAR CARDS ---
function obterTexto(dado) {
    if (!dado) return "-";
    if (typeof dado === 'string') return dado;
    if (dado.nome) return dado.nome;
    return "-";
}

function mostrarNaTela(lista, userRole) {
    const container = document.getElementById('conteudo-principal');
    container.innerHTML = "";

    if(lista.length === 0){
        container.innerHTML = '<div class="col-12 text-center text-white opacity-50 mt-5"><h5>Nenhum registro encontrado.</h5></div>';
        return;
    }

    lista.forEach(p => {
        const nomeSetor = obterTexto(p.setor);
        const nomeCargo = obterTexto(p.cargo);
        const isAtivo = p.ativo === true;

        const badgeStatus = isAtivo
            ? '<span class="badge bg-success bg-opacity-25 text-success border border-success">ATIVO</span>' 
            : '<span class="badge bg-danger bg-opacity-25 text-danger border border-danger">INATIVO</span>';

        const btnEditar = `<a href="funcionario-form.html?id=${p.id}" class="btn btn-outline-warning btn-sm" title="Editar"><i class="bi bi-pencil"></i></a>`;
        
        const btnStatus = `
            <button onclick="alterarStatus(${p.id}, ${isAtivo})" class="btn ${isAtivo ? 'btn-outline-danger' : 'btn-outline-success'} btn-sm" title="${isAtivo ? 'Inativar' : 'Ativar'}">
                <i class="bi ${isAtivo ? 'bi-slash-circle' : 'bi-check-circle'}"></i>
            </button>`;

        let btnExcluir = '';
        if (userRole === 'SUPERADMIN') {
            btnExcluir = `
                <button onclick="excluirFuncionario(${p.id})" class="btn btn-outline-secondary btn-sm ms-1" title="Excluir">
                    <i class="bi bi-trash"></i>
                </button>`;
        }

        const coluna = document.createElement('div');
        coluna.className = 'col-md-6 col-lg-3'; // 4 cards por linha em tela grande
        
        coluna.innerHTML = `
            <div class="card card-dashboard h-100 p-3 border-0 shadow-sm">
                <div class="card-body text-center d-flex flex-column align-items-center">
                    
                    <div class="rounded-circle bg-dark d-flex align-items-center justify-content-center mb-3 shadow-lg" 
                         style="width: 70px; height: 70px; border: 2px solid var(--star-primary);">
                        <i class="bi bi-person-fill fs-2 text-white"></i>
                    </div>

                    <h6 class="card-title fw-bold text-white mb-1 w-100" 
                        style="min-height: 40px; display: flex; align-items: center; justify-content: center; font-size: 0.95rem;">
                        ${p.nome}
                    </h6>
                    
                    <small class="text-white opacity-50 mb-3 w-100 text-truncate" style="font-size: 0.75rem;">
                        ${p.email}
                    </small>
                    
                    <div class="w-100 mb-3 bg-white bg-opacity-10 rounded p-2">
                        <span class="d-block fw-bold text-white small mb-1 text-truncate" title="${nomeCargo}">
                            ${nomeCargo}
                        </span>
                        <small class="text-uppercase text-warning opacity-75 fw-bold" style="font-size: 0.7em;">
                            ${nomeSetor}
                        </small>
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
async function alterarStatus(id, s) {
    if(!confirm("Alterar status?")) return;
    const token = localStorage.getItem('token');
    try {
        const r = await fetch(`${API_URL}/funcionarios/${id}`, {headers:{'Authorization':`Bearer ${token}`}});
        const o = await r.json();
        o.ativo = !s;
        await fetch(`${API_URL}/funcionarios/${id}`, {method:'PUT', headers:{'Authorization':`Bearer ${token}`,'Content-Type':'application/json'}, body:JSON.stringify(o)});
        location.reload(); // Recarrega para aplicar filtro se necessário
    } catch(e){console.error(e);}
}
async function excluirFuncionario(id) {
    if(!confirm("Excluir permanentemente?")) return;
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/funcionarios/${id}`, {method:'DELETE', headers:{'Authorization':`Bearer ${token}`}});
    location.reload();
}