// funcionario-form.js - Cadastro e Edição
const API_URL = "http://localhost:8080/api";

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    // Se não tiver token, o app.js redireciona. Só paramos a execução.
    if (!token) return; 

    // 1. Carrega opções
    await carregarSelects(token);

    // 2. Verifica Edição
    const params = new URLSearchParams(window.location.search);
    const idEdicao = params.get('id');

    if (idEdicao) {
        const titulo = document.getElementById('titulo-pagina');
        if(titulo) titulo.textContent = 'Editar Colaborador';
        await carregarDadosEdicao(idEdicao, token);
    }

    // 3. Configura Form
    const form = document.getElementById('formUsuario'); // Ajuste o ID se for diferente no HTML
    // ou
    const form2 = document.getElementById('form-funcionario'); 
    
    const formAtivo = form || form2; // Pega o que existir

    if (formAtivo) {
        formAtivo.addEventListener('submit', (e) => salvarFuncionario(e, idEdicao, token));
    }
});

// --- CARREGA OS SELECTS ---
async function carregarSelects(token) {
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
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
        showError("Erro ao carregar opções");
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

// --- MODO EDIÇÃO ---
async function carregarDadosEdicao(id, token) {
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
        const res = await fetch(`${API_URL}/funcionarios/${id}`, { headers });
        if (!res.ok) throw new Error("Erro ao buscar dados");

        const func = await res.json();

        if(document.getElementById('nome')) document.getElementById('nome').value = func.nome;
        if(document.getElementById('cpf')) document.getElementById('cpf').value = func.cpf;
        if(document.getElementById('email')) document.getElementById('email').value = func.email;

        if (func.dataAdmissao) {
            document.getElementById('dataAdmissao').value = func.dataAdmissao.toString().substring(0, 10);
        }

        if (func.setor) selecionarOpcao('setor', func.setor.id || func.setor);
        if (func.cargo) selecionarOpcao('cargo', func.cargo.id || func.cargo);
        
        // Converte Boolean (ativo) para String (ATIVO/INATIVO)
        const statusSelect = document.getElementById('status');
        if (statusSelect && func.ativo !== undefined) {
            statusSelect.value = func.ativo ? 'ATIVO' : 'INATIVO';
        }

        const btn = document.getElementById('btn-salvar');
        if(btn) btn.innerHTML = '<i class="bi bi-check-lg"></i> Atualizar Dados';

    } catch (erro) {
        console.error(erro);
        showError("Erro ao carregar dados");
    }
}

function selecionarOpcao(idSelect, valor) {
    const select = document.getElementById(idSelect);
    if(select) select.value = valor;
}

// --- SALVAR ---
async function salvarFuncionario(event, idEdicao, token) {
    event.preventDefault();

    // Validações
    const cpfInput = document.getElementById('cpf');
    const emailInput = document.getElementById('email');
    const nomeInput = document.getElementById('nome');

    let valido = true;

    // Validar CPF
    if (!validarCPF(cpfInput.value)) {
        cpfInput.classList.add('is-invalid');
        showWarning('CPF inválido');
        valido = false;
    } else {
        cpfInput.classList.remove('is-invalid');
        cpfInput.classList.add('is-valid');
    }

    // Validar Email
    if (!validarEmail(emailInput.value)) {
        emailInput.classList.add('is-invalid');
        showWarning('E-mail inválido');
        valido = false;
    } else {
        emailInput.classList.remove('is-invalid');
        emailInput.classList.add('is-valid');
    }

    // Validar Nome
    if (!validarCampoObrigatorio(nomeInput.value)) {
        nomeInput.classList.add('is-invalid');
        showWarning('Nome é obrigatório');
        valido = false;
    } else {
        nomeInput.classList.remove('is-invalid');
        nomeInput.classList.add('is-valid');
    }

    if (!valido) return;

    const btn = document.getElementById('btn-salvar');
    setButtonLoading(btn, true);

    const funcionario = {
        nome: nomeInput.value,
        cpf: cpfInput.value,
        email: emailInput.value,
        dataAdmissao: document.getElementById('dataAdmissao').value,
        ativo: document.getElementById('status').value === 'ATIVO', // Converte para Boolean
        setor: { id: document.getElementById('setor').value },
        cargo: { id: document.getElementById('cargo').value }
    };

    let url = `${API_URL}/funcionarios`;
    let metodo = 'POST';

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
            showSuccess("Colaborador salvo com sucesso!");
            setTimeout(() => {
                window.location.href = 'funcionarios.html';
            }, 1500);
        } else {
            const erroApi = await resposta.json();
            showError(erroApi.mensagem || "Erro ao salvar");
            setButtonLoading(btn, false);
        }

    } catch (erro) {
        console.error(erro);
        showError("Erro de conexão");
        setButtonLoading(btn, false);
    }
}