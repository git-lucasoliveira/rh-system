const API_URL = "http://localhost:8080/api";
const token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', async () => {
    // Verifica autenticação
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    // 1. CARREGA AS LISTAS DE OPÇÕES (SETOR E CARGO)
    // O 'await' é essencial aqui para garantir que o select tenha opções antes de tentarmos selecionar um valor na edição
    await carregarSelects();

    // 2. VERIFICA SE ESTAMOS EM MODO DE EDIÇÃO
    const params = new URLSearchParams(window.location.search);
    const idEdicao = params.get('id');

    if (idEdicao) {
        // Se tem ID na URL, muda o título e busca os dados para preencher
        document.querySelector('h3').innerHTML = '<i class="bi bi-pencil-square text-warning"></i> Editar Colaborador';
        await carregarDadosEdicao(idEdicao);
    }

    // 3. CONFIGURA O ENVIO DO FORMULÁRIO
    const form = document.getElementById('form-funcionario');
    if (form) {
        form.addEventListener('submit', (e) => salvarFuncionario(e, idEdicao));
    }
});

// --- CARREGA OS SELECTS ---
async function carregarSelects() {
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
        // Busca setores e cargos em paralelo
        const [resSetores, resCargos] = await Promise.all([
            fetch(`${API_URL}/setores`, { headers }),
            fetch(`${API_URL}/cargos`, { headers })
        ]);

        const setores = await resSetores.json();
        const cargos = await resCargos.json();

        preencherSelect('setor', setores);
        preencherSelect('cargo', cargos);

    } catch (erro) {
        console.error("Erro ao carregar listas:", erro);
        mostrarMensagem("Erro ao carregar opções.", "danger");
    }
}

function preencherSelect(idElemento, lista) {
    const select = document.getElementById(idElemento);
    if (!select) return;

    select.innerHTML = '<option value="">Selecione...</option>';

    lista.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.nome;
        select.appendChild(option);
    });
}

// --- MODO EDIÇÃO: BUSCA E PREENCHE ---
async function carregarDadosEdicao(id) {
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
        const res = await fetch(`${API_URL}/funcionarios/${id}`, { headers });
        
        if (!res.ok) throw new Error("Erro ao buscar dados do funcionário");

        const func = await res.json();
        console.log("Editando:", func); // Debug no console

        // Preenche os inputs simples
        if(document.getElementById('nome')) document.getElementById('nome').value = func.nome;
        if(document.getElementById('cpf')) document.getElementById('cpf').value = func.cpf;
        if(document.getElementById('email')) document.getElementById('email').value = func.email;

        // Data: Backend manda "2024-10-10T00:00:00", input quer "2024-10-10"
        if (func.dataAdmissao) {
            document.getElementById('dataAdmissao').value = func.dataAdmissao.toString().substring(0, 10);
        }

        // Setor e Cargo: Tenta selecionar pelo ID
        // func.setor pode ser um objeto {id: 1, nome: "Vendas"} ou só o ID 1
        if (func.setor) {
            const idSetor = func.setor.id || func.setor;
            selecionarOpcao('setor', idSetor);
        }
        if (func.cargo) {
            const idCargo = func.cargo.id || func.cargo;
            selecionarOpcao('cargo', idCargo);
        }

        // Muda o texto do botão
        const btn = document.getElementById('btn-salvar');
        if(btn) btn.innerHTML = '<i class="bi bi-check-lg"></i> Atualizar Dados';

    } catch (erro) {
        console.error(erro);
        mostrarMensagem("Erro ao carregar dados. Tente recarregar.", "danger");
    }
}

// Função auxiliar para selecionar no <select>
function selecionarOpcao(idSelect, valor) {
    const select = document.getElementById(idSelect);
    if(select) select.value = valor;
}

// --- SALVAR (CRIA OU ATUALIZA) ---
async function salvarFuncionario(event, idEdicao) {
    event.preventDefault(); // Impede recarregar a página

    const btn = document.getElementById('btn-salvar');
    const textoOriginal = btn.innerHTML;
    btn.disabled = true;
    btn.innerText = "Processando...";

    // Monta o objeto para enviar
    const funcionario = {
        nome: document.getElementById('nome').value,
        cpf: document.getElementById('cpf').value,
        email: document.getElementById('email').value,
        dataAdmissao: document.getElementById('dataAdmissao').value,
        setor: { id: document.getElementById('setor').value },
        cargo: { id: document.getElementById('cargo').value }
    };

    // Define URL e Método
    let url = `${API_URL}/funcionarios`;
    let metodo = 'POST';

    // Se for edição, ajusta para PUT
    if (idEdicao) {
        url = `${API_URL}/funcionarios/${idEdicao}`;
        metodo = 'PUT';
        funcionario.id = idEdicao; 
    }

    try {
        const resposta = await fetch(url, {
            method: metodo,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(funcionario)
        });

        if (resposta.ok) {
            mostrarMensagem("Salvo com sucesso!", "success");
            setTimeout(() => {
                window.location.href = 'funcionarios.html';
            }, 1000);
        } else {
            const erroApi = await resposta.json();
            throw new Error(erroApi.mensagem || "Erro ao salvar");
        }

    } catch (erro) {
        console.error(erro);
        mostrarMensagem("Erro: " + erro.message, "danger");
        btn.disabled = false;
        btn.innerHTML = textoOriginal;
    }
}

function mostrarMensagem(texto, tipo) {
    const msgDiv = document.getElementById('msg-feedback');
    if (msgDiv) {
        msgDiv.className = `alert alert-${tipo}`;
        msgDiv.innerText = texto;
        msgDiv.classList.remove('d-none');
    } else {
        alert(texto);
    }
}